import "server-only";
import { env } from "@/lib/env";
import { db, getFavorites } from "@/lib/db/client";
import type { CurrentUser } from "@/lib/auth/session";
import { permittedMenuItems, userCan } from "@/lib/auth/permissions";
import { MENU_CATEGORIES, findMenuItem } from "@/lib/menu";
import type { ShellCategory, ShellMenuItem, ShellModel } from "@/features/shell/types";

/** Build the permission-filtered menu model for the signed-in user (SHL-03: hidden, not disabled). */
export function buildShellModel(user: CurrentUser): ShellModel {
  const allowed = permittedMenuItems(user);
  const favIds = getFavorites(user.username);
  const toView = (i: (typeof allowed)[number]): ShellMenuItem => ({
    id: i.id, label: i.label, desc: i.desc, icon: i.icon, route: i.route, soon: !!i.soon, fav: favIds.includes(i.id),
  });

  const categories: ShellCategory[] = MENU_CATEGORIES.map((c) => {
    const items =
      c.id === "fav"
        ? favIds.map((id) => findMenuItem(id)).filter((i): i is NonNullable<typeof i> => !!i && allowed.includes(i)).map(toView)
        : allowed.filter((i) => i.cat === c.id).map(toView);
    return { id: c.id, label: c.label, icon: c.icon, soon: !!c.soon, items };
  }).filter((c) => c.id === "fav" || c.items.length > 0);

  const demoRoles = env.DEMO_MODE
    ? [
        ["admin", "admin.wipa"], ["registrar", "reg.kanya"], ["approver", "appr.niran"], ["committee", "comm.pranee"], ["member", "m100245"],
      ].flatMap(([role, username]) => {
        const r = db.roles.find((x) => x.id === role);
        return r ? [{ roleName: r.name, username: username!, current: user.role === role }] : [];
      })
    : [];

  return {
    user: { username: user.username, name: user.name, roleName: user.roleName, initials: user.initials },
    categories,
    searchItems: allowed.filter((i) => !i.soon && i.route).map(toView),
    canSearchMembers: userCan(user, "member", "view"),
    demoRoles,
    idleMinutes: env.SESSION_IDLE_MINUTES,
  };
}
