import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import type { PasswordRule } from "@/lib/auth/password-rules";

/** Live pass / not-pass checklist (AUTH-07). Uses icon + text, not colour alone. */
export function PasswordRulesList({ rules }: { rules: PasswordRule[] }) {
  return (
    <ul aria-label="เงื่อนไขรหัสผ่านใหม่" style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
      {rules.map((r) => (
        <li key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, color: r.ok ? "var(--ok)" : "var(--muted)" }}>
          <Icon d={r.ok ? IC.check : IC.minus} size={16} stroke={2.2} />
          <span style={{ flex: 1 }}>{r.label}</span>
          <span>{r.ok ? "ผ่าน" : "ยังไม่ผ่าน"}</span>
        </li>
      ))}
    </ul>
  );
}
