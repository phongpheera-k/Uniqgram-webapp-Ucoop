"use client";

import { Icon } from "@/components/ui/icon";
import { BTN, CHIP_BASE, CHIP_TONE, PANEL, STATE_BOX } from "@/components/ui/styles";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Error state with a Retry trigger (used by error.tsx boundaries). */
export function ErrorState({ reset, digest }: { reset: () => void; digest?: string }) {
  return (
    <section className={cn(PANEL, STATE_BOX)}>
      <span className={cn(CHIP_BASE, CHIP_TONE.bad, "rounded-xl p-2.5")}>
        <Icon d={IC.alert} size={28} />
      </span>
      <h2 role="alert" className="m-0 text-xl">
        โหลดข้อมูลไม่สำเร็จ
      </h2>
      <p className="m-0 max-w-[520px] text-muted">
        ไม่สามารถเชื่อมต่อบริการข้อมูลได้ในขณะนี้{digest ? ` (รหัสอ้างอิง ${digest})` : ""} กรุณาลองใหม่อีกครั้ง
      </p>
      <button type="button" className={cn(BTN, "mt-2")} onClick={reset}>
        ลองใหม่
      </button>
    </section>
  );
}
