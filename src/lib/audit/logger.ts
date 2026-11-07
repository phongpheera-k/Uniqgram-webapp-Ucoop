import "server-only";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { db, type AuditCategory, type AuditEntry } from "@/lib/db/client";

export async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]!.trim();
    return h.get("x-real-ip") ?? "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

export interface AuditInput {
  user: string;
  cat: AuditCategory;
  action: string;
  detail: string;
  ok?: boolean;
  ip?: string;
}

/**
 * Central audit logger (AUTH-10, PDPA). Never pass passwords, tokens or full NIDs in `detail`.
 */
export async function logAudit(input: AuditInput): Promise<AuditEntry> {
  const entry: AuditEntry = {
    id: randomUUID(),
    at: new Date().toISOString(),
    user: input.user,
    cat: input.cat,
    action: input.action,
    detail: input.detail,
    ip: input.ip ?? (await getClientIp()),
    ok: input.ok !== false,
  };
  db.audit.unshift(entry);
  return entry;
}

/** Raw read — callers must authorize (see audit-queries in the dashboard / admin features). */
export function readAudit(limit: number): AuditEntry[] {
  return db.audit.slice(0, limit);
}
