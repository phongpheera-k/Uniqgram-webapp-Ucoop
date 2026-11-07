"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { exportMemberReportAction } from "@/features/reports/server/report-actions";

export function ExportReportButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function run() {
    start(async () => {
      const r = await exportMemberReportAction();
      if (!r.ok) { setMsg({ ok: false, text: r.message }); return; }
      const url = URL.createObjectURL(new Blob([r.csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = r.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMsg({ ok: true, text: "ส่งออกรายงานแล้ว และบันทึกใน Audit log" });
    });
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {msg ? <span role="status" style={{ fontSize: 14, color: msg.ok ? "var(--ok)" : "var(--bad)" }}>{msg.text}</span> : null}
      <button type="button" className="sm-btn" onClick={run} disabled={pending}>
        <Icon d={IC.download} size={16} />
        {pending ? "กำลังส่งออก…" : "ส่งออกรายงาน"}
      </button>
    </span>
  );
}
