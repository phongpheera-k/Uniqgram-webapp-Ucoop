import Link from "next/link";
import { Chip } from "@/components/ui/status-chip";
import { IC } from "@/lib/icons";
import type { AccountProfile } from "@/features/account/server/account-queries";
import { BTN_GHOST, PANEL, PANEL_H, WRAP_ROW } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

export function AccountView({ profile }: { profile: AccountProfile }) {
  return (
    <div className={WRAP_ROW}>
      <section className={cn(PANEL, "flex max-w-[420px] flex-[1_1_320px] flex-col items-center gap-2.5 p-6 text-center")} aria-label="ข้อมูลบัญชี">
        <span className="flex size-20 items-center justify-center rounded-full bg-teal-light text-[28px] font-bold text-teal shadow-[0_0_0_3px_var(--color-teal-accent)]">{profile.initials}</span>
        <h2 className="mt-1 mb-0 text-[22px]">{profile.name}</h2>
        <span className="text-muted">{profile.username}</span>
        <Chip tone="ok" icon={IC.shield}>{profile.roleName}</Chip>
        <dl className="mt-2 mb-0 grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-left">
          <dt className="text-muted">หน่วยงาน</dt><dd className="m-0">{profile.dept}</dd>
          <dt className="text-muted">เข้าสู่ระบบล่าสุด</dt><dd className="m-0">{profile.lastLogin}</dd>
        </dl>
        <Link href="/profile/password" className={cn(BTN_GHOST, "mt-2")}>เปลี่ยนรหัสผ่าน</Link>
      </section>
      <section className={cn(PANEL, "min-w-0 flex-[999_1_520px]")} aria-labelledby="h-accp">
        <div className={PANEL_H}><h2 id="h-accp">สิทธิ์ที่ได้รับจากบทบาท “{profile.roleName}”</h2></div>
        <ul className="m-0 list-none p-0">
          {profile.permissions.map((p) => (
            <li key={p.module} className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-2.5">
              <span>{p.module}</span>
              {p.actions.length > 0 ? <Chip tone="ok" icon={IC.check}>{p.actions.join(" · ")}</Chip> : <Chip tone="mute" icon={IC.minus}>ไม่มีสิทธิ์</Chip>}
            </li>
          ))}
        </ul>
        <div className="px-4 py-2.5 text-sm text-muted">สิทธิ์กำหนดโดยผู้ดูแลระบบ หากต้องการสิทธิ์เพิ่ม กรุณาติดต่อผู้ดูแลระบบ</div>
      </section>
    </div>
  );
}
