import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";

const POINTS = [
  { icon: IC.shield, text: "กำหนดสิทธิ์ตามบทบาท แยกหน้าที่ผู้บันทึกและผู้อนุมัติออกจากกัน" },
  { icon: IC.lock, text: "ปิดบังเลขบัตรประชาชนตามสิทธิ์ เพื่อคุ้มครองข้อมูลส่วนบุคคล (PDPA)" },
  { icon: IC.list, text: "บันทึกการใช้งานทุกรายการไว้ตรวจสอบย้อนหลังได้" },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 56, height: 56, borderRadius: 12, background: "var(--teal)", boxShadow: "inset 0 0 0 1px #2a7f99", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28, color: "#fff" }}>U</span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
            <span style={{ fontWeight: 700, fontSize: 26, color: "#fff" }}>Ucoop</span>
            <span style={{ color: "#b8c6d0" }}>สหกรณ์ออมทรัพย์ตัวอย่าง · โลโก้ตัวแทน</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 460 }}>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.3, color: "#fff" }}>ระบบบริหารงานสหกรณ์ออมทรัพย์</h1>
          <p style={{ margin: 0, color: "#b8c6d0" }}>เข้าถึงข้อมูลสมาชิกอย่างปลอดภัย ตามสิทธิ์ที่ได้รับมอบหมายเท่านั้น</p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {POINTS.map((p) => (
              <li key={p.text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Icon d={p.icon} size={20} color="#4fb3d1" style={{ marginTop: 2 }} />
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ fontSize: 14, color: "#a9b7c2" }}>ต้นแบบนี้ใช้ข้อมูลจำลองทั้งหมด ยังไม่เชื่อมต่อระบบจริง</div>
      </div>
      <main className="auth-main">
        <div style={{ width: 440, maxWidth: "100%" }}>{children}</div>
      </main>
    </div>
  );
}
