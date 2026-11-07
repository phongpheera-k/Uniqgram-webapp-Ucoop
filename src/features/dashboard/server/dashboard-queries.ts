import "server-only";
import { readAudit } from "@/lib/audit/logger";
import { requireUser, type CurrentUser } from "@/lib/auth/session";
import { userCan, userCanSee } from "@/lib/auth/permissions";
import { MENU_ITEMS } from "@/lib/menu";
import { IC } from "@/lib/icons";
import { formatBaht, formatInt } from "@/lib/formatters/currency";
import { formatThaiDate, formatTime } from "@/lib/formatters/date";
import { computeMemberReport } from "@/features/reports/server/report-queries";
import type { ChipStatus } from "@/components/ui/status-chip";

/**
 * Dashboard data. All figures other than the member total (computed from the report) are
 * fixed demo values from the prototype — a real implementation must compute them from live data.
 */
export interface Kpi { label: string; value: string; unit: string; note: string; icon?: string }
export interface Task { label: string; sub: string; count: string; status: ChipStatus; route: string }
export interface AppRow { no: string; name: string; dept: string; date: string; amount: string; status: ChipStatus }
export interface AuditRow { id: string; time: string; user: string; action: string }
export interface ModuleRow { label: string; icon: string; status: ChipStatus }

export interface StaffDashboard {
  kind: "staff";
  kpis: Kpi[];
  apps: AppRow[];
  tasks: Task[];
  modules: ModuleRow[];
  audit: AuditRow[] | null; // null = user lacks audit:view (panel hidden)
  canSeeMembers: boolean;
  canSeeAudit: boolean;
}

export interface MemberDashboard {
  kind: "member";
  kpis: Kpi[];
  info: Array<{ label: string; value: string }>;
  shares: Array<{ period: string; date: string; amount: string; total: string }>;
}

const TASKS: Record<string, Task[]> = {
  admin: [
    { label: "ใบสมัครรออนุมัติ", sub: "ส่งต่อให้ผู้อนุมัติ", count: "12", status: "pending", route: "/members/approvals" },
    { label: "คำขอรีเซ็ตรหัสผ่าน", sub: "จากเจ้าหน้าที่ 2 คน", count: "2", status: "docs", route: "/admin/users" },
    { label: "บัญชีผู้ใช้ใกล้หมดอายุ", sub: "ภายใน 30 วัน", count: "4", status: "docs", route: "/admin/users" },
  ],
  registrar: [
    { label: "ใบสมัครรอเอกสารเพิ่มเติม", sub: "ต้องติดต่อผู้สมัคร", count: "3", status: "docs", route: "/members" },
    { label: "ใบสมัครที่บันทึกวันนี้", sub: "ส่งเข้าคิวอนุมัติแล้ว", count: "5", status: "approved", route: "/members" },
  ],
  approver: [
    { label: "ใบสมัครรออนุมัติ", sub: "เรียงตามวันที่ยื่น", count: "12", status: "pending", route: "/members/approvals" },
    { label: "ค้างเกิน 3 วันทำการ", sub: "ควรพิจารณาก่อน", count: "2", status: "rejected", route: "/members/approvals" },
  ],
  committee: [{ label: "รายงานสมาชิกเดือน ต.ค. 2569", sub: "รอรับทราบในที่ประชุม", count: "1", status: "pending", route: "/members/reports" }],
};

const APPS: AppRow[] = [
  { no: "AP-69-0420", name: "ศิริพร สมมุติ", dept: "ฝ่ายบุคคล", date: "6 พ.ย. 2569", amount: "1,000.00", status: "pending" },
  { no: "AP-69-0419", name: "ธนพล จำลอง", dept: "กองการศึกษา", date: "4 พ.ย. 2569", amount: "1,000.00", status: "docs" },
  { no: "AP-69-0418", name: "กนกวรรณ ทดลอง", dept: "สำนักปลัด", date: "2 พ.ย. 2569", amount: "2,000.00", status: "pending" },
  { no: "AP-69-0417", name: "วรวุฒิ ทดสอบ", dept: "กองช่าง", date: "1 พ.ย. 2569", amount: "1,500.00", status: "approved" },
  { no: "AP-69-0416", name: "ชลธิชา จำลอง", dept: "กองคลัง", date: "30 ต.ค. 2569", amount: "1,000.00", status: "rejected" },
];

const MODULES: ModuleRow[] = [
  { label: "ทะเบียนสมาชิก", icon: IC.users, status: "live" },
  { label: "ผู้ใช้และสิทธิ์ (Admin)", icon: IC.key, status: "live" },
  { label: "สินเชื่อ", icon: IC.coin, status: "soon" },
  { label: "เงินฝาก", icon: IC.bank, status: "soon" },
  { label: "การเงิน / บัญชี", icon: IC.chart, status: "soon" },
];

/** Staff = anyone who may view the member registry. Others get the self-service dashboard. */
export function isStaff(user: Pick<CurrentUser, "role">): boolean {
  return userCan(user, "member", "view");
}

function accessibleTasks(user: CurrentUser): Task[] {
  return (TASKS[user.role] ?? []).filter((t) => {
    const item = MENU_ITEMS.find((i) => i.route === t.route);
    return !item || userCanSee(user, item);
  });
}

export async function getDashboard(): Promise<StaffDashboard | MemberDashboard> {
  const user = await requireUser();

  if (!isStaff(user)) {
    return {
      kind: "member",
      kpis: [
        { label: "ทุนเรือนหุ้นสะสม", value: "128,400.00", unit: "บาท", note: "12,840 หุ้น · หุ้นละ 10 บาท" },
        { label: "ส่งค่าหุ้นรายเดือน", value: "1,000.00", unit: "บาท", note: "หักผ่านเงินเดือนทุกสิ้นเดือน" },
        { label: "อายุการเป็นสมาชิก", value: "7", unit: "ปี 8 เดือน", note: "ตั้งแต่ 3 มี.ค. 2562" },
        { label: "เงินปันผลปีล่าสุด", value: "[รอประกาศ]", unit: "", note: "ประกาศหลังประชุมใหญ่สามัญ" },
      ],
      info: [
        { label: "เลขสมาชิก", value: "100245" },
        { label: "ชื่อ–สกุล", value: user.name },
        { label: "หน่วยงาน", value: user.dept },
        { label: "วันที่เป็นสมาชิก", value: "3 มี.ค. 2562" },
      ],
      shares: [
        { period: "ต.ค. 2569", date: "31 ต.ค. 2569", amount: formatBaht(1000), total: "128,400.00" },
        { period: "ก.ย. 2569", date: "30 ก.ย. 2569", amount: formatBaht(1000), total: "127,400.00" },
        { period: "ส.ค. 2569", date: "31 ส.ค. 2569", amount: formatBaht(1000), total: "126,400.00" },
        { period: "ก.ค. 2569", date: "31 ก.ค. 2569", amount: formatBaht(1000), total: "125,400.00" },
      ],
    };
  }

  const totals = computeMemberReport().totals;
  const canSeeAudit = userCan(user, "audit", "view");
  return {
    kind: "staff",
    kpis: [
      { label: "สมาชิกทั้งหมด", value: formatInt(totals.latestClosing ?? 0), unit: "คน", note: "สมาชิกสามัญ 4,603 · สมทบ 209", icon: IC.users },
      { label: "สมัครใหม่เดือนนี้", value: "38", unit: "คน", note: "เดือนก่อน 31 คน", icon: IC.userPlus },
      { label: "ใบสมัครรออนุมัติ", value: "12", unit: "รายการ", note: "เก่าสุด 4 วัน", icon: IC.clock },
      { label: "ทุนเรือนหุ้นรวม", value: "386,245,900.00", unit: "บาท", note: "ณ 31 ต.ค. 2569", icon: IC.bank },
    ],
    apps: APPS,
    tasks: accessibleTasks(user),
    modules: MODULES,
    audit: canSeeAudit
      ? readAudit(5).map((e) => ({ id: e.id, time: `${formatThaiDate(new Date(e.at))} ${formatTime(new Date(e.at))}`, user: e.user, action: e.action + (e.detail ? ` — ${e.detail}` : "") }))
      : null,
    canSeeMembers: userCan(user, "member", "view"),
    canSeeAudit,
  };
}
