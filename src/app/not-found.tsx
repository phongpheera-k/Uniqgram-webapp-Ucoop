import Link from "next/link";

export default function NotFound() {
  return (
    <main className="main" style={{ maxWidth: 640, paddingTop: 80, textAlign: "center" }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>ไม่พบหน้าที่ต้องการ</h1>
      <p style={{ color: "var(--muted)" }}>ลิงก์อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายแล้ว</p>
      <Link href="/dashboard" className="btn" style={{ display: "inline-flex" }}>กลับหน้าภาพรวม</Link>
    </main>
  );
}
