import "server-only";
import bcrypt from "bcryptjs";
import { DEFAULT_PERMS, DEFAULT_ROLES, type PermissionMatrix, type RoleDef } from "@/lib/auth/permission-data";
import { DEFAULT_FAVORITES } from "@/lib/menu";

/**
 * In-memory data store.
 *
 * The prototype has no backend; until a real database (Prisma/Drizzle/…) is chosen,
 * this module is the single seam that every DAL function goes through. Replace the
 * body of this file with a real client — callers only use the typed collections below.
 * State lives on `globalThis` so it survives Next.js dev hot-reloads.
 */

export type UserStatus = "active" | "suspended" | "locked";

export interface UserRecord {
  username: string;
  name: string;
  dept: string;
  role: string;
  status: UserStatus;
  /** ISO timestamp, null = never signed in. */
  lastLogin: string | null;
  passwordHash: string;
  mustChange: boolean;
  failedAttempts: number;
}

export interface SessionRecord {
  id: string;
  username: string;
  createdAt: number;
  lastActive: number;
  /** Signed in with a temporary password; must set a new one before using the app (AUTH-06). */
  mustChange: boolean;
}

export type AuditCategory = "auth" | "user" | "perm" | "data";

export interface AuditEntry {
  id: string;
  at: string; // ISO
  user: string;
  cat: AuditCategory;
  action: string;
  detail: string;
  ip: string;
  ok: boolean;
}

export interface ResetRequest {
  username: string;
  at: string;
  ip: string;
}

interface Store {
  users: Map<string, UserRecord>;
  sessions: Map<string, SessionRecord>;
  audit: AuditEntry[];
  perms: PermissionMatrix;
  roles: RoleDef[];
  favorites: Map<string, string[]>;
  resetRequests: ResetRequest[];
}

/** Demo password for ALL seed accounts (prototype). Never ship seed accounts to production. */
export const DEMO_PASSWORD = "Demo@1234";

function seedUsers(): Map<string, UserRecord> {
  const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  const u = (
    username: string,
    name: string,
    dept: string,
    role: string,
    lastLogin: string | null,
    extra: Partial<UserRecord> = {},
  ): [string, UserRecord] => [
    username,
    { username, name, dept, role, status: "active", lastLogin, passwordHash: hash, mustChange: false, failedAttempts: 0, ...extra },
  ];
  return new Map([
    u("admin.wipa", "วิภา ตัวอย่าง", "สำนักงานสหกรณ์", "admin", "2026-11-07T09:30:00+07:00"),
    u("reg.somsak", "สมศักดิ์ ทดสอบ", "ฝ่ายทะเบียน", "registrar", null, { mustChange: true }),
    u("reg.kanya", "กัญญา ตัวอย่าง", "ฝ่ายทะเบียน", "registrar", "2026-11-07T09:05:00+07:00"),
    u("appr.niran", "นิรันดร์ สมมติ", "ฝ่ายอนุมัติ", "approver", "2026-11-07T08:50:00+07:00"),
    u("comm.pranee", "ปราณี จำลอง", "คณะกรรมการดำเนินการ", "committee", "2026-11-07T08:31:00+07:00"),
    u("m100245", "อรุณี ทดลอง", "ฝ่ายบุคคล", "member", "2026-11-05T19:12:00+07:00"),
    u("m100231", "สมชาย ทดสอบ", "กองคลัง", "member", "2026-11-02T07:40:00+07:00"),
    u("temp.staff02", "อดิศักดิ์ ทดลอง", "ฝ่ายทะเบียน", "registrar", "2026-10-30T16:10:00+07:00", { status: "suspended" }),
    u("lock.user", "จารุวรรณ สมมติ", "กองการศึกษา", "member", "2026-11-01T12:00:00+07:00", { status: "locked", failedAttempts: 5 }),
  ]);
}

function seedAudit(): AuditEntry[] {
  const e = (
    d: string,
    t: string,
    user: string,
    cat: AuditCategory,
    action: string,
    detail: string,
    ip: string,
    ok = true,
  ): Omit<AuditEntry, "id"> => ({ at: `${d}T${t}:00+07:00`, user, cat, action, detail, ip, ok });
  const rows = [
    e("2026-11-07", "09:42", "admin.wipa", "perm", "แก้ไขสิทธิ์", "บทบาท ผู้อนุมัติ · รายงานสรุป › ส่งออก: ปิด → เปิด", "10.20.4.12"),
    e("2026-11-07", "09:30", "admin.wipa", "auth", "เข้าสู่ระบบ", "เข้าสู่ระบบสำเร็จ", "10.20.4.12"),
    e("2026-11-07", "09:15", "reg.kanya", "data", "เพิ่มข้อมูลสมาชิก", "บันทึกใบสมัคร AP-69-0420", "10.20.4.31"),
    e("2026-11-07", "08:58", "appr.niran", "data", "อนุมัติ", "อนุมัติใบสมัคร AP-69-0417", "10.20.4.40"),
    e("2026-11-07", "08:31", "comm.pranee", "auth", "เข้าสู่ระบบ", "เข้าสู่ระบบสำเร็จ", "10.20.5.8"),
    e("2026-11-07", "08:12", "lock.user", "auth", "ล็อกบัญชีอัตโนมัติ", "ใส่รหัสผ่านผิดครบ 5 ครั้ง", "10.20.6.77", false),
    e("2026-11-07", "08:11", "lock.user", "auth", "เข้าสู่ระบบไม่สำเร็จ", "รหัสผ่านไม่ถูกต้อง (ครั้งที่ 5)", "10.20.6.77", false),
    e("2026-11-07", "08:02", "admin.wipa", "user", "ระงับผู้ใช้", "temp.staff02 · เหตุผล: หมดสัญญา", "10.20.4.12"),
    e("2026-11-06", "16:20", "reg.kanya", "data", "ส่งออกข้อมูล", "รายชื่อสมาชิก (เลขบัตรปิดบางส่วน)", "10.20.4.31"),
    e("2026-11-06", "16:05", "admin.wipa", "user", "เพิ่มผู้ใช้", "reg.somsak · บทบาท เจ้าหน้าที่ทะเบียน", "10.20.4.12"),
    e("2026-11-06", "14:40", "admin.wipa", "user", "รีเซ็ตรหัสผ่าน", "comm.pranee", "10.20.4.12"),
    e("2026-11-05", "10:12", "somchai.x", "auth", "เข้าสู่ระบบไม่สำเร็จ", "ไม่พบชื่อผู้ใช้นี้ในระบบ", "203.0.113.45", false),
    e("2026-11-05", "09:00", "comm.pranee", "data", "ดูรายงาน", "รายงานสมาชิกเดือน ต.ค. 2569", "10.20.5.8"),
  ];
  // newest first
  return rows.map((r, i) => ({ ...r, id: `seed-${i}` }));
}

function create(): Store {
  return {
    users: seedUsers(),
    sessions: new Map(),
    audit: seedAudit(),
    perms: structuredClone(DEFAULT_PERMS),
    roles: structuredClone(DEFAULT_ROLES),
    favorites: new Map(),
    resetRequests: [],
  };
}

const g = globalThis as unknown as { __ucoopStore?: Store };
export const db: Store = (g.__ucoopStore ??= create());

export function getFavorites(username: string): string[] {
  return db.favorites.get(username) ?? [...DEFAULT_FAVORITES];
}
