export function Skeleton({ width = "100%", height = 14 }: { width?: string | number; height?: number }) {
  return <span className="skel" style={{ width, height }} />;
}

/** Table-shaped loading placeholder (matches the layout of the ready state). */
export function TableSkeleton({ rows = 5, label = "กำลังโหลดข้อมูล…" }: { rows?: number; label?: string }) {
  const widths = [62, 48, 71, 55, 66, 44];
  return (
    <section className="panel" aria-busy="true" aria-label={label}>
      <div role="status" style={{ padding: "14px 16px", color: "#4a5560", borderBottom: "1px solid var(--line-soft)" }}>
        {label}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, padding: 16, borderBottom: "1px solid var(--line-soft)" }}>
          <Skeleton width="18%" />
          <Skeleton width={`${widths[i % widths.length]}%`} />
        </div>
      ))}
    </section>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="kpi-grid" aria-busy="true" aria-label="กำลังโหลดข้อมูล">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="panel kpi">
          <Skeleton width="50%" />
          <Skeleton width="70%" height={28} />
          <Skeleton width="60%" />
        </div>
      ))}
    </div>
  );
}
