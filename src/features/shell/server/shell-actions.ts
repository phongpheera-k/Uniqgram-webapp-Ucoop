"use server";

import { revalidatePath } from "next/cache";
import { db, getFavorites } from "@/lib/db/client";
import { requireUser } from "@/lib/auth/session";
import { userCanSee } from "@/lib/auth/permissions";
import { findMenuItem } from "@/lib/menu";
import { searchMembers } from "@/features/members/server/member-queries";
import type { MemberSearchHit } from "@/features/shell/types";
import { z } from "zod";

export async function toggleFavoriteAction(itemId: string): Promise<void> {
  const id = z.string().max(40).parse(itemId);
  const user = await requireUser();
  const item = findMenuItem(id);
  if (!item || item.soon || !userCanSee(user, item)) return;
  const favs = getFavorites(user.username);
  db.favorites.set(user.username, favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);
  revalidatePath("/", "layout");
}

export async function searchMembersAction(query: string): Promise<MemberSearchHit[]> {
  const q = z.string().max(64).parse(query);
  try {
    return await searchMembers(q);
  } catch {
    return []; // no member:view -> no member results (SHL-08)
  }
}
