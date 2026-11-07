import type { Metadata } from "next";
import { MenuPlaceholderPage } from "@/features/shell/components/menu-page";

export const metadata: Metadata = { title: "บทบาทและสิทธิ์" };

export default function Page() {
  return <MenuPlaceholderPage itemId="a-roles" story="Story-Ucoop-0006" />;
}
