import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/session";
import { getDashboard } from "@/features/dashboard/server/dashboard-queries";
import { StaffDashboardView } from "@/features/dashboard/components/staff-dashboard";
import { MemberDashboardView } from "@/features/dashboard/components/member-dashboard";

export const metadata: Metadata = { title: "ภาพรวม" };

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboard();
  return (
    <>
      <PageHeader crumbs={[{ label: "หน้าหลัก" }, { label: "ภาพรวม" }]} title="ภาพรวม" desc={`สวัสดี คุณ${user.name} — สรุปงานของวันนี้ (ข้อมูลจำลอง)`} roleName={user.roleName} />
      {data.kind === "staff" ? <StaffDashboardView data={data} /> : <MemberDashboardView data={data} />}
    </>
  );
}
