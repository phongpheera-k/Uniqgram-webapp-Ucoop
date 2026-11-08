import { Icon } from "@/components/ui/icon";
import { ALERT_BASE, ALERT_TONE } from "@/components/ui/styles";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Tone = "bad" | "warn" | "info" | "ok";
const ICON: Record<Tone, string> = { bad: IC.alert, warn: IC.alert, info: IC.clock, ok: IC.check };

export function Alert({ tone, icon, children, live = "alert" }: { tone: Tone; icon?: string; children: React.ReactNode; live?: "alert" | "status" }) {
  return (
    <div role={live} className={cn(ALERT_BASE, ALERT_TONE[tone])}>
      <Icon d={icon ?? ICON[tone]} size={20} className="mt-px" />
      <span>{children}</span>
    </div>
  );
}
