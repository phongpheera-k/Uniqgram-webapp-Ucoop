import type { Metadata } from "next";
import { MenuPlaceholderPage } from "@/features/shell/components/menu-page";

export const metadata: Metadata = { title: "บันทึกการใช้งาน" };

export default function Page() {
  return <MenuPlaceholderPage itemId="a-audit" story="Story-Ucoop-0006" />;
}
