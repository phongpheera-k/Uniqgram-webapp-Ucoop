import "server-only";
import { logAudit } from "@/lib/audit/logger";
import { requirePermission } from "@/lib/auth/permissions";
import { userCan } from "@/lib/auth/permissions";
import { buildDeptRows, buildMonthlyRows, summarizeRows, type DeptRow, type MonthlyRow, type ReportTotals } from "@/features/reports/server/report-service";

/**
 * Mock source data (fictitious). Replace with warehouse/DB aggregates later.
 * Opening balance = members at the end of the month before the first row (30 เม.ย. 2569).
 */
const OPENING = 4699;
const FLOWS = [
  { label: "พ.ค. 2569", joined: 24, left: 5 },
  { label: "มิ.ย. 2569", joined: 31, left: 7 },
  { label: "ก.ค. 2569", joined: 27, left: 9 },
  { label: "ส.ค. 2569", joined: 22, left: 8 },
  { label: "ก.ย. 2569", joined: 35, left: 11 },
  { label: "ต.ค. 2569", joined: 31, left: 17 },
];
const DEPTS: Array<[string, number]> = [
  ["กองคลัง", 1024], ["กองการศึกษา", 1021], ["กองช่าง", 845], ["สำนักปลัด", 733], ["ฝ่ายบุคคล", 612], ["กองสาธารณสุข", 577],
];

export interface MemberReport {
  rows: MonthlyRow[];
  totals: ReportTotals;
  depts: DeptRow[];
  canExport: boolean;
}

export function computeMemberReport(): Omit<MemberReport, "canExport"> {
  const rows = buildMonthlyRows(OPENING, FLOWS);
  const totals = summarizeRows(rows);
  const { rows: depts, total } = buildDeptRows(DEPTS);
  // Acceptance criterion: department breakdown must reconcile with the headline total.
  if (rows.length > 0 && totals.latestClosing !== total) {
    throw new Error(`Report reconciliation failed: departments ${total} ≠ members ${totals.latestClosing}`);
  }
  return { rows, totals, depts };
}

/** RPT-01 / RPT-06: requires report:view; opening the report is written to the audit log. */
export async function getMemberReport(): Promise<MemberReport> {
  const user = await requirePermission("report", "view");
  const data = computeMemberReport();
  await logAudit({ user: user.username, cat: "data", action: "ดูรายงาน", detail: `รายงานสมาชิก ${data.rows.length} เดือน${data.totals.latestLabel ? ` (ล่าสุด ${data.totals.latestLabel})` : ""}` });
  return { ...data, canExport: userCan(user, "report", "export") };
}
