import type { ActionId, ModuleId } from "@/lib/auth/permission-data";
import { IC } from "@/lib/icons";

/** Start-menu catalog (SHL-02). Pure data — permission filtering happens on the server. */
export interface MenuCategoryDef {
  id: string;
  label: string;
  icon: string;
  soon?: boolean;
}

export interface MenuItemDef {
  id: string;
  cat: string;
  label: string;
  desc: string;
  icon: string;
  route?: string;
  soon?: boolean;
  /** Permission required to see / open the item. `null` = any signed-in user. */
  perm: [ModuleId, ActionId] | null;
  /** Items without a permission mapping fall back to role ids (placeholders for “soon” modules). */
  roles?: string[];
}

export const MENU_CATEGORIES: MenuCategoryDef[] = [
  { id: "fav", label: "Favorite", icon: IC.star },
  { id: "member", label: "สมาชิก", icon: IC.users },
  { id: "loan", label: "สินเชื่อ", icon: IC.coin, soon: true },
  { id: "deposit", label: "เงินฝาก", icon: IC.bank, soon: true },
  { id: "finance", label: "การเงิน", icon: IC.chart, soon: true },
  { id: "admin", label: "Admin", icon: IC.shield },
];

const ALL = ["admin", "registrar", "approver", "committee", "member"];

export const MENU_ITEMS: MenuItemDef[] = [
  { id: "home", cat: "general", label: "ภาพรวม", desc: "Dashboard สรุปงานประจำวัน", icon: IC.grid, route: "/dashboard", perm: null },
  { id: "m-register", cat: "member", label: "สมัครสมาชิก", desc: "บันทึกใบสมัครสมาชิกใหม่", icon: IC.userPlus, route: "/members/register", perm: ["member", "add"] },
  { id: "m-list", cat: "member", label: "รายชื่อสมาชิก", desc: "ค้นหาและดูข้อมูลสมาชิกทั้งหมด", icon: IC.users, route: "/members", perm: ["member", "view"] },
  { id: "m-approve", cat: "member", label: "อนุมัติใบสมัคร", desc: "ตรวจและอนุมัติใบสมัครที่รอดำเนินการ", icon: IC.approve, route: "/members/approvals", perm: ["member", "approve"] },
  { id: "m-report", cat: "member", label: "รายงานสมาชิก", desc: "สรุปจำนวนสมาชิกเข้า–ออกรายเดือน", icon: IC.report, route: "/members/reports", perm: ["report", "view"] },
  { id: "m-me", cat: "member", label: "ข้อมูลของฉัน", desc: "ข้อมูลสมาชิกและทุนเรือนหุ้นของตนเอง", icon: IC.idcard, route: "/me", perm: ["self", "view"] },
  { id: "l-apply", cat: "loan", label: "ยื่นคำขอกู้", desc: "คำขอกู้สามัญ ฉุกเฉิน และพิเศษ", icon: IC.coin, perm: null, roles: ALL, soon: true },
  { id: "l-contract", cat: "loan", label: "สัญญาเงินกู้", desc: "ทะเบียนสัญญาและผู้ค้ำประกัน", icon: IC.report, perm: null, roles: ["admin", "registrar", "approver", "committee"], soon: true },
  { id: "l-schedule", cat: "loan", label: "ตารางผ่อนชำระ", desc: "งวดชำระ เงินต้น และดอกเบี้ย", icon: IC.calc, perm: null, roles: ALL, soon: true },
  { id: "d-open", cat: "deposit", label: "เปิดบัญชีเงินฝาก", desc: "ออมทรัพย์ ออมทรัพย์พิเศษ ประจำ", icon: IC.bank, perm: null, roles: ["admin", "registrar"], soon: true },
  { id: "d-trans", cat: "deposit", label: "ฝาก–ถอน", desc: "บันทึกรายการฝากและถอนเงิน", icon: IC.wallet, perm: null, roles: ["admin", "registrar"], soon: true },
  { id: "d-mine", cat: "deposit", label: "บัญชีเงินฝากของฉัน", desc: "ยอดคงเหลือและรายการเคลื่อนไหว", icon: IC.wallet, perm: null, roles: ["member"], soon: true },
  { id: "f-cash", cat: "finance", label: "รับ–จ่ายเงิน", desc: "ใบเสร็จรับเงินและใบสำคัญจ่าย", icon: IC.wallet, perm: null, roles: ["admin", "approver", "committee"], soon: true },
  { id: "f-ledger", cat: "finance", label: "บัญชีแยกประเภท", desc: "สมุดรายวันและบัญชีแยกประเภท", icon: IC.ledger, perm: null, roles: ["admin", "committee"], soon: true },
  { id: "f-stmt", cat: "finance", label: "งบการเงิน", desc: "งบแสดงฐานะการเงินและงบกำไรขาดทุน", icon: IC.chart, perm: null, roles: ["admin", "committee"], soon: true },
  { id: "a-users", cat: "admin", label: "ผู้ใช้งานระบบ", desc: "เพิ่ม แก้ไข ระงับบัญชีผู้ใช้", icon: IC.user, route: "/admin/users", perm: ["users", "view"] },
  { id: "a-roles", cat: "admin", label: "บทบาทและสิทธิ์", desc: "กำหนดสิทธิ์การเข้าถึงแต่ละเมนู", icon: IC.key, route: "/admin/roles", perm: ["roles", "view"] },
  { id: "a-audit", cat: "admin", label: "บันทึกการใช้งาน", desc: "ประวัติการเข้าระบบและการแก้ไขข้อมูล", icon: IC.list, route: "/admin/audit", perm: ["audit", "view"] },
];

export const DEFAULT_FAVORITES = ["home", "m-list", "m-approve", "m-me"];

export function findMenuItem(id: string): MenuItemDef | undefined {
  return MENU_ITEMS.find((i) => i.id === id);
}
