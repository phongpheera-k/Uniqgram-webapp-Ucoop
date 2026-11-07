"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="th">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 48, textAlign: "center" }}>
        <h1>ระบบขัดข้อง</h1>
        <p>เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง</p>
        <button type="button" onClick={reset} style={{ height: 40, padding: "0 16px" }}>ลองใหม่</button>
      </body>
    </html>
  );
}
