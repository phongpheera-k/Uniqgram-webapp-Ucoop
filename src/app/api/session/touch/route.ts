import { touchSession } from "@/lib/auth/session";

/** Keep-alive for the client idle guard. Only slides the idle window of a live session. */
export async function POST() {
  const alive = await touchSession();
  return Response.json({ alive }, { status: alive ? 200 : 401, headers: { "Cache-Control": "no-store" } });
}
