import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { formatThaiLongDay, thaiFiscalYear } from "@/lib/formatters/date";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb + page title bar shown on every page (SHL-11). */
export function PageHeader({ crumbs, title, desc, roleName }: { crumbs: Crumb[]; title: string; desc?: string; roleName: string }) {
  const now = new Date();
  return (
    <div className="page-head">
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <nav aria-label="breadcrumb">
          <ol className="crumbs">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={`${c.label}-${i}`}>
                  {c.href && !last ? <Link href={c.href} className="crumb">{c.label}</Link> : <span aria-current={last ? "page" : undefined} style={{ color: "#4a5560" }}>{c.label}</span>}
                  {!last ? <Icon d={IC.chevronRight} size={12} stroke={2} color="#77838f" /> : null}
                </li>
              );
            })}
          </ol>
        </nav>
        <h1>{title}</h1>
        {desc ? <p style={{ margin: 0, color: "var(--muted)", fontSize: 15 }}>{desc}</p> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 14, color: "#4a5560" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon d={IC.calendar} size={16} />{formatThaiLongDay(now)}</span>
        <span style={{ color: "#c5ced6" }} aria-hidden="true">|</span>
        <span>ปีบัญชี {thaiFiscalYear(now)}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: "var(--teal-light)", color: "var(--teal-dark)", fontWeight: 600 }}>
          <Icon d={IC.shield} size={15} />มุมมอง: {roleName}
        </span>
      </div>
    </div>
  );
}
