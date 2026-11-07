import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { db, DEMO_PASSWORD } from "@/lib/db/client";
import { getSessionState } from "@/lib/auth/session";
import { LoginForm, type DemoAccount } from "@/features/auth/components/login-form";
import type { FormAlert } from "@/features/auth/types";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

const DEMO_LABELS: Record<string, string> = {
  "admin.wipa": "ผู้ดูแลระบบ",
  "reg.somsak": "ทะเบียน (ครั้งแรก)",
  "appr.niran": "ผู้อนุมัติ",
  "comm.pranee": "กรรมการ",
  m100245: "สมาชิก",
  "temp.staff02": "ถูกระงับ",
  "lock.user": "ถูกล็อก",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ expired?: string; u?: string }> }) {
  const sp = await searchParams;
  const st = await getSessionState();
  if (st.status === "ok") redirect(st.user.mustChange ? "/first-password" : "/dashboard");

  const expired = sp.expired === "1" || st.status === "expired";
  const username = (sp.u ?? (st.status === "expired" ? st.username : "")).slice(0, 64);
  const initialAlert: FormAlert | null = expired
    ? { tone: "info", icon: "clock", text: `เซสชันหมดอายุเนื่องจากไม่มีการใช้งานเกิน ${env.SESSION_IDLE_MINUTES} นาที กรุณาเข้าสู่ระบบอีกครั้ง` }
    : null;

  const demoAccounts: DemoAccount[] = env.DEMO_MODE
    ? Object.keys(DEMO_LABELS).filter((u) => db.users.has(u)).map((u) => ({ username: u, label: DEMO_LABELS[u]! }))
    : [];

  return <LoginForm initialUsername={username} initialAlert={initialAlert} demoAccounts={demoAccounts} demoPassword={env.DEMO_MODE ? DEMO_PASSWORD : ""} />;
}
