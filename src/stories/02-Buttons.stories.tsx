import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@/components/ui/icon";
import { BTN, BTN_GHOST, BTN_SM, BTN_SM_MEDIUM, CRUMB, LINK_BTN } from "@/components/ui/styles";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Component CSS/Buttons & Links",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const AllButtons: StoryObj = {
  render: () => {
    return (
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate">ปุ่มและการนำทาง (Buttons & Links)</h1>
          <p className="text-sm text-muted">
            คลาสสำเร็จรูปจาก <code>src/components/ui/styles.ts</code> รองรับการสัมผัสบนมือถือ (min-h-11) และสถานะ disabled
          </p>
        </div>

        {/* Primary Buttons */}
        <div className="rounded-lg border border-line bg-white p-6 space-y-3">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Primary Button (BTN)</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={BTN}>
              เข้าสู่ระบบ
            </button>
            <button type="button" className={BTN}>
              <Icon d={IC.userPlus} size={18} />
              <span>สมัครสมาชิกใหม่</span>
            </button>
            <button type="button" className={BTN}>
              <Icon d={IC.approve} size={18} />
              <span>อนุมัติใบสมัคร</span>
            </button>
            <button type="button" className={BTN} disabled>
              ปุ่มถูกปิดการใช้งาน
            </button>
          </div>
        </div>

        {/* Ghost Buttons */}
        <div className="rounded-lg border border-line bg-white p-6 space-y-3">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Ghost Button (BTN_GHOST)</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={BTN_GHOST}>
              ยกเลิก
            </button>
            <button type="button" className={BTN_GHOST}>
              <Icon d={IC.report} size={18} />
              <span>ส่งออก CSV</span>
            </button>
            <button type="button" className={BTN_GHOST} disabled>
              Ghost ปิดการใช้งาน
            </button>
          </div>
        </div>

        {/* Small Action Buttons */}
        <div className="rounded-lg border border-line bg-white p-6 space-y-3">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Small Action Buttons (BTN_SM / BTN_SM_MEDIUM)</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={BTN_SM}>
              <Icon d={IC.user} size={14} />
              <span>กำหนดบทบาท</span>
            </button>
            <button type="button" className={BTN_SM}>
              <Icon d={IC.lock} size={14} />
              <span>รีเซ็ตรหัสผ่าน</span>
            </button>
            <button type="button" className={cn(BTN_SM, "text-bad hover:bg-bad-bg border-bad/30")}>
              <Icon d={IC.minus} size={14} />
              <span>ระงับการใช้งาน</span>
            </button>
            <button type="button" className={BTN_SM_MEDIUM}>
              admin.wipa · ผู้ดูแลระบบ
            </button>
          </div>
        </div>

        {/* Inline Links & Breadcrumbs */}
        <div className="rounded-lg border border-line bg-white p-6 space-y-3">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Inline Links & Breadcrumbs</h3>
          <div className="flex flex-wrap items-center gap-6">
            <button type="button" className={LINK_BTN}>
              ลืมรหัสผ่าน?
            </button>
            <button type="button" className={LINK_BTN}>
              ← กลับไปหน้าเข้าสู่ระบบ
            </button>
            <div className="flex items-center gap-2 text-sm text-sub">
              <button type="button" className={CRUMB}>หน้าหลัก</button>
              <span>/</span>
              <button type="button" className={CRUMB}>สมาชิก</button>
              <span>/</span>
              <span className="font-semibold text-ink">รายชื่อสมาชิก</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
