import type { Metadata } from "next";
import { MenuPlaceholderPage } from "@/features/shell/components/menu-page";

export const metadata: Metadata = { title: "ข้อมูลของฉัน" };

export default function Page() {
  return <MenuPlaceholderPage itemId="m-me" story="Story-Ucoop-0004" />;
}
