import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { FirstPasswordForm } from "@/features/auth/components/first-password-form";

export const metadata: Metadata = { title: "ตั้งรหัสผ่านใหม่" };

export default async function FirstPasswordPage() {
  const user = await requireUser({ allowMustChange: true });
  if (!user.mustChange) redirect("/dashboard");
  return <FirstPasswordForm username={user.username} />;
}
