import "server-only";
import { db } from "@/lib/db/client";
import { requireUser } from "@/lib/auth/session";
import { ACTS, MODS } from "@/lib/auth/permission-data";
import { userCan } from "@/lib/auth/permissions";
import { formatThaiDateTime } from "@/lib/formatters/date";

export interface AccountProfile {
  name: string;
  username: string;
  roleName: string;
  dept: string;
  lastLogin: string;
  initials: string;
  permissions: Array<{ module: string; actions: string[] }>;
}

/** ACC-01/02/07: any signed-in user may view their own account; permissions are derived from the live matrix. */
export async function getAccountProfile(): Promise<AccountProfile> {
  const user = await requireUser();
  const rec = db.users.get(user.username);
  return {
    name: user.name,
    username: user.username,
    roleName: user.roleName,
    dept: user.dept,
    lastLogin: rec?.lastLogin ? formatThaiDateTime(new Date(rec.lastLogin)) : "ยังไม่เคยเข้าใช้",
    initials: user.initials,
    permissions: MODS.filter((m) => !m.soon).map((m) => ({
      module: m.label,
      actions: ACTS.filter((a) => m.acts.includes(a.id) && userCan(user, m.id, a.id)).map((a) => a.label),
    })),
  };
}
