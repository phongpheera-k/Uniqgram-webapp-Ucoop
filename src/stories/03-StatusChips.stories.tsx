import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chip, ChipStatus, STATUS_CHIPS, StatusChip } from "@/components/ui/status-chip";
import { IC } from "@/lib/icons";

const meta: Meta = {
  title: "Component CSS/Status Chips",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const AllStatusChips: StoryObj = {
  render: () => {
    const statuses = Object.keys(STATUS_CHIPS) as ChipStatus[];

    return (
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate">ป้ายสถานะ (Status Chips)</h1>
          <p className="text-sm text-muted">
            ตามหลัก Accessible Design: ไม่สื่อความหมายด้วยสีเพียงอย่างเดียว แต่มีไอคอนกำกับควบคู่กับข้อความเสมอ
          </p>
        </div>

        {/* Semantic Status Chips */}
        <div className="rounded-lg border border-line bg-white p-6 space-y-4">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Semantic Member & Application Statuses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {statuses.map((st) => (
              <div key={st} className="flex items-center justify-between border-b border-line-soft pb-2.5">
                <span className="text-xs text-muted font-mono">{st}</span>
                <StatusChip status={st} />
              </div>
            ))}
          </div>
        </div>

        {/* Generic Tone Chips */}
        <div className="rounded-lg border border-line bg-white p-6 space-y-4">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Generic Tone Chips (Chip)</h3>
          <div className="flex flex-wrap gap-3">
            <Chip tone="ok" icon={IC.check}>สำเร็จ / ผ่านการตรวจสอบ</Chip>
            <Chip tone="warn" icon={IC.clock}>รอดำเนินการ 12 รายการ</Chip>
            <Chip tone="bad" icon={IC.alert}>มีข้อผิดพลาด 3 จุด</Chip>
            <Chip tone="mute" icon={IC.minus}>ระงับชั่วคราว</Chip>
            <Chip tone="info" icon={IC.clock}>เร็ว ๆ นี้</Chip>
          </div>
        </div>
      </div>
    );
  },
};
