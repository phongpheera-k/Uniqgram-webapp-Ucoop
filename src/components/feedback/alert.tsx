import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";

type Tone = "bad" | "warn" | "info" | "ok";
const ICON: Record<Tone, string> = { bad: IC.alert, warn: IC.alert, info: IC.clock, ok: IC.check };

export function Alert({ tone, icon, children, live = "alert" }: { tone: Tone; icon?: string; children: React.ReactNode; live?: "alert" | "status" }) {
  return (
    <div role={live} className={`alert ${tone}`}>
      <Icon d={icon ?? ICON[tone]} size={20} style={{ marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );
}
