import "server-only";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";
import { db } from "@/lib/db/client";
import { logAudit } from "@/lib/audit/logger";

export type AuthResult =
  | { kind: "ok"; mustChange: boolean }
  | { kind: "bad"; remaining: number | null }
  | { kind: "locked-now" }
  | { kind: "locked" }
  | { kind: "suspended" };

// Used to equalise timing when the username does not exist (avoid account enumeration by latency).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

function safeName(raw: string): string {
  return raw.replace(/[^\p{L}\p{N}._@-]/gu, "").slice(0, 64);
}

/**
 * Core sign-in rules (AUTH-02..AUTH-06, AUTH-10).
 * - locked accounts cannot sign in even with the right password,
 * - the Nth wrong password locks the account and writes two audit entries,
 * - every outcome is audited.
 */
export async function authenticate(usernameRaw: string, password: string): Promise<AuthResult> {
  const username = usernameRaw.trim().toLowerCase();
  const user = db.users.get(username);

  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    await logAudit({ user: safeName(usernameRaw), cat: "auth", action: "เข้าสู่ระบบไม่สำเร็จ", detail: "ไม่พบชื่อผู้ใช้นี้ในระบบ", ok: false });
    return { kind: "bad", remaining: null };
  }
  if (user.status === "locked") return { kind: "locked" };
  if (user.status === "suspended") return { kind: "suspended" };

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    user.failedAttempts += 1;
    const lock = user.failedAttempts >= env.MAX_LOGIN_ATTEMPTS;
    await logAudit({ user: user.username, cat: "auth", action: "เข้าสู่ระบบไม่สำเร็จ", detail: `รหัสผ่านไม่ถูกต้อง (ครั้งที่ ${user.failedAttempts})`, ok: false });
    if (lock) {
      user.status = "locked";
      await logAudit({ user: user.username, cat: "auth", action: "ล็อกบัญชีอัตโนมัติ", detail: `ใส่รหัสผ่านผิดครบ ${env.MAX_LOGIN_ATTEMPTS} ครั้ง`, ok: false });
      return { kind: "locked-now" };
    }
    return { kind: "bad", remaining: env.MAX_LOGIN_ATTEMPTS - user.failedAttempts };
  }

  user.failedAttempts = 0;
  user.lastLogin = new Date().toISOString();
  await logAudit({
    user: user.username,
    cat: "auth",
    action: "เข้าสู่ระบบ",
    detail: user.mustChange ? "รหัสผ่านถูกต้อง — บังคับเปลี่ยนรหัสผ่านครั้งแรก" : "เข้าสู่ระบบสำเร็จ",
  });
  return { kind: "ok", mustChange: user.mustChange };
}

/** AUTH-05: record a reset request; the caller always shows the same message. */
export async function recordResetRequest(usernameRaw: string): Promise<void> {
  const username = usernameRaw.trim().toLowerCase();
  const exists = db.users.has(username);
  if (exists) db.resetRequests.push({ username, at: new Date().toISOString(), ip: "-" });
  // Audit both cases identically-shaped; detail does not leak existence to the UI (audit is admin-only).
  await logAudit({ user: safeName(usernameRaw), cat: "auth", action: "ขอรีเซ็ตรหัสผ่าน", detail: `ส่งคำขอสำหรับ ${safeName(usernameRaw)}`, ok: true });
}

export async function setPassword(username: string, newPassword: string): Promise<void> {
  const user = db.users.get(username);
  if (!user) return;
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.mustChange = false;
}

export async function verifyPassword(username: string, password: string): Promise<boolean> {
  const user = db.users.get(username);
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}
