import { EmptyState } from "@/components/feedback/states";
import { formatInt } from "@/lib/formatters/currency";
import { ExportReportButton } from "@/features/reports/components/export-button";
import { formatSigned } from "@/features/reports/server/report-service";
import type { MemberReport } from "@/features/reports/server/report-queries";

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="panel kpi">
      <span style={{ fontSize: 14, color: "#4a5560" }}>{label}</span>
      <div className="kpi-v">
        {value} <span style={{ fontSize: 14, fontWeight: 400, color: "var(--muted)" }}>{unit}</span>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Stat label={`สมาชิก ณ สิ้นเดือน ${totals.latestLabel ?? ""}`} value={formatInt(totals.latestClosing ?? 0)} unit="คน" />
        <Stat label={`เข้าใหม่ ${rows.length} เดือน`} value={formatInt(totals.joined)} unit="คน" />
        <Stat label={`ออก ${rows.length} เดือน`} value={formatInt(totals.left)} unit="คน" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <section className="panel" aria-labelledby="h-rep1" style={{ flex: "999 1 560px", minWidth: 0 }}>
          <div className="panel-h">
            <h2 id="h-rep1">สมาชิกเข้า–ออกรายเดือน</h2>
            {canExport ? <ExportReportButton /> : null}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
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
                    <th scope="row" style={{ background: "transparent", fontWeight: 400, color: "inherit", fontSize: 15 }}>{r.label}</th>
                    <td className="num">{r.joined}</td>
                    <td className="num">{r.left}</td>
                    <td className="num">{formatSigned(r.net)}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{formatInt(r.closing)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel" aria-labelledby="h-rep2" style={{ flex: "1 1 340px", minWidth: 0 }}>
          <div className="panel-h"><h2 id="h-rep2">สมาชิกแยกตามหน่วยงาน</h2></div>
          <ul style={{ listStyle: "none", margin: 0, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {depts.map((d) => (
              <li key={d.dept}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                  <span>{d.dept}</span>
                  <span className="tnum"><strong>{formatInt(d.count)}</strong> <span style={{ color: "var(--muted)" }}>({d.pct})</span></span>
                </div>
                <div className="bar" aria-hidden="true"><div style={{ width: `${d.barPct}%` }} /></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
