import Link from "next/link";
import { BTN, MAIN } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className={cn(MAIN, "max-w-[640px] pt-20 text-center")}>
      <h1 className="m-0 text-[28px]">ไม่พบหน้าที่ต้องการ</h1>
      <p className="text-muted">ลิงก์อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายแล้ว</p>
      <Link href="/dashboard" className={BTN}>กลับหน้าภาพรวม</Link>
    </main>
  );
}
