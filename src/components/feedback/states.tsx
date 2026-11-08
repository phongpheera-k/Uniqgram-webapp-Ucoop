import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { BTN_GHOST, CHIP_BASE, CHIP_TONE, PANEL, STATE_BOX, STATE_ICON } from "@/components/ui/styles";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Empty state (4-state UI mandate): explains why it is empty and offers an action. */
export function EmptyState({ title, text, action }: { title: string; text: string; action?: { label: string; href: string } }) {
  return (
    <section className={cn(PANEL, STATE_BOX)}>
      <span className={cn(STATE_ICON, "bg-mute-bg text-mute")}>
        <Icon d={IC.inbox} size={28} stroke={1.6} />
      </span>
      <h2 className="m-0 text-xl">{title}</h2>
      <p className="m-0 max-w-[520px] text-muted">{text}</p>
      {action ? (
        <Link href={action.href} className={cn(BTN_GHOST, "mt-2")}>
          {action.label}
        </Link>
      ) : null}
    </section>
  );
}

export function ForbiddenView({ roleName }: { roleName: string }) {
  return (
    <section className={cn(PANEL, STATE_BOX, "py-12")}>
      <span className={cn(CHIP_BASE, CHIP_TONE.bad, "rounded-xl p-2.5")}>
        <Icon d={IC.lock} size={28} />
      </span>
      <h2 className="m-0 text-xl">ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
      <p className="m-0 max-w-[520px] text-muted">บทบาท “{roleName}” ไม่ได้รับสิทธิ์ใช้งานเมนูนี้ หากต้องการใช้งาน กรุณาติดต่อผู้ดูแลระบบ</p>
      <Link href="/dashboard" className={cn(BTN_GHOST, "mt-2")}>
        กลับหน้าภาพรวม
      </Link>
    </section>
  );
}

export function ComingSoon({ title, story }: { title: string; story: string }) {
  return (
    <section className={cn(PANEL, STATE_BOX, "py-12")}>
      <span className={cn(STATE_ICON, "bg-teal-light text-teal")}>
        <Icon d={IC.clock} size={28} stroke={1.6} />
      </span>
      <h2 className="m-0 text-xl">หน้านี้จะพัฒนาในรอบถัดไป</h2>
      <p className="m-0 max-w-[520px] text-muted">
        กรอบหลัก เมนู และสิทธิ์การเข้าถึงพร้อมแล้ว เนื้อหาของ “{title}” อยู่ใน {story}
      </p>
      <Link href="/dashboard" className={cn(BTN_GHOST, "mt-2")}>
        กลับหน้าภาพรวม
      </Link>
    </section>
  );
}
