import type { Metadata } from "next";
import { ForgotForm } from "@/features/auth/components/forgot-form";

export const metadata: Metadata = { title: "ลืมรหัสผ่าน" };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ u?: string }> }) {
  const { u } = await searchParams;
  return <ForgotForm initialUsername={(u ?? "").slice(0, 64)} />;
}
