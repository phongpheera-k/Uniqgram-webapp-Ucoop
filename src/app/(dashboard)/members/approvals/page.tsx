import type { Metadata } from "next";
import { MenuPlaceholderPage } from "@/features/shell/components/menu-page";

export const metadata: Metadata = { title: "อนุมัติใบสมัคร" };

export default function Page() {
  return <MenuPlaceholderPage itemId="m-approve" story="Story-Ucoop-0003" />;
}
