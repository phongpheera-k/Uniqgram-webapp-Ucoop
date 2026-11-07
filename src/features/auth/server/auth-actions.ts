"use server";

import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { db } from "@/lib/db/client";
import { logAudit } from "@/lib/audit/logger";
import { createSession, destroySession, getSessionState, requireUser } from "@/lib/auth/session";
import { firstPasswordSchema, forgotSchema, loginSchema } from "@/features/auth/schemas/auth-schemas";
import { authenticate, recordResetRequest, setPassword, verifyPassword } from "@/features/auth/server/auth-service";
import type { ForgotState, LoginState, PasswordFormState } from "@/features/auth/types";

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ username: formData.get("username"), password: formData.get("password") });
  const typed = String(formData.get("username") ?? "").trim();
  if (!parsed.success) {
    return { username: typed, alert: { tone: "warn", icon: "alert", text: "กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบ" } };
  }
  const { username, password } = parsed.data;
  const r = await authenticate(username, password);

  switch (r.kind) {
    case "ok":
      await createSession(username.toLowerCase(), r.mustChange);
      redirect(r.mustChange ? "/first-password" : "/dashboard");
    case "bad":
      return {
        username,
        alert: {
          tone: "bad",
          icon: "alert",
          // AUTH-02: neutral message, never says which field was wrong.
          text: r.remaining === null ? "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" : `ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง — เหลืออีก ${r.remaining} ครั้งก่อนบัญชีถูกล็อก`,
        },
      };
    case "locked-now":
      return { username, alert: { tone: "bad", icon: "lock", text: `ใส่รหัสผ่านผิดครบ ${env.MAX_LOGIN_ATTEMPTS} ครั้ง บัญชีถูกล็อกอัตโนมัติ กรุณาติดต่อผู้ดูแลระบบ` } };
    case "locked":
      return { username, alert: { tone: "bad", icon: "lock", text: `บัญชีนี้ถูกล็อกเพราะใส่รหัสผ่านผิดครบ ${env.MAX_LOGIN_ATTEMPTS} ครั้ง กรุณาติดต่อผู้ดูแลระบบเพื่อปลดล็อก หรือใช้ “ลืมรหัสผ่าน”` } };
    case "suspended":
      return { username, alert: { tone: "warn", icon: "minus", text: "บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ" } };
  }
}

export async function forgotAction(_prev: ForgotState, formData: FormData): Promise<ForgotState> {
  const parsed = forgotSchema.safeParse({ username: formData.get("username") });
  const typed = String(formData.get("username") ?? "").trim();
  if (!parsed.success) return { sent: false, error: "กรุณากรอกชื่อผู้ใช้", username: typed };
  await recordResetRequest(parsed.data.username);
  // AUTH-05: identical outcome whether or not the account exists.
  return { sent: true, error: null, username: parsed.data.username };
}

export async function firstPasswordAction(_prev: PasswordFormState, formData: FormData): Promise<PasswordFormState> {
  const user = await requireUser({ allowMustChange: true });
  if (!user.mustChange) redirect("/dashboard");

  const parsed = firstPasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const fieldErrors: PasswordFormState["fieldErrors"] = {};
    for (const i of parsed.error.issues) fieldErrors[i.path[0] as keyof PasswordFormState["fieldErrors"]] ??= i.message;
    return { ok: false, fieldErrors, message: null, rejectedSame: null };
  }
  const { newPassword } = parsed.data;
  if (await verifyPassword(user.username, newPassword)) {
    return { ok: false, fieldErrors: { newPassword: "รหัสผ่านใหม่ต้องต่างจากรหัสผ่านเดิม" }, message: null, rejectedSame: newPassword };
  }
  await setPassword(user.username, newPassword);
  // Re-issue the session without the must-change flag.
  await destroySession();
  await createSession(user.username, false);
  await logAudit({ user: user.username, cat: "auth", action: "เปลี่ยนรหัสผ่าน", detail: "เปลี่ยนรหัสผ่านครั้งแรกสำเร็จ" });
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const st = await getSessionState();
  if (st.status === "ok") await logAudit({ user: st.user.username, cat: "auth", action: "ออกจากระบบ", detail: "ผู้ใช้ออกจากระบบ" });
  await destroySession();
  redirect("/login");
}

/** Called by the client idle guard when the 30-minute idle window elapses. */
export async function expireSessionAction(): Promise<string | null> {
  const st = await getSessionState();
  if (st.status === "expired") return st.username;
  if (st.status === "ok") {
    const u = st.user.username;
    await logAudit({ user: u, cat: "auth", action: "เซสชันหมดอายุ", detail: `ไม่มีการใช้งานเกิน ${env.SESSION_IDLE_MINUTES} นาที` });
    await destroySession();
    return u;
  }
  return null;
}

/** DEMO ONLY: switch to another seed account to preview a role's menus (the prototype's role switcher). */
export async function switchDemoUserAction(formData: FormData): Promise<void> {
  if (!env.DEMO_MODE) return;
  const current = await requireUser();
  const target = db.users.get(String(formData.get("username") ?? ""));
  if (!target || target.status !== "active" || target.mustChange) return;
  await logAudit({ user: current.username, cat: "auth", action: "สลับผู้ใช้ (โหมดทดลอง)", detail: `${current.username} → ${target.username}` });
  await destroySession();
  target.lastLogin = new Date().toISOString();
  await createSession(target.username, false);
  redirect("/dashboard");
}
