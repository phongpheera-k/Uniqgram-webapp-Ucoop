"use server";

import { logAudit } from "@/lib/audit/logger";
import { requireUser } from "@/lib/auth/session";
import { changePasswordSchema } from "@/features/auth/schemas/auth-schemas";
import { setPassword, verifyPassword } from "@/features/auth/server/auth-service";
import { emptyPasswordState, type PasswordFormState } from "@/features/auth/types";

/**
 * ACC-03..06. Order of checks: schema → current password → must differ from current.
 * The password itself is never logged (ACC-06).
 */
export async function changePasswordAction(_prev: PasswordFormState, formData: FormData): Promise<PasswordFormState> {
  const user = await requireUser();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const fieldErrors: PasswordFormState["fieldErrors"] = {};
    for (const i of parsed.error.issues) fieldErrors[i.path[0] as keyof PasswordFormState["fieldErrors"]] ??= i.message;
    return { ...emptyPasswordState, fieldErrors };
  }
  const { currentPassword, newPassword } = parsed.data;

  if (!(await verifyPassword(user.username, currentPassword))) {
    await logAudit({ user: user.username, cat: "auth", action: "เปลี่ยนรหัสผ่านไม่สำเร็จ", detail: "รหัสผ่านปัจจุบันไม่ถูกต้อง", ok: false });
    return { ...emptyPasswordState, fieldErrors: { currentPassword: "รหัสผ่านปัจจุบันไม่ถูกต้อง" } };
  }
  if (newPassword === currentPassword) {
    return { ...emptyPasswordState, fieldErrors: { newPassword: "รหัสผ่านใหม่ต้องต่างจากรหัสผ่านเดิม" }, rejectedSame: newPassword };
  }
  await setPassword(user.username, newPassword);
  await logAudit({ user: user.username, cat: "auth", action: "เปลี่ยนรหัสผ่าน", detail: "ผู้ใช้เปลี่ยนรหัสผ่านของตนเอง" });
  return { ...emptyPasswordState, ok: true, message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" };
}
