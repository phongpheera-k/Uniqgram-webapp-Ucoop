"use server";

import { logAudit } from "@/lib/audit/logger";
import { requirePermission } from "@/lib/auth/permissions";
import { computeMemberReport } from "@/features/reports/server/report-queries";
import { toCsv } from "@/features/reports/server/report-service";

export type ExportResult = { ok: true; filename: string; csv: string } | { ok: false; message: string };

/** RPT-05: only users with report:export; every export is audited. */
export async function exportMemberReportAction(): Promise<ExportResult> {
  let user;
  try {
    user = await requirePermission("report", "export");
  } catch {
    return { ok: false, message: "คุณไม่มีสิทธิ์ส่งออกรายงาน" };
  }
  const { rows, depts } = computeMemberReport();
  await logAudit({ user: user.username, cat: "data", action: "ส่งออกข้อมูล", detail: "รายงานสมาชิก 6 เดือน" });
  return { ok: true, filename: "ucoop-member-report.csv", csv: toCsv(rows, depts) };
}
