import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/session";
import { getAccountProfile } from "@/features/account/server/account-queries";
import { AccountView } from "@/features/account/components/account-view";

export const metadata: Metadata = { title: "โปรไฟล์ของฉัน" };

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getAccountProfile();
  return (
    <>
      <PageHeader crumbs={[{ label: "หน้าหลัก", href: "/dashboard" }, { label: "บัญชีผู้ใช้" }, { label: "โปรไฟล์ของฉัน" }]} title="โปรไฟล์ของฉัน" desc="ข้อมูลบัญชีผู้ใช้และการตั้งค่าส่วนตัว" roleName={user.roleName} />
      <AccountView profile={profile} />
    </>
  );
}
