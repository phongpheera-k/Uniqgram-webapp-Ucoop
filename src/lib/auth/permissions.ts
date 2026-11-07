import "server-only";
import { db } from "@/lib/db/client";
import { requireUser, type CurrentUser } from "@/lib/auth/session";
import { matrixHas, type ActionId, type ModuleId } from "@/lib/auth/permission-data";
import { MENU_ITEMS, type MenuItemDef } from "@/lib/menu";

export class ForbiddenError extends Error {
  constructor(message = "ไม่มีสิทธิ์เข้าถึง") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function userCan(user: Pick<CurrentUser, "role">, mod: ModuleId, act: ActionId): boolean {
  return matrixHas(db.perms, user.role, mod, act);
}

/** Can this user see / open the menu item? Menu items that fail this are never rendered (SHL-03). */
export function userCanSee(user: Pick<CurrentUser, "role">, item: MenuItemDef): boolean {
  if (item.perm) return userCan(user, item.perm[0], item.perm[1]);
  if (item.roles) return item.roles.includes(user.role);
  return true;
}

/**
 * Authorization at the DAL layer. Throws ForbiddenError — pages should pre-check with
 * `userCan` and render the 403 view; actions/queries use this as the hard guard.
 */
export async function requirePermission(mod: ModuleId, act: ActionId): Promise<CurrentUser> {
  const user = await requireUser();
  if (!userCan(user, mod, act)) throw new ForbiddenError();
  return user;
}

export function permittedMenuItems(user: Pick<CurrentUser, "role">): MenuItemDef[] {
  return MENU_ITEMS.filter((i) => userCanSee(user, i));
}
