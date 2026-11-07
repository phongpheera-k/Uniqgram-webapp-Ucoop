import { CardsSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <CardsSkeleton />
      <TableSkeleton />
    </div>
  );
}
