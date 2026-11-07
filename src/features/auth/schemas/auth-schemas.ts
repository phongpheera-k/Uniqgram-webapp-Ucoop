import { z } from "zod";
import { passwordRulesPass } from "@/lib/auth/password-rules";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "กรุณากรอกชื่อผู้ใช้").max(64),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน").max(256),
});

export const forgotSchema = z.object({
  username: z.string().trim().min(1, "กรุณากรอกชื่อผู้ใช้").max(64),
});

/** New password + confirmation (rules AUTH-07 / ACC-05). The "different from old" rule is checked server-side. */
const newPasswordFields = {
  newPassword: z
    .string()
    .max(256)
    .refine((v) => passwordRulesPass(v, null), "รหัสผ่านใหม่ไม่ผ่านเงื่อนไขที่กำหนด"),
  confirmPassword: z.string().max(256),
};

export const firstPasswordSchema = z.object(newPasswordFields).refine((d) => d.newPassword === d.confirmPassword, {
  path: ["confirmPassword"],
  message: "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
});

export const changePasswordSchema = z
  .object({ currentPassword: z.string().min(1, "กรุณากรอกรหัสผ่านปัจจุบัน").max(256), ...newPasswordFields })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
  });
