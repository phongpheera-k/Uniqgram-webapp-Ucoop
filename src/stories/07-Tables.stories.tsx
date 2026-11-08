import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@/components/ui/icon";
import { StatusChip } from "@/components/ui/status-chip";
import { NUM, PANEL, TABLE } from "@/components/ui/styles";
import { IC } from "@/lib/icons";

const meta: Meta = {
  title: "Component CSS/Tables & Data",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const DataTable: StoryObj = {
  render: () => {
    const members = [
      { id: "100231", name: "สมชาย ทดสอบ", nid: "×-xxxx-xxxxx-01-4", dept: "กองคลัง", date: "12 ม.ค. 2558", share: "245,800.00", status: "active" as const },
      { id: "100245", name: "อรุณี ทดลอง", nid: "×-xxxx-xxxxx-02-5", dept: "ฝ่ายบุคคล", date: "3 มี.ค. 2562", share: "128,400.00", status: "active" as const },
      { id: "100302", name: "ประเสริฐ สมมติ", nid: "×-xxxx-xxxxx-03-6", dept: "กองช่าง", date: "21 ส.ค. 2563", share: "96,250.00", status: "active" as const },
      { id: "100377", name: "มาลี ทดสอบสอง", nid: "×-xxxx-xxxxx-05-8", dept: "กองสาธารณสุข", date: "15 มิ.ย. 2564", share: "54,900.00", status: "resigned" as const },
      { id: "—", name: "กนกวรรณ ทดลอง", nid: "×-xxxx-xxxxx-06-9", dept: "สำนักปลัด", date: "รออนุมัติ", share: "0.00", status: "pending" as const },
    ];

    return (
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate">ตารางข้อมูล (Tables & Data Lists)</h1>
          <p className="text-sm text-muted">
            ตารางแสดงผลตามข้อกำหนด: รองรับการเลื่อนแนวนอนบนมือถือ (min-w-[520px]), ตัวเลขจัดชิดขวาแบบ tabular-nums,
            และปิดบังเลขบัตรประชาชนตามมาตรฐาน PDPA
          </p>
        </div>

        <div className={PANEL}>
          <div className="overflow-x-auto">
            <table className={TABLE}>
              <thead>
                <tr>
                  <th>
                    <button type="button" className="inline-flex items-center gap-1 font-semibold text-sub hover:text-ink">
                      <span>เลขสมาชิก</span>
                      <Icon d={IC.sort} size={14} />
                    </button>
                  </th>
                  <th>
                    <button type="button" className="inline-flex items-center gap-1 font-semibold text-sub hover:text-ink">
                      <span>ชื่อ–สกุล</span>
                      <Icon d={IC.sort} size={14} />
                    </button>
                  </th>
                  <th>เลขบัตรประชาชน (PDPA)</th>
                  <th>หน่วยงาน</th>
                  <th>วันที่เข้าเป็นสมาชิก</th>
                  <th className="num">ทุนเรือนหุ้นสะสม (บาท)</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-teal tabular-nums">{m.id}</td>
                    <td className="font-medium text-ink">{m.name}</td>
                    <td className="tabular-nums text-muted font-mono text-xs">{m.nid}</td>
                    <td>{m.dept}</td>
                    <td className="tabular-nums text-sub">{m.date}</td>
                    <td className={NUM}>{m.share}</td>
                    <td><StatusChip status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  },
};
