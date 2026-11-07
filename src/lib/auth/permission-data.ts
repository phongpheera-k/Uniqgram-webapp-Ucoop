/**
 * Role × module × action permission model (pure data, safe for client + server).
 * Source: design/prototype/Main.dc.html (MODS / ACTS / PERMS0 / ROLES0).
 * Permissions are data-driven; the live matrix is held in the store (editable in Story-0006).
 */

export type ModuleId = "member" | "pii" | "self" | "report" | "users" | "roles" | "audit" | "loan" | "deposit" | "finance";
export type ActionId = "view" | "add" | "edit" | "delete" | "approve" | "export";

export interface ModuleDef {
  id: ModuleId;
  label: string;
  acts: ActionId[];
  sensitive?: boolean;
  soon?: boolean;
}

export const MODS: ModuleDef[] = [
  { id: "member", label: "ทะเบียนสมาชิก", acts: ["view", "add", "edit", "delete", "approve", "export"] },
  { id: "pii", label: "เลขบัตรประชาชน (ดูเต็ม)", acts: ["view"], sensitive: true },
  { id: "self", label: "ข้อมูลของตนเอง", acts: ["view", "edit"] },
  { id: "report", label: "รายงานสรุป", acts: ["view", "export"] },
  { id: "users", label: "ผู้ใช้งานระบบ", acts: ["view", "add", "edit", "delete", "export"] },
  { id: "roles", label: "บทบาทและสิทธิ์", acts: ["view", "edit"] },
  { id: "audit", label: "บันทึกการใช้งาน (Audit log)", acts: ["view", "export"] },
  { id: "loan", label: "สินเชื่อ", acts: [], soon: true },
  { id: "deposit", label: "เงินฝาก", acts: [], soon: true },
  { id: "finance", label: "การเงิน / บัญชี", acts: [], soon: true },
];

export const ACTS: { id: ActionId; label: string }[] = [
  { id: "view", label: "ดู" },
  { id: "add", label: "เพิ่ม" },
  { id: "edit", label: "แก้ไข" },
  { id: "delete", label: "ลบ" },
  { id: "approve", label: "อนุมัติ" },
  { id: "export", label: "ส่งออก" },
];

export type PermissionMatrix = Record<string, Partial<Record<ModuleId, Partial<Record<ActionId, boolean>>>>>;

function mk(spec: Partial<Record<ModuleId, string>>): PermissionMatrix[string] {
  const p: PermissionMatrix[string] = {};
  for (const m of MODS) {
    p[m.id] = {};
    for (const a of m.acts) p[m.id]![a] = false;
  }
  for (const [k, v] of Object.entries(spec)) {
    for (const a of (v as string).split(",").filter(Boolean)) p[k as ModuleId]![a as ActionId] = true;
  }
  return p;
}

export const DEFAULT_PERMS: PermissionMatrix = {
  admin: mk({ member: "view,add,edit,delete,approve,export", report: "view,export", users: "view,add,edit,delete,export", roles: "view,edit", audit: "view,export" }),
  registrar: mk({ member: "view,add,edit,export", pii: "view", self: "view,edit", report: "view" }),
  approver: mk({ member: "view,approve", pii: "view", self: "view,edit", report: "view,export" }),
  committee: mk({ member: "view", self: "view,edit", report: "view,export", audit: "view" }),
  member: mk({ self: "view,edit" }),
};

export interface RoleDef {
  id: string;
  name: string;
  desc: string;
}

export const DEFAULT_ROLES: RoleDef[] = [
  { id: "admin", name: "ผู้ดูแลระบบ", desc: "จัดการผู้ใช้ บทบาท สิทธิ์ และดู Audit log" },
  { id: "registrar", name: "เจ้าหน้าที่ทะเบียน", desc: "สมัคร แก้ไขข้อมูล และดูประวัติสมาชิก" },
  { id: "approver", name: "ผู้อนุมัติ", desc: "อนุมัติหรือตีกลับคำขอสมัครและการเปลี่ยนแปลงสำคัญ" },
  { id: "committee", name: "กรรมการ", desc: "ดูข้อมูลและรายงานสรุปอย่างเดียว (read-only)" },
  { id: "member", name: "สมาชิก", desc: "ดูและแก้ไขโปรไฟล์ของตนเอง" },
];

export function matrixHas(matrix: PermissionMatrix, roleId: string, mod: ModuleId, act: ActionId): boolean {
  return !!matrix[roleId]?.[mod]?.[act];
}
