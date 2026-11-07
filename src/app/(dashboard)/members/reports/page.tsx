import type { Metadata } from "next";
import { ForbiddenView } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/session";
import { userCan } from "@/lib/auth/permissions";
import { getMemberReport } from "@/features/reports/server/report-queries";
import { MemberReportView } from "@/features/reports/components/member-report-view";

export const metadata: Metadata = { title: "รายงานสมาชิก" };

const crumbs = [{ label: "หน้าหลัก", href: "/dashboard" }, { label: "สมาชิก" }, { label: "รายงานสมาชิก" }];

export default async function MemberReportsPage() {
  const user = await requireUser();
  if (!userCan(user, "report", "view")) {
    return (
      <>
        <PageHeader crumbs={crumbs} title="ไม่มีสิทธิ์เข้าถึง" desc="บทบาทปัจจุบันไม่มีสิทธิ์ใช้งานเมนูนี้" roleName={user.roleName} />
        <ForbiddenView roleName={user.roleName} />
      </>
    );
  }
  const report = await getMemberReport();
  return (
    <>
      <PageHeader crumbs={crumbs} title="รายงานสมาชิก" desc="สรุปจำนวนสมาชิกเข้า–ออกรายเดือน" roleName={user.roleName} />
      <MemberReportView report={report} />
    </>
  );
}
