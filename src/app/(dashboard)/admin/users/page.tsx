import type { Metadata } from "next";
import { MenuPlaceholderPage } from "@/features/shell/components/menu-page";

export const metadata: Metadata = { title: "ผู้ใช้งานระบบ" };

export default function Page() {
  return <MenuPlaceholderPage itemId="a-users" story="Story-Ucoop-0006" />;
}
