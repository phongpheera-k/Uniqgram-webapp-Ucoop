import type { Metadata, Viewport } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: { default: "Ucoop — ระบบสหกรณ์ออมทรัพย์", template: "%s · Ucoop" },
  description: "ระบบบริหารงานสหกรณ์ออมทรัพย์ (ต้นแบบ ใช้ข้อมูลจำลอง)",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#10202B", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body>{children}</body>
    </html>
  );
}
