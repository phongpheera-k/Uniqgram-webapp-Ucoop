import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import type { PasswordRule } from "@/lib/auth/password-rules";
import { cn } from "@/lib/utils";

/** Live pass / not-pass checklist (AUTH-07). Uses icon + text, not colour alone. */
export function PasswordRulesList({ rules }: { rules: PasswordRule[] }) {
  return (
    <ul aria-label="เงื่อนไขรหัสผ่านใหม่" className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
      {rules.map((r) => (
        <li key={r.id} className={cn("flex items-center gap-2", r.ok ? "text-ok" : "text-muted")}>
          <Icon d={r.ok ? IC.check : IC.minus} size={16} stroke={2.2} />
          <span className="flex-1">{r.label}</span>
          <span>{r.ok ? "ผ่าน" : "ยังไม่ผ่าน"}</span>
        </li>
      ))}
    </ul>
  );
}
