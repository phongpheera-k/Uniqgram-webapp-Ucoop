import Link from "next/link";
import { StatusChip } from "@/components/ui/status-chip";
import { maskNid } from "@/lib/pdpa/pii";
import type { MemberDashboard } from "@/features/dashboard/server/dashboard-queries";
import { DL, KPI, KPI_GRID, KPI_VALUE, LINK_BTN, NUM, PANEL, PANEL_H, STACK, TABLE, WRAP_ROW } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

// Fictitious demo NID for the self-service card; always displayed masked (PDPA default).
const DEMO_NID = "1-0000-00245-02-5";

export function MemberDashboardView({ data }: { data: MemberDashboard }) {
  return (
    <div className={STACK}>
      <div className={KPI_GRID}>
        {data.kpis.map((k) => (
          <div key={k.label} className={cn(PANEL, KPI)}>
            <span className="text-sm font-medium text-sub">{k.label}</span>
            <div className="flex items-baseline gap-1.5">
              <span className={KPI_VALUE}>{k.value}</span>
              <span className="text-sm text-muted">{k.unit}</span>
            </div>
            <span className="text-sm text-sub">{k.note}</span>
          </div>
        ))}
      </div>
      <div className={WRAP_ROW}>
        <section className={cn(PANEL, "min-w-0 flex-[1_1_320px]")} aria-labelledby="h-me">
          <div className={PANEL_H}><h2 id="h-me">ข้อมูลสมาชิก</h2><Link href="/me" className={LINK_BTN}>ดูรายละเอียด</Link></div>
          <dl className={cn(DL, "px-4 pt-2 pb-3")}>
            {data.info.map((r) => (<div key={r.label} className="contents"><dt>{r.label}</dt><dd className={r.label === "เลขสมาชิก" ? "font-semibold tabular-nums" : undefined}>{r.value}</dd></div>))}
            <dt>เลขบัตรประชาชน</dt><dd className="tabular-nums">{maskNid(DEMO_NID)} <span className="text-muted">(ปิดบังบางส่วน)</span></dd>
            <dt>สถานะ</dt><dd><StatusChip status="active" /></dd>
          </dl>
        </section>
        <section className={cn(PANEL, "min-w-0 flex-[999_1_560px]")} aria-labelledby="h-share">
          <div className={PANEL_H}><h2 id="h-share">ประวัติการส่งค่าหุ้น</h2></div>
          <div className="overflow-x-auto">
            <table className={TABLE}>
              <thead><tr><th>งวด</th><th>วันที่ชำระ</th><th className="num">จำนวนเงิน (บาท)</th><th className="num">ทุนเรือนหุ้นสะสม (บาท)</th><th>สถานะ</th></tr></thead>
              <tbody>
                {data.shares.map((h) => (
                  <tr key={h.period}><td>{h.period}</td><td className="whitespace-nowrap">{h.date}</td><td className={NUM}>{h.amount}</td><td className={NUM}>{h.total}</td><td><StatusChip status="paid" /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
