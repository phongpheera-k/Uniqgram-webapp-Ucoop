import "server-only";
import { requirePermission } from "@/lib/auth/permissions";
import type { MemberSearchHit } from "@/features/shell/types";

/** Mock registry (names / IDs are fictitious). Replaced by a real DB in Story-0003. */
const MEMBERS: MemberSearchHit[] = [
  { id: "100231", name: "สมชาย ทดสอบ", dept: "กองคลัง", status: "active" },
  { id: "100245", name: "อรุณี ทดลอง", dept: "ฝ่ายบุคคล", status: "active" },
  { id: "100302", name: "ประเสริฐ สมมติ", dept: "กองช่าง", status: "active" },
  { id: "100390", name: "อนันต์ ตัวอย่างดี", dept: "กองคลัง", status: "active" },
  { id: "100377", name: "มาลี ทดสอบสอง", dept: "กองสาธารณสุข", status: "resigned" },
  { id: "100418", name: "กนกวรรณ ทดลอง", dept: "สำนักปลัด", status: "pending" },
  { id: "100419", name: "ธนพล จำลอง", dept: "กองการศึกษา", status: "pending" },
  { id: "100420", name: "ศิริพร สมมุติ", dept: "ฝ่ายบุคคล", status: "pending" },
];

/** SHL-08: member hits are only returned to users with member:view. Never returns NID. */
export async function searchMembers(query: string, limit = 4): Promise<MemberSearchHit[]> {
  await requirePermission("member", "view");
  const q = query.trim().toLowerCase().slice(0, 64);
  if (!q) return [];
  return MEMBERS.filter((m) => m.name.toLowerCase().includes(q) || m.id.includes(q)).slice(0, limit);
}
