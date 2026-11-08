import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PasswordRulesList } from "@/features/auth/components/password-rules-list";
import { BTN, FIELD, FIELD_ERR, FIELD_ERR_TEXT, LABEL } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

const meta: Meta = {
  title: "Component CSS/Forms & Inputs",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const AllFormFields: StoryObj = {
  render: () => {
    return (
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate">ฟอร์มและช่องกรอกข้อมูล (Forms & Inputs)</h1>
          <p className="text-sm text-muted">
            การจัดรูปแบบช่องกรอกข้อมูล ป้ายกำกับ สถานะข้อผิดพลาด (Validation) และเงื่อนไขรหัสผ่าน
          </p>
        </div>

        <form className="space-y-5 rounded-lg border border-line bg-white p-6 shadow-xs" onSubmit={(e) => e.preventDefault()}>
          {/* Normal Input */}
          <div>
            <label className={LABEL} htmlFor="u-name">
              ชื่อผู้ใช้งาน (Username) <span className="text-bad">*</span>
            </label>
            <input
              id="u-name"
              type="text"
              className={FIELD}
              placeholder="เช่น admin.wipa"
              defaultValue="admin.wipa"
            />
            <span className="mt-1 block text-xs text-muted">ตัวอักษรอังกฤษพิมพ์เล็ก ตัวเลข จุด หรือขีดล่าง</span>
          </div>

          {/* Error Input */}
          <div>
            <label className={LABEL} htmlFor="u-nid">
              เลขประจำตัวประชาชน (13 หลัก) <span className="text-bad">*</span>
            </label>
            <input
              id="u-nid"
              type="text"
              className={cn(FIELD, FIELD_ERR)}
              defaultValue="1-0000-00231-01-9"
              aria-invalid="true"
            />
            <div className={FIELD_ERR_TEXT} role="alert">
              เลขบัตรประชาชนไม่ถูกต้อง — หลักตรวจทาน (หลักสุดท้าย) ไม่ตรงตามสูตรกระทรวงมหาดไทย
            </div>
          </div>

          {/* Select Dropdown */}
          <div>
            <label className={LABEL} htmlFor="u-dept">
              หน่วยงาน / สังกัด
            </label>
            <select id="u-dept" className={FIELD} defaultValue="กองคลัง">
              <option value="กองคลัง">กองคลัง</option>
              <option value="ฝ่ายบุคคล">ฝ่ายบุคคล</option>
              <option value="กองช่าง">กองช่าง</option>
              <option value="สำนักปลัด">สำนักปลัด</option>
              <option value="กองการศึกษา">กองการศึกษา</option>
              <option value="กองสาธารณสุข">กองสาธารณสุข</option>
            </select>
          </div>

          {/* Password with rules check */}
          <div>
            <label className={LABEL} htmlFor="u-pwd">
              รหัสผ่านใหม่
            </label>
            <input
              id="u-pwd"
              type="password"
              className={FIELD}
              defaultValue="Demo@12"
            />
            <div className="mt-3">
              <PasswordRulesList
                rules={[
                  { id: "length", ok: true, label: "ยาวอย่างน้อย 8 ตัวอักษร" },
                  { id: "case", ok: true, label: "มีตัวอักษรอังกฤษพิมพ์เล็กและพิมพ์ใหญ่" },
                  { id: "digit", ok: true, label: "มีตัวเลขอย่างน้อย 1 ตัว" },
                  { id: "different", ok: false, label: "ต่างจากรหัสผ่านเดิม" },
                ]}
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className={BTN}>
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    );
  },
};
