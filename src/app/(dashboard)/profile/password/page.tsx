import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/session";
import { ChangePasswordForm } from "@/features/account/components/change-password-form";

export const metadata: Metadata = { title: "เปลี่ยนรหัสผ่าน" };

export default async function ChangePasswordPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader crumbs={[{ label: "หน้าหลัก", href: "/dashboard" }, { label: "บัญชีผู้ใช้" }, { label: "เปลี่ยนรหัสผ่าน" }]} title="เปลี่ยนรหัสผ่าน" desc="ตั้งรหัสผ่านใหม่สำหรับเข้าสู่ระบบ" roleName={user.roleName} />
      <ChangePasswordForm />
    </>
  );
}
