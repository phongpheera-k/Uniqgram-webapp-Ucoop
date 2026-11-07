import { ComingSoon, ForbiddenView } from "@/components/feedback/states";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/session";
import { userCanSee } from "@/lib/auth/permissions";
import { MENU_CATEGORIES, findMenuItem } from "@/lib/menu";

/**
 * Page frame for a menu item whose content belongs to a later story: enforces the permission
 * (403 view when missing) and otherwise shows a “coming in Story-XXXX” panel inside the shell.
 */
export async function MenuPlaceholderPage({ itemId, story }: { itemId: string; story: string }) {
  const user = await requireUser();
  const item = findMenuItem(itemId);
  if (!item) throw new Error(`Unknown menu item ${itemId}`);
  const catLabel = MENU_CATEGORIES.find((c) => c.id === item.cat)?.label ?? "";
  const crumbs = [{ label: "หน้าหลัก", href: "/dashboard" }, { label: catLabel }, { label: item.label }];

  if (!userCanSee(user, item)) {
    return (
      <>
        <PageHeader crumbs={crumbs} title="ไม่มีสิทธิ์เข้าถึง" desc="บทบาทปัจจุบันไม่มีสิทธิ์ใช้งานเมนูนี้" roleName={user.roleName} />
        <ForbiddenView roleName={user.roleName} />
      </>
    );
  }
  return (
    <>
      <PageHeader crumbs={crumbs} title={item.label} desc={item.desc} roleName={user.roleName} />
      <ComingSoon title={item.label} story={story} />
    </>
  );
}
