import "server-only";
import { cache } from "react";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { db, type SessionRecord, type UserRecord } from "@/lib/db/client";
import { logAudit } from "@/lib/audit/logger";

export const SESSION_COOKIE = "ucoop_session";

export interface CurrentUser {
  username: string;
  name: string;
  dept: string;
  role: string;
  roleName: string;
  initials: string;
  lastLogin: string | null;
  mustChange: boolean;
}

export type SessionState =
  | { status: "ok"; user: CurrentUser }
  | { status: "expired"; username: string }
  | { status: "none" };

function initialsOf(name: string): string {
  const [a = "", b = ""] = name.split(" ");
  return a.charAt(0) + b.charAt(0);
}

export function toCurrentUser(u: UserRecord, s: SessionRecord): CurrentUser {
  return {
    username: u.username,
    name: u.name,
    dept: u.dept,
    role: u.role,
    roleName: db.roles.find((r) => r.id === u.role)?.name ?? u.role,
    initials: initialsOf(u.name),
    lastLogin: u.lastLogin,
    mustChange: s.mustChange,
  };
}

/** Opaque, random session id stored server-side; the cookie carries nothing else. */
export async function createSession(username: string, mustChange: boolean): Promise<void> {
  const id = randomBytes(32).toString("base64url");
  const now = Date.now();
  db.sessions.set(id, { id, username, createdAt: now, lastActive: now, mustChange });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    // The server enforces the idle timeout; the cookie is a browser-session cookie.
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) db.sessions.delete(id);
  jar.delete(SESSION_COOKIE);
}

/**
 * Resolve the session for this request (deduplicated per request).
 * Enforces the idle timeout (AUTH-08) and re-checks account status on every request.
 */
export const getSessionState = cache(async (): Promise<SessionState> => {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return { status: "none" };
  const s = db.sessions.get(id);
  if (!s) return { status: "none" };

  const now = Date.now();
  if (now - s.lastActive > env.SESSION_IDLE_MINUTES * 60_000) {
    db.sessions.delete(id);
    await logAudit({ user: s.username, cat: "auth", action: "เซสชันหมดอายุ", detail: `ไม่มีการใช้งานเกิน ${env.SESSION_IDLE_MINUTES} นาที` });
    return { status: "expired", username: s.username };
  }
  const u = db.users.get(s.username);
  if (!u || u.status !== "active") {
    db.sessions.delete(id);
    return { status: "none" };
  }
  s.lastActive = now;
  return { status: "ok", user: toCurrentUser(u, s) };
});

/** Use in pages/layouts/DAL: returns the signed-in user or redirects to /login. */
export async function requireUser(opts: { allowMustChange?: boolean } = {}): Promise<CurrentUser> {
  const st = await getSessionState();
  if (st.status === "expired") redirect(`/login?expired=1&u=${encodeURIComponent(st.username)}`);
  if (st.status !== "ok") redirect("/login");
  if (st.user.mustChange && !opts.allowMustChange) redirect("/first-password");
  return st.user;
}

/** Keep-alive used by the client idle guard (route handler). Returns false if no live session. */
export async function touchSession(): Promise<boolean> {
  const st = await getSessionState();
  return st.status === "ok";
}
