import type { Metadata } from "next";
import { MenuPlaceholderPage } from "@/features/shell/components/menu-page";

export const metadata: Metadata = { title: "รายชื่อสมาชิก" };

export default function Page() {
  return <MenuPlaceholderPage itemId="m-list" story="Story-Ucoop-0003" />;
}
