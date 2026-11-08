import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@/components/ui/icon";
import { BTN, BTN_GHOST, FIELD, LABEL, MODAL, MODAL_BG } from "@/components/ui/styles";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Component CSS/Modals & Dialogs",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const ApproveConfirmModal: StoryObj = {
  render: () => (
    <div className={cn(MODAL_BG, "relative min-h-[500px] z-10")}>
      <div className={MODAL} role="dialog" aria-modal="true">
        <div className="flex items-center gap-2 text-ok">
          <Icon d={IC.approve} size={24} />
          <h2 className="text-lg font-bold text-ink m-0">ยืนยันการอนุมัติใบสมัคร</h2>
        </div>
        <p className="text-sm text-sub m-0">
          คุณกำลังจะอนุมัติใบสมัคร <strong className="text-teal font-semibold">AP-69-0420</strong> ของ{" "}
          <strong className="text-ink">นางสาวศิริพร สมมุติ</strong> โดยระบบจะออกเลขสมาชิกให้อัตโนมัติ
        </p>
        <div className="w-full rounded-md bg-neutral p-3 text-xs text-muted space-y-1">
          <div>• สถานะจะเปลี่ยนจาก “รออนุมัติ” เป็น “ปกติ”</div>
          <div>• บันทึกประวัติการอนุมัติลงใน Audit Trail อัตโนมัติ</div>
        </div>
        <div className="flex w-full justify-end gap-2 pt-2">
          <button type="button" className={BTN_GHOST}>
            ยกเลิก
          </button>
          <button type="button" className={BTN}>
            ยืนยันอนุมัติ
          </button>
        </div>
      </div>
    </div>
  ),
};

export const ReturnModal: StoryObj = {
  name: "Return with Reason Modal",
  render: () => (
    <div className={cn(MODAL_BG, "relative min-h-[500px] z-10")}>
      <div className={MODAL} role="dialog" aria-modal="true">
        <div className="flex items-center gap-2 text-bad">
          <Icon d={IC.alert} size={24} />
          <h2 className="text-lg font-bold text-ink m-0">ตีกลับใบสมัครเพื่อแก้ไข</h2>
        </div>
        <p className="text-sm text-sub m-0">
          ระบุเหตุผลในการตีกลับใบสมัคร <strong className="text-teal font-semibold">AP-69-0419</strong> ของ{" "}
          <strong className="text-ink">นายธนพล จำลอง</strong>
        </p>
        <div className="w-full space-y-1.5">
          <label className={LABEL} htmlFor="reason">
            เหตุผลการตีกลับ <span className="text-bad">*</span>
          </label>
          <textarea
            id="reason"
            className={cn(FIELD, "h-24 py-2 resize-none")}
            defaultValue="สำเนาทะเบียนบ้านไม่ชัดเจน กรุณาแนบเอกสารใหม่และตรวจสอบที่อยู่ปัจจุบัน"
          />
          <span className="text-xs text-muted">ระบุอย่างน้อย 10 ตัวอักษร เพื่อให้เจ้าหน้าที่ทะเบียนแก้ไขได้ถูกต้อง</span>
        </div>
        <div className="flex w-full justify-end gap-2 pt-2">
          <button type="button" className={BTN_GHOST}>
            ยกเลิก
          </button>
          <button type="button" className={cn(BTN, "bg-bad hover:bg-bad/90 border-bad")}>
            ตีกลับใบสมัคร
          </button>
        </div>
      </div>
    </div>
  ),
};

export const SessionExpiredModal: StoryObj = {
  render: () => (
    <div className={cn(MODAL_BG, "relative min-h-[500px] z-10")}>
      <div className={MODAL} role="alertdialog" aria-modal="true">
        <div className="flex size-12 items-center justify-center rounded-xl bg-warn-bg text-warn">
          <Icon d={IC.clock} size={28} />
        </div>
        <h2 className="text-xl font-bold text-ink m-0">เซสชันหมดอายุ</h2>
        <p className="text-sm text-sub m-0">
          ไม่มีการใช้งานระบบเกิน 30 นาที เพื่อความปลอดภัยของข้อมูล ระบบได้ออกจากระบบให้โดยอัตโนมัติ
        </p>
        <div className="pt-2 w-full">
          <button type="button" className={cn(BTN, "w-full justify-center")}>
            เข้าสู่ระบบอีกครั้ง
          </button>
        </div>
      </div>
    </div>
  ),
};
