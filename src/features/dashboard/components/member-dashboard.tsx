import Link from "next/link";
import { StatusChip } from "@/components/ui/status-chip";
import { maskNid } from "@/lib/pdpa/pii";
import type { MemberDashboard } from "@/features/dashboard/server/dashboard-queries";

// Fictitious demo NID for the self-service card; always displayed masked (PDPA default).
const DEMO_NID = "1-0000-00245-02-5";

export function MemberDashboardView({ data }: { data: MemberDashboard }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="kpi-grid">
        {data.kpis.map((k) => (
          <div key={k.label} className="panel kpi">
            <span style={{ fontSize: 14, color: "#4a5560", fontWeight: 500 }}>{k.label}</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span className="kpi-v">{k.value}</span>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>{k.unit}</span>
            </div>
            <span style={{ fontSize: 14, color: "#4a5560" }}>{k.note}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <section className="panel" aria-labelledby="h-me" style={{ flex: "1 1 320px", minWidth: 0 }}>
          <div className="panel-h"><h2 id="h-me">ข้อมูลสมาชิก</h2><Link href="/me" className="link-btn">ดูรายละเอียด</Link></div>
          <dl className="dl" style={{ padding: "8px 16px 12px" }}>
            {data.info.map((r) => (<div key={r.label} style={{ display: "contents" }}><dt>{r.label}</dt><dd className={r.label === "เลขสมาชิก" ? "tnum" : undefined} style={r.label === "เลขสมาชิก" ? { fontWeight: 600 } : undefined}>{r.value}</dd></div>))}
            <dt>เลขบัตรประชาชน</dt><dd className="tnum">{maskNid(DEMO_NID)} <span style={{ color: "var(--muted)" }}>(ปิดบังบางส่วน)</span></dd>
            <dt>สถานะ</dt><dd><StatusChip status="active" /></dd>
          </dl>
        </section>
        <section className="panel" aria-labelledby="h-share" style={{ flex: "999 1 560px", minWidth: 0 }}>
          <div className="panel-h"><h2 id="h-share">ประวัติการส่งค่าหุ้น</h2></div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead><tr><th>งวด</th><th>วันที่ชำระ</th><th className="num">จำนวนเงิน (บาท)</th><th className="num">ทุนเรือนหุ้นสะสม (บาท)</th><th>สถานะ</th></tr></thead>
              <tbody>
                {data.shares.map((h) => (
                  <tr key={h.period}><td>{h.period}</td><td style={{ whiteSpace: "nowrap" }}>{h.date}</td><td className="num">{h.amount}</td><td className="num">{h.total}</td><td><StatusChip status="paid" /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
