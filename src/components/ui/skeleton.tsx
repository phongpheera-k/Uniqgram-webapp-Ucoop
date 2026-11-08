import { KPI, KPI_GRID, PANEL, SKELETON } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

/** width / height are data-driven (per-row widths), so they stay as inline style values. */
export function Skeleton({ width = "100%", height = 14 }: { width?: string | number; height?: number }) {
  return <span className={SKELETON} style={{ width, height }} />;
}

/** Table-shaped loading placeholder (matches the layout of the ready state). */
export function TableSkeleton({ rows = 5, label = "กำลังโหลดข้อมูล…" }: { rows?: number; label?: string }) {
  const widths = [62, 48, 71, 55, 66, 44];
  return (
    <section className={PANEL} aria-busy="true" aria-label={label}>
      <div role="status" className="border-b border-line-soft px-4 py-3.5 text-sub">
        {label}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-6 border-b border-line-soft p-4">
          <Skeleton width="18%" />
          <Skeleton width={`${widths[i % widths.length]}%`} />
        </div>
      ))}
    </section>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={KPI_GRID} aria-busy="true" aria-label="กำลังโหลดข้อมูล">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={cn(PANEL, KPI)}>
          <Skeleton width="50%" />
          <Skeleton width="70%" height={28} />
          <Skeleton width="60%" />
        </div>
      ))}
    </div>
  );
}
