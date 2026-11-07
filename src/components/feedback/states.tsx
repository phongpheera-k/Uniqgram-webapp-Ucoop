import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";

/** Empty state (4-state UI mandate): explains why it is empty and offers an action. */
export function EmptyState({ title, text, action }: { title: string; text: string; action?: { label: string; href: string } }) {
  return (
    <section className="panel state-box">
      <span className="state-ic" style={{ background: "var(--mute-bg)", color: "var(--mute)" }}>
        <Icon d={IC.inbox} size={28} stroke={1.6} />
      </span>
      <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
      <p style={{ margin: 0, color: "var(--muted)", maxWidth: 520 }}>{text}</p>
      {action ? (
        <Link href={action.href} className="btn ghost" style={{ marginTop: 8 }}>
          {action.label}
        </Link>
      ) : null}
    </section>
  );
}

export function ForbiddenView({ roleName }: { roleName: string }) {
  return (
    <section className="panel state-box" style={{ padding: "48px 24px" }}>
      <span className="chip bad" style={{ padding: 10, borderRadius: 12 }}>
        <Icon d={IC.lock} size={28} />
      </span>
      <h2 style={{ margin: 0, fontSize: 20 }}>ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
      <p style={{ margin: 0, color: "var(--muted)", maxWidth: 520 }}>บทบาท “{roleName}” ไม่ได้รับสิทธิ์ใช้งานเมนูนี้ หากต้องการใช้งาน กรุณาติดต่อผู้ดูแลระบบ</p>
      <Link href="/dashboard" className="btn ghost" style={{ marginTop: 8 }}>
        กลับหน้าภาพรวม
      </Link>
    </section>
  );
}

export function ComingSoon({ title, story }: { title: string; story: string }) {
  return (
    <section className="panel state-box" style={{ padding: "48px 24px" }}>
      <span className="state-ic" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
        <Icon d={IC.clock} size={28} stroke={1.6} />
      </span>
      <h2 style={{ margin: 0, fontSize: 20 }}>หน้านี้จะพัฒนาในรอบถัดไป</h2>
      <p style={{ margin: 0, color: "var(--muted)", maxWidth: 520 }}>
        กรอบหลัก เมนู และสิทธิ์การเข้าถึงพร้อมแล้ว เนื้อหาของ “{title}” อยู่ใน {story}
      </p>
      <Link href="/dashboard" className="btn ghost" style={{ marginTop: 8 }}>
        กลับหน้าภาพรวม
      </Link>
    </section>
  );
}
