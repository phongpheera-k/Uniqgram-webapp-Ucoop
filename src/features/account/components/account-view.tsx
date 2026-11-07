import Link from "next/link";
import { Chip } from "@/components/ui/status-chip";
import { IC } from "@/lib/icons";
import type { AccountProfile } from "@/features/account/server/account-queries";

export function AccountView({ profile }: { profile: AccountProfile }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
      <section className="panel" aria-label="ข้อมูลบัญชี" style={{ flex: "1 1 320px", maxWidth: 420, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
        <span style={{ width: 80, height: 80, borderRadius: 40, background: "var(--teal-light)", color: "var(--teal)", boxShadow: "0 0 0 3px var(--teal-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28 }}>{profile.initials}</span>
        <h2 style={{ margin: "4px 0 0", fontSize: 22 }}>{profile.name}</h2>
        <span style={{ color: "var(--muted)" }}>{profile.username}</span>
        <Chip tone="ok" icon={IC.shield}>{profile.roleName}</Chip>
        <dl style={{ margin: "8px 0 0", width: "100%", display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", textAlign: "left" }}>
          <dt style={{ color: "var(--muted)" }}>หน่วยงาน</dt><dd style={{ margin: 0 }}>{profile.dept}</dd>
          <dt style={{ color: "var(--muted)" }}>เข้าสู่ระบบล่าสุด</dt><dd style={{ margin: 0 }}>{profile.lastLogin}</dd>
        </dl>
        <Link href="/profile/password" className="btn ghost" style={{ marginTop: 8 }}>เปลี่ยนรหัสผ่าน</Link>
      </section>
      <section className="panel" aria-labelledby="h-accp" style={{ flex: "999 1 520px", minWidth: 0 }}>
        <div className="panel-h"><h2 id="h-accp">สิทธิ์ที่ได้รับจากบทบาท “{profile.roleName}”</h2></div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {profile.permissions.map((p) => (
            <li key={p.module} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px", borderBottom: "1px solid var(--line-soft)" }}>
              <span>{p.module}</span>
              {p.actions.length > 0 ? <Chip tone="ok" icon={IC.check}>{p.actions.join(" · ")}</Chip> : <Chip tone="mute" icon={IC.minus}>ไม่มีสิทธิ์</Chip>}
            </li>
          ))}
        </ul>
        <div style={{ padding: "10px 16px", fontSize: 14, color: "var(--muted)" }}>สิทธิ์กำหนดโดยผู้ดูแลระบบ หากต้องการสิทธิ์เพิ่ม กรุณาติดต่อผู้ดูแลระบบ</div>
      </section>
    </div>
  );
}
