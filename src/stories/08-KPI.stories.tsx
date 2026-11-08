import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@/components/ui/icon";
import { KPI, KPI_GRID, KPI_VALUE, PANEL } from "@/components/ui/styles";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Component CSS/KPI Metric Cards",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const DashboardKPIs: StoryObj = {
  render: () => {
    const staffKpis = [
      { label: "สมาชิกทั้งหมด", value: "4,812", unit: "คน", note: "สมาชิกสามัญ 4,603 · สมทบ 209", icon: IC.users },
      { label: "สมัครใหม่เดือนนี้", value: "38", unit: "คน", note: "เพิ่มขึ้นจากเดือนก่อน 7 คน", icon: IC.userPlus },
      { label: "ใบสมัครรออนุมัติ", value: "12", unit: "รายการ", note: "เก่าสุดค้าง 4 วันทำการ", icon: IC.clock },
      { label: "ทุนเรือนหุ้นรวม", value: "386,245,900.00", unit: "บาท", note: "ณ วันที่ 31 ต.ค. 2569", icon: IC.bank },
    ];

    const memberKpis = [
      { label: "ทุนเรือนหุ้นสะสม", value: "128,400.00", unit: "บาท", note: "12,840 หุ้น · หุ้นละ 10 บาท", icon: IC.wallet },
      { label: "ส่งค่าหุ้นรายเดือน", value: "1,000.00", unit: "บาท", note: "หักผ่านเงินเดือนทุกสิ้นเดือน", icon: IC.coin },
      { label: "อายุการเป็นสมาชิก", value: "7", unit: "ปี 8 เดือน", note: "เข้าเป็นสมาชิกตั้งแต่ 3 มี.ค. 2562", icon: IC.idcard },
      { label: "เงินปันผลปีล่าสุด", value: "[รอประกาศ]", unit: "", note: "จะประกาศหลังการประชุมใหญ่สามัญ", icon: IC.chart },
    ];

    return (
      <div className="max-w-5xl space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-slate">การ์ดสรุปตัวเลข (KPI Metric Cards)</h1>
          <p className="text-sm text-muted">
            การ์ดสรุปสถิติประจำวันและสถานะทางการเงินสำหรับแดชบอร์ดเจ้าหน้าที่และสมาชิก
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-ink mb-3">มุมมองเจ้าหน้าที่ (Staff Dashboard)</h3>
          <div className={KPI_GRID}>
            {staffKpis.map((k) => (
              <div key={k.label} className={cn(PANEL, KPI)}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-sub">{k.label}</span>
                  <span className="flex size-8 items-center justify-center rounded-md bg-[#F1F4F6] text-teal">
                    <Icon d={k.icon} size={18} />
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={KPI_VALUE}>{k.value}</span>
                  {k.unit ? <span className="text-xs text-muted leading-[inherit]">{k.unit}</span> : null}
                </div>
                <div className="text-xs text-muted">{k.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-ink mb-3">มุมมองสมาชิก (Member Dashboard)</h3>
          <div className={KPI_GRID}>
            {memberKpis.map((k) => (
              <div key={k.label} className={cn(PANEL, KPI)}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-sub">{k.label}</span>
                  <span className="flex size-8 items-center justify-center rounded-md bg-teal-light text-teal">
                    <Icon d={k.icon} size={18} />
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={KPI_VALUE}>{k.value}</span>
                  {k.unit ? <span className="text-xs text-muted leading-[inherit]">{k.unit}</span> : null}
                </div>
                <div className="text-xs text-muted">{k.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
