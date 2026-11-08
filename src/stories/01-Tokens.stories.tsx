import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "Design Tokens/Theme & Tokens",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const ColorPalette: StoryObj = {
  render: () => {
    const brandColors = [
      { name: "Teal (Primary)", token: "bg-teal text-white", hex: "#0E5A73" },
      { name: "Teal Dark", token: "bg-teal-dark text-white", hex: "#0A4457" },
      { name: "Teal Light", token: "bg-teal-light text-teal-dark", hex: "#E6F0F3" },
      { name: "Teal Accent", token: "bg-teal-accent text-slate", hex: "#4FB3D1" },
      { name: "Slate (Top Bar)", token: "bg-slate text-white", hex: "#10202B" },
      { name: "Neutral (Page BG)", token: "bg-neutral text-ink border border-line", hex: "#F3F5F7" },
    ];

    const textColors = [
      { name: "Ink (Primary text)", token: "bg-ink text-white", hex: "#1B2530" },
      { name: "Sub (Secondary text)", token: "bg-sub text-white", hex: "#4A5560" },
      { name: "Muted (Tertiary text)", token: "bg-muted text-white", hex: "#5A6672" },
      { name: "Icon (Muted icons)", token: "bg-icon text-white", hex: "#77838F" },
    ];

    const statusColors = [
      { name: "OK (Success text)", token: "bg-ok text-white", hex: "#1A6439" },
      { name: "OK BG (Success pill)", token: "bg-ok-bg text-ok", hex: "#E3F2E8" },
      { name: "Warn (Warning text)", token: "bg-warn text-white", hex: "#744B00" },
      { name: "Warn BG (Warning pill)", token: "bg-warn-bg text-warn", hex: "#FCEFD3" },
      { name: "Bad (Danger text)", token: "bg-bad text-white", hex: "#9E1C12" },
      { name: "Bad BG (Danger pill)", token: "bg-bad-bg text-bad", hex: "#FBE5E3" },
      { name: "Mute (Disabled text)", token: "bg-mute text-white", hex: "#46515C" },
      { name: "Mute BG (Disabled pill)", token: "bg-mute-bg text-mute", hex: "#ECEFF2" },
    ];

    const surfaceColors = [
      { name: "Line", token: "bg-line text-ink", hex: "#DCE1E6" },
      { name: "Line Soft", token: "bg-line-soft text-ink", hex: "#EBEEF1" },
      { name: "Line Strong", token: "bg-line-strong text-ink", hex: "#C5CED6" },
      { name: "Row Hover", token: "bg-row text-ink border border-line", hex: "#F7FAFB" },
      { name: "Nav Hover", token: "bg-hover text-teal border border-line", hex: "#EEF4F6" },
      { name: "Panel Header", token: "bg-panel-h text-ink border border-line", hex: "#FAFBFC" },
    ];

    const renderGrid = (title: string, list: typeof brandColors) => (
      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-ink">{title}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-lg border border-line bg-white shadow-xs">
              <div className={`h-16 w-full ${c.token} flex items-center justify-center p-2 text-center text-xs font-semibold`}>
                {c.hex}
              </div>
              <div className="p-2.5">
                <div className="text-xs font-bold text-ink truncate">{c.name}</div>
                <div className="text-[11px] text-muted">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate">Ucoop Design Tokens (Tailwind v4 @theme)</h1>
          <p className="text-sm text-muted">
            ชุดสีและตัวแปรหลักของระบบสหกรณ์ออมทรัพย์ Ucoop กำหนดผ่าน Tailwind CSS v4 (@theme ใน src/app/globals.css)
          </p>
        </div>
        {renderGrid("Brand Colors", brandColors)}
        {renderGrid("Text & Icon Colors", textColors)}
        {renderGrid("Status Colors (Tokens)", statusColors)}
        {renderGrid("Lines & Surfaces", surfaceColors)}
      </div>
    );
  },
};

export const Typography: StoryObj = {
  render: () => {
    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate">Typography — ฟอนต์ Sarabun</h1>
          <p className="text-sm text-muted">
            ใช้ฟอนต์ Sarabun สำหรับภาษาไทยและภาษาอังกฤษ พร้อมระบบ Line-height 1.5 เป็นมาตรฐาน
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-line bg-white p-6">
          <div className="border-b border-line-soft pb-3">
            <span className="text-xs text-muted">Heading 1 (text-2xl / text-[26px] font-bold)</span>
            <h1 className="text-[26px] font-bold text-slate">ระบบบริหารงานสหกรณ์ออมทรัพย์ Ucoop</h1>
          </div>
          <div className="border-b border-line-soft pb-3">
            <span className="text-xs text-muted">Heading 2 (text-xl font-bold)</span>
            <h2 className="text-xl font-bold text-ink">รายชื่อสมาชิกสหกรณ์ออมทรัพย์สามัญ</h2>
          </div>
          <div className="border-b border-line-soft pb-3">
            <span className="text-xs text-muted">Heading 3 (text-base font-bold)</span>
            <h3 className="text-base font-bold text-ink">ภาพรวมและงานประจำวันที่ต้องดำเนินการ</h3>
          </div>
          <div className="border-b border-line-soft pb-3">
            <span className="text-xs text-muted">Body Regular (text-[15px] / line-height 1.5)</span>
            <p className="text-[15px] text-ink">
              สหกรณ์ออมทรัพย์เป็นสถาบันการเงินที่จัดตั้งขึ้นเพื่อส่งเสริมการออมทรัพย์และการช่วยเหลือซึ่งกันและกันของสมาชิก
              โดยการนำเงินสะสมมาหมุนเวียนให้กู้ยืมในอัตราดอกเบี้ยที่เป็นธรรม
            </p>
          </div>
          <div className="border-b border-line-soft pb-3">
            <span className="text-xs text-muted">Tabular Numbers (num / tabular-nums)</span>
            <p className="text-xl font-bold tabular-nums text-teal">
              ฿386,245,900.00 <span className="text-xs font-normal text-muted">(ณ วันที่ 31 ต.ค. 2569)</span>
            </p>
          </div>
          <div>
            <span className="text-xs text-muted">Caption & Muted Text (text-sm text-muted)</span>
            <p className="text-sm text-muted">
              เอกสารนี้เป็นข้อมูลจำลองเพื่อการพัฒนาและทดสอบระบบสหกรณ์ออมทรัพย์ Ucoop
            </p>
          </div>
        </div>
      </div>
    );
  },
};
