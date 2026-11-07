import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatusChip } from "@/components/ui/status-chip";
import type { StaffDashboard } from "@/features/dashboard/server/dashboard-queries";

export function StaffDashboardView({ data }: { data: StaffDashboard }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="kpi-grid">
        {data.kpis.map((k) => (
          <div key={k.label} className="panel kpi">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 14, color: "#4a5560", fontWeight: 500 }}>{k.label}</span>
              {k.icon ? <span style={{ width: 32, height: 32, borderRadius: 6, background: "#f1f4f6", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={k.icon} /></span> : null}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span className="kpi-v">{k.value}</span>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>{k.unit}</span>
            </div>
            <span style={{ fontSize: 14, color: "#4a5560" }}>{k.note}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: "999 1 600px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="panel" aria-labelledby="h-apps">
            <div className="panel-h">
              <h2 id="h-apps">ใบสมัครสมาชิกล่าสุด</h2>
              {data.canSeeMembers ? <Link href="/members" className="link-btn">ดูทั้งหมด</Link> : null}
            </div>
            {data.apps.length === 0 ? (
              <div style={{ padding: 24, color: "var(--muted)" }}>ยังไม่มีใบสมัครใหม่</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="tbl">
                  <thead>
                    <tr><th>เลขที่ใบสมัคร</th><th>ชื่อ–สกุล</th><th>หน่วยงาน</th><th>วันที่ยื่น</th><th className="num">ค่าหุ้นแรกเข้า (บาท)</th><th>สถานะ</th></tr>
                  </thead>
                  <tbody>
                    {data.apps.map((a) => (
                      <tr key={a.no}>
                        <td className="tnum" style={{ color: "#4a5560" }}>{a.no}</td>
                        <td style={{ fontWeight: 600 }}>{a.name}</td>
                        <td>{a.dept}</td>
                        <td className="tnum" style={{ whiteSpace: "nowrap" }}>{a.date}</td>
                        <td className="num">{a.amount}</td>
                        <td><StatusChip status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {data.audit ? (
            <section className="panel" aria-labelledby="h-audit">
              <div className="panel-h">
                <h2 id="h-audit">บันทึกการใช้งานล่าสุด</h2>
                <Link href="/admin/audit" className="link-btn">ดูบันทึกทั้งหมด</Link>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="tbl">
                  <thead><tr><th style={{ width: 170 }}>เวลา</th><th style={{ width: 160 }}>ผู้ใช้</th><th>การดำเนินการ</th></tr></thead>
                  <tbody>
                    {data.audit.map((l) => (
                      <tr key={l.id}><td className="tnum" style={{ color: "#4a5560", whiteSpace: "nowrap" }}>{l.time}</td><td style={{ fontWeight: 500 }}>{l.user}</td><td>{l.action}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>

        <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="panel" aria-labelledby="h-tasks">
            <div className="panel-h"><h2 id="h-tasks">งานรอดำเนินการ</h2><span style={{ fontSize: 14, color: "var(--muted)" }}>{data.tasks.length} รายการ</span></div>
            {data.tasks.length === 0 ? (
              <div style={{ padding: "20px 16px", color: "var(--muted)" }}>ไม่มีงานค้าง — เยี่ยมมาก</div>
            ) : (
              data.tasks.map((t) => (
                <Link key={t.label} href={t.route} className="task">
                  <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <StatusChip status={t.status} />
                    <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                      <span style={{ fontWeight: 600 }}>{t.label}</span>
                      <span style={{ fontSize: 14, color: "var(--muted)" }}>{t.sub}</span>
                    </span>
                  </span>
                  <span className="tnum" style={{ fontSize: 20, fontWeight: 700, color: "var(--slate)" }}>{t.count}</span>
                </Link>
              ))
            )}
          </section>
          <section className="panel" aria-labelledby="h-mods">
            <div className="panel-h"><h2 id="h-mods">สถานะโมดูลระบบ</h2></div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {data.modules.map((m) => (
                <li key={m.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 16px", borderBottom: "1px solid var(--line-soft)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon d={m.icon} color="#4a5560" />{m.label}</span>
                  <StatusChip status={m.status} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

