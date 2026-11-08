import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "@/components/feedback/alert";
import { IC } from "@/lib/icons";

const meta: Meta = {
  title: "Component CSS/Alerts & Feedback",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const AllAlerts: StoryObj = {
  render: () => {
    return (
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate">กล่องข้อความแจ้งเตือน (Alerts)</h1>
          <p className="text-sm text-muted">
            ใช้แจ้งเตือนข้อมูลสำคัญ ข้อผิดพลาด และสถานะการดำเนินการ พร้อม Accessible ARIA live region
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-muted mb-1 block">Bad / Error Tone</span>
            <Alert tone="bad">
              ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง — เหลือโอกาสอีก 3 ครั้งก่อนบัญชีจะถูกล็อกอัตโนมัติ
            </Alert>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted mb-1 block">Locked Account Alert</span>
            <Alert tone="bad" icon={IC.lock}>
              บัญชีนี้ถูกล็อกเนื่องจากใส่รหัสผ่านผิดครบ 5 ครั้ง กรุณาติดต่อผู้ดูแลระบบเพื่อปลดล็อก
            </Alert>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted mb-1 block">Warning Tone</span>
            <Alert tone="warn">
              บัญชีนี้ถูกระงับการใช้งานชั่วคราว กรุณาติดต่อฝ่ายทรัพยากรบุคคล
            </Alert>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted mb-1 block">Info Tone</span>
            <Alert tone="info">
              เซสชันการใช้งานหมดอายุเนื่องจากไม่มีกิจกรรมเกิน 30 นาที เพื่อความปลอดภัยของข้อมูล
            </Alert>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted mb-1 block">Success / OK Tone</span>
            <Alert tone="ok">
              บันทึกข้อมูลและส่งคำขอสมัครสมาชิกสำเร็จ เลขที่ใบสมัคร AP-69-0421
            </Alert>
          </div>
        </div>
      </div>
    );
  },
};
