import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardsSkeleton, Skeleton, TableSkeleton } from "@/components/ui/skeleton";

const meta: Meta = {
  title: "Component CSS/Skeletons & Loading",
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const AllSkeletons: StoryObj = {
  render: () => {
    return (
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate">โครงร่างขณะกำลังโหลด (Skeletons & Shimmer)</h1>
          <p className="text-sm text-muted">
            ตามกฎ 4-State UI: สถานะ Loading ต้องใช้โครงร่าง Skeleton ที่มีขนาดตรงกับเนื้อหาจริง (animate-shim)
          </p>
        </div>

        {/* Basic Skeleton Bars */}
        <div className="rounded-lg border border-line bg-white p-6 space-y-3">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Single Line Skeletons</h3>
          <div className="space-y-3 max-w-md">
            <Skeleton width="40%" height={24} />
            <Skeleton width="85%" />
            <Skeleton width="65%" />
            <Skeleton width="30%" />
          </div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Cards Skeleton (4 Items)</h3>
          <CardsSkeleton count={4} />
        </div>

        {/* Table Skeleton */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-sub uppercase tracking-wider">Table Skeleton (5 Rows)</h3>
          <TableSkeleton rows={5} label="กำลังโหลดรายชื่อสมาชิก…" />
        </div>
      </div>
    );
  },
};
