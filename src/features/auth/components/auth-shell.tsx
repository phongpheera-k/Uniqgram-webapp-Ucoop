import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { AUTH_MAIN, AUTH_SIDE, AUTH_WRAP } from "@/components/ui/styles";

const POINTS = [
  { icon: IC.shield, text: "กำหนดสิทธิ์ตามบทบาท แยกหน้าที่ผู้บันทึกและผู้อนุมัติออกจากกัน" },
  { icon: IC.lock, text: "ปิดบังเลขบัตรประชาชนตามสิทธิ์ เพื่อคุ้มครองข้อมูลส่วนบุคคล (PDPA)" },
  { icon: IC.list, text: "บันทึกการใช้งานทุกรายการไว้ตรวจสอบย้อนหลังได้" },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={AUTH_WRAP}>
      <div className={AUTH_SIDE}>
        <div className="flex items-center gap-3.5">
          <span className="flex size-14 items-center justify-center rounded-xl bg-teal text-[28px] font-bold text-white shadow-[inset_0_0_0_1px_#2a7f99]">U</span>
          <span className="flex flex-col leading-tight">
            <span className="text-[26px] font-bold text-white">Ucoop</span>
            <span className="text-bar-chip-text">สหกรณ์ออมทรัพย์ตัวอย่าง · โลโก้ตัวแทน</span>
          </span>
        </div>
        <div className="flex max-w-[460px] flex-col gap-5">
          <h1 className="m-0 text-[30px] leading-[1.3] text-white">ระบบบริหารงานสหกรณ์ออมทรัพย์</h1>
          <p className="m-0 text-bar-chip-text">เข้าถึงข้อมูลสมาชิกอย่างปลอดภัย ตามสิทธิ์ที่ได้รับมอบหมายเท่านั้น</p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-start gap-3">
                <Icon d={p.icon} size={20} color="#4fb3d1" className="mt-0.5" />
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-bar-dim">ต้นแบบนี้ใช้ข้อมูลจำลองทั้งหมด ยังไม่เชื่อมต่อระบบจริง</div>
      </div>
      <main className={AUTH_MAIN}>
        <div className="w-[440px] max-w-full">{children}</div>
      </main>
    </div>
  );
}
