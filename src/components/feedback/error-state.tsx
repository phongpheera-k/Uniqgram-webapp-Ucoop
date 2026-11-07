"use client";

import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";

/** Error state with a Retry trigger (used by error.tsx boundaries). */
export function ErrorState({ reset, digest }: { reset: () => void; digest?: string }) {
  return (
    <section className="panel state-box">
      <span className="chip bad" style={{ padding: 10, borderRadius: 12 }}>
        <Icon d={IC.alert} size={28} />
      </span>
      <h2 role="alert" style={{ margin: 0, fontSize: 20 }}>
        โหลดข้อมูลไม่สำเร็จ
      </h2>
      <p style={{ margin: 0, color: "var(--muted)", maxWidth: 520 }}>
        ไม่สามารถเชื่อมต่อบริการข้อมูลได้ในขณะนี้{digest ? ` (รหัสอ้างอิง ${digest})` : ""} กรุณาลองใหม่อีกครั้ง
      </p>
      <button type="button" className="btn" onClick={reset} style={{ marginTop: 8 }}>
        ลองใหม่
      </button>
    </section>
  );
}
