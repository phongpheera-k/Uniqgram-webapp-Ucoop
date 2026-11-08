import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatusChip } from "@/components/ui/status-chip";
import type { StaffDashboard } from "@/features/dashboard/server/dashboard-queries";
import { KPI, KPI_GRID, KPI_VALUE, LINK_BTN, NUM, PANEL, PANEL_H, STACK, TABLE, WRAP_ROW } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

export function StaffDashboardView({ data }: { data: StaffDashboard }) {
  return (
    <div className={STACK}>
      <div className={KPI_GRID}>
        {data.kpis.map((k) => (
          <div key={k.label} className={cn(PANEL, KPI)}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-sub">{k.label}</span>
              {k.icon ? <span className="flex size-8 items-center justify-center rounded-md bg-chip-bg text-teal"><Icon d={k.icon} /></span> : null}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={KPI_VALUE}>{k.value}</span>
              <span className="text-sm text-muted">{k.unit}</span>
            </div>
            <span className="text-sm text-sub">{k.note}</span>
          </div>
        ))}
      </div>

      <div className={WRAP_ROW}>
        <div className={cn(STACK, "min-w-0 flex-[999_1_600px]")}>
          <section className={PANEL} aria-labelledby="h-apps">
            <div className={PANEL_H}>
              <h2 id="h-apps">ใบสมัครสมาชิกล่าสุด</h2>
              {data.canSeeMembers ? <Link href="/members" className={LINK_BTN}>ดูทั้งหมด</Link> : null}
            </div>
            {data.apps.length === 0 ? (
              <div className="p-6 text-muted">ยังไม่มีใบสมัครใหม่</div>
            ) : (
              <div className="overflow-x-auto">
                <table className={TABLE}>
                  <thead>
                    <tr><th>เลขที่ใบสมัคร</th><th>ชื่อ–สกุล</th><th>หน่วยงาน</th><th>วันที่ยื่น</th><th className="num">ค่าหุ้นแรกเข้า (บาท)</th><th>สถานะ</th></tr>
                  </thead>
                  <tbody>
                    {data.apps.map((a) => (
                      <tr key={a.no}>
                        <td className="text-sub tabular-nums">{a.no}</td>
                        <td className="font-semibold">{a.name}</td>
                        <td>{a.dept}</td>
                        <td className="whitespace-nowrap tabular-nums">{a.date}</td>
                        <td className={NUM}>{a.amount}</td>
                        <td><StatusChip status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {data.audit ? (
            <section className={PANEL} aria-labelledby="h-audit">
              <div className={PANEL_H}>
                <h2 id="h-audit">บันทึกการใช้งานล่าสุด</h2>
                <Link href="/admin/audit" className={LINK_BTN}>ดูบันทึกทั้งหมด</Link>
              </div>
              <div className="overflow-x-auto">
                <table className={TABLE}>
                  <thead><tr><th className="w-[170px]">เวลา</th><th className="w-[160px]">ผู้ใช้</th><th>การดำเนินการ</th></tr></thead>
                  <tbody>
                    {data.audit.map((l) => (
                      <tr key={l.id}><td className="whitespace-nowrap text-sub tabular-nums">{l.time}</td><td className="font-medium">{l.user}</td><td>{l.action}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>

        <div className={cn(STACK, "min-w-0 flex-[1_1_320px]")}>
          <section className={PANEL} aria-labelledby="h-tasks">
            <div className={PANEL_H}><h2 id="h-tasks">งานรอดำเนินการ</h2><span className="text-sm text-muted">{data.tasks.length} รายการ</span></div>
            {data.tasks.length === 0 ? (
              <div className="px-4 py-5 text-muted">ไม่มีงานค้าง — เยี่ยมมาก</div>
            ) : (
              data.tasks.map((t) => (
                <Link key={t.label} href={t.route} className="flex w-full cursor-pointer items-center justify-between gap-3 border-0 border-b border-line-soft bg-transparent p-4 py-3 text-left text-inherit no-underline hover:bg-row hover:text-inherit max-[640px]:px-3">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <StatusChip status={t.status} />
                    <span className="flex min-w-0 flex-col">
                      <span className="font-semibold">{t.label}</span>
                      <span className="text-sm text-muted">{t.sub}</span>
                    </span>
                  </span>
                  <span className="text-xl font-bold text-slate tabular-nums">{t.count}</span>
                </Link>
              ))
            )}
          </section>
          <section className={PANEL} aria-labelledby="h-mods">
            <div className={PANEL_H}><h2 id="h-mods">สถานะโมดูลระบบ</h2></div>
            <ul className="m-0 list-none p-0">
              {data.modules.map((m) => (
                <li key={m.label} className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-2.5">
                  <span className="flex items-center gap-2.5"><Icon d={m.icon} color="#4a5560" />{m.label}</span>
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

