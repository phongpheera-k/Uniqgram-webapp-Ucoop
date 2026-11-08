import { EmptyState } from "@/components/feedback/states";
import { formatInt } from "@/lib/formatters/currency";
import { ExportReportButton } from "@/features/reports/components/export-button";
import { formatSigned } from "@/features/reports/server/report-service";
import type { MemberReport } from "@/features/reports/server/report-queries";
import { KPI, KPI_GRID, KPI_VALUE, NUM, PANEL, PANEL_H, STACK, TABLE, WRAP_ROW } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className={cn(PANEL, KPI)}>
      <span className="text-sm text-sub">{label}</span>
      <div className={KPI_VALUE}>
        {value} <span className="text-sm leading-[inherit] font-normal text-muted">{unit}</span>
      </div>
    </div>
  );
}

/** Ready + Empty states of the member report. Summary data only — no NID / per-person data (RPT-07). */
export function MemberReportView({ report }: { report: MemberReport }) {
  const { rows, totals, depts, canExport } = report;
  if (rows.length === 0) {
    return <EmptyState title="ยังไม่มีข้อมูลรายงาน" text="ยังไม่มีการเคลื่อนไหวของสมาชิกในช่วง 6 เดือนที่ผ่านมา เมื่อมีการรับสมาชิกหรือสมาชิกพ้นสภาพ รายงานจะแสดงที่นี่" action={{ label: "กลับหน้าภาพรวม", href: "/dashboard" }} />;
  }
  return (
    <div className={STACK}>
      <div className={cn(KPI_GRID, "grid-cols-[repeat(auto-fit,minmax(220px,1fr))]")}>
        <Stat label={`สมาชิก ณ สิ้นเดือน ${totals.latestLabel ?? ""}`} value={formatInt(totals.latestClosing ?? 0)} unit="คน" />
        <Stat label={`เข้าใหม่ ${rows.length} เดือน`} value={formatInt(totals.joined)} unit="คน" />
        <Stat label={`ออก ${rows.length} เดือน`} value={formatInt(totals.left)} unit="คน" />
      </div>
      <div className={WRAP_ROW}>
        <section className={cn(PANEL, "min-w-0 flex-[999_1_560px]")} aria-labelledby="h-rep1">
          <div className={PANEL_H}>
            <h2 id="h-rep1">สมาชิกเข้า–ออกรายเดือน</h2>
            {canExport ? <ExportReportButton /> : null}
          </div>
          <div className="overflow-x-auto">
            <table className={TABLE}>
              <caption className="sr-only">จำนวนสมาชิกเข้าใหม่ ลาออก และคงเหลือสิ้นเดือน ย้อนหลัง {rows.length} เดือน</caption>
              <thead>
                <tr>
                  <th scope="col">เดือน</th>
                  <th scope="col" className="num">เข้าใหม่</th>
                  <th scope="col" className="num">ลาออก/พ้นสภาพ</th>
                  <th scope="col" className="num">สุทธิ</th>
                  <th scope="col" className="num">คงเหลือสิ้นเดือน</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className="bg-transparent! text-[15px]! font-normal! text-inherit!">{r.label}</th>
                    <td className={NUM}>{r.joined}</td>
                    <td className={NUM}>{r.left}</td>
                    <td className={NUM}>{formatSigned(r.net)}</td>
                    <td className={cn(NUM, "font-semibold")}>{formatInt(r.closing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className={cn(PANEL, "min-w-0 flex-[1_1_340px]")} aria-labelledby="h-rep2">
          <div className={PANEL_H}><h2 id="h-rep2">สมาชิกแยกตามหน่วยงาน</h2></div>
          <ul className="m-0 flex list-none flex-col gap-3 px-4 py-3">
            {depts.map((d) => (
              <li key={d.dept}>
                <div className="flex justify-between text-[15px]">
                  <span>{d.dept}</span>
                  <span className="tabular-nums"><strong>{formatInt(d.count)}</strong> <span className="text-muted">({d.pct})</span></span>
                </div>
                <div className="mt-1 h-2 rounded-sm bg-line-soft" aria-hidden="true"><div className="h-2 rounded-sm bg-teal" style={{ width: `${d.barPct}%` }} /></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
