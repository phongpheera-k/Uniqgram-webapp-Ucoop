import { CardsSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import { STACK } from "@/components/ui/styles";

export default function Loading() {
  return (
    <div className={STACK}>
      <CardsSkeleton />
      <TableSkeleton />
    </div>
  );
}
