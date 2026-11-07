import type { Metadata } from "next";
import { MenuPlaceholderPage } from "@/features/shell/components/menu-page";

export const metadata: Metadata = { title: "สมัครสมาชิก" };

export default function Page() {
  return <MenuPlaceholderPage itemId="m-register" story="Story-Ucoop-0005" />;
}
