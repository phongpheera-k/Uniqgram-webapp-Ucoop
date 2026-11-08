import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { CRUMB } from "@/components/ui/styles";
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
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-4 max-[640px]:mb-3.5 max-[640px]:pb-3">
      <div className="flex min-w-0 flex-col gap-1">
        <nav aria-label="breadcrumb">
          <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-sm text-muted">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                  {c.href && !last ? <Link href={c.href} className={CRUMB}>{c.label}</Link> : <span aria-current={last ? "page" : undefined} className="text-sub">{c.label}</span>}
                  {!last ? <Icon d={IC.chevronRight} size={12} stroke={2} color="#77838f" /> : null}
                </li>
              );
            })}
          </ol>
        </nav>
        <h1 className="m-0 text-[26px] leading-tight font-bold text-slate max-[640px]:text-[22px]">{title}</h1>
        {desc ? <p className="m-0 text-[15px] text-muted">{desc}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-sub">
        <span className="inline-flex items-center gap-1.5"><Icon d={IC.calendar} size={16} />{formatThaiLongDay(now)}</span>
        <span className="text-line-strong" aria-hidden="true">|</span>
        <span>ปีบัญชี {thaiFiscalYear(now)}</span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-light px-2.5 py-1 font-semibold text-teal-dark">
          <Icon d={IC.shield} size={15} />มุมมอง: {roleName}
        </span>
      </div>
    </div>
  );
}
