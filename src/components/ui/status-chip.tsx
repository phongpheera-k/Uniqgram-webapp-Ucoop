import { Icon } from "@/components/ui/icon";
import { CHIP_BASE, CHIP_TONE } from "@/components/ui/styles";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Status is never conveyed by colour alone: every chip carries an icon + a text label. */
export type ChipTone = "ok" | "warn" | "bad" | "mute" | "info";

export const STATUS_CHIPS = {
  active: { label: "ปกติ", tone: "ok", icon: IC.check },
  approved: { label: "อนุมัติแล้ว", tone: "ok", icon: IC.check },
  pending: { label: "รออนุมัติ", tone: "warn", icon: IC.clock },
  docs: { label: "รอเอกสาร", tone: "warn", icon: IC.alert },
  rejected: { label: "ไม่ผ่าน", tone: "bad", icon: IC.x },
  resigned: { label: "ลาออก", tone: "mute", icon: IC.minus },
  live: { label: "เปิดใช้งาน", tone: "ok", icon: IC.check },
  soon: { label: "เร็ว ๆ นี้", tone: "mute", icon: IC.clock },
  paid: { label: "ชำระแล้ว", tone: "ok", icon: IC.check },
} as const satisfies Record<string, { label: string; tone: ChipTone; icon: string }>;

export type ChipStatus = keyof typeof STATUS_CHIPS;

export function StatusChip({ status }: { status: ChipStatus }) {
  const s = STATUS_CHIPS[status];
  return (
    <span className={cn(CHIP_BASE, CHIP_TONE[s.tone])}>
      <Icon d={s.icon} size={14} stroke={2.2} />
      {s.label}
    </span>
  );
}

export function Chip({ tone, icon, children, className }: { tone: ChipTone; icon?: string; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(CHIP_BASE, CHIP_TONE[tone], className)}>
      {icon ? <Icon d={icon} size={14} stroke={2.2} /> : null}
      {children}
    </span>
  );
}
