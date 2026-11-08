"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="th">
      <body className="p-12 text-center font-sans">
        <h1 className="text-2xl">ระบบขัดข้อง</h1>
        <p>เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง</p>
        <button type="button" onClick={reset} className="h-10 cursor-pointer rounded-md border border-line-strong px-4">ลองใหม่</button>
      </body>
    </html>
  );
}
