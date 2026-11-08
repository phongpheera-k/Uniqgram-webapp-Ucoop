import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@/components/ui/icon";
import { StatusChip } from "@/components/ui/status-chip";
import { BTN_SM, LINK_BTN, PANEL, PANEL_H, TABLE } from "@/components/ui/styles";
import { IC } from "@/lib/icons";

const meta: Meta = {
  title: "Component CSS/Panels & Surfaces",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const PanelWithHeader: StoryObj = {
  render: () => {
    return (
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate">กล่องข้อมูลและพาเนล (Panels & Surfaces)</h1>
          <p className="text-sm text-muted">
            โครงสร้างการจัดวางพาเนล <code>PANEL</code> และส่วนหัว <code>PANEL_H</code> ของระบบ Ucoop
          </p>
        </div>

        {/* Panel with actions in header */}
        <div className={PANEL}>
          <div className={PANEL_H}>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-ink">ใบสมัครสมาชิกล่าสุด</h2>
              <span className="text-xs text-muted">แสดง 3 รายการล่าสุด</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className={BTN_SM}>
                <Icon d={IC.userPlus} size={14} />
                <span>สมัครสมาชิก</span>
              </button>
              <button type="button" className={LINK_BTN}>
                ดูทั้งหมด →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className={TABLE}>
              <thead>
                <tr>
                  <th>เลขที่ใบสมัคร</th>
                  <th>ชื่อ–สกุล</th>
                  <th>หน่วยงาน</th>
                  <th>วันที่ยื่น</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-teal">AP-69-0420</td>
                  <td>ศิริพร สมมุติ</td>
                  <td>ฝ่ายบุคคล</td>
                  <td className="tabular-nums">6 พ.ย. 2569</td>
                  <td><StatusChip status="pending" /></td>
                </tr>
                <tr>
                  <td className="font-semibold text-teal">AP-69-0419</td>
                  <td>ธนพล จำลอง</td>
                  <td>กองการศึกษา</td>
                  <td className="tabular-nums">4 พ.ย. 2569</td>
                  <td><StatusChip status="docs" /></td>
                </tr>
                <tr>
                  <td className="font-semibold text-teal">AP-69-0418</td>
                  <td>กนกวรรณ ทดลอง</td>
                  <td>สำนักปลัด</td>
                  <td className="tabular-nums">2 พ.ย. 2569</td>
                  <td><StatusChip status="approved" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel with description list */}
        <div className={PANEL}>
          <div className={PANEL_H}>
            <h2 className="text-base font-bold text-ink">ข้อมูลสังกัดและงาน</h2>
            <button type="button" className={BTN_SM}>แก้ไข</button>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[15px]">
              <div>
                <dt className="text-xs text-muted mb-0.5">หน่วยงาน / สังกัด</dt>
                <dd className="font-semibold text-ink m-0">กองคลัง</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-0.5">ตำแหน่ง</dt>
                <dd className="font-semibold text-ink m-0">นักวิชาการเงินและบัญชีชำนาญการ</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-0.5">สถานภาพการจ้างงาน</dt>
                <dd className="font-semibold text-ink m-0">ข้าราชการ</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-0.5">เงินเดือน</dt>
                <dd className="font-semibold text-ink m-0 tabular-nums">฿38,450.00</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  },
};
