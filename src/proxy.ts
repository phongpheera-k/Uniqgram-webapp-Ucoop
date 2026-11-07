import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge gate (Next.js 16 “proxy”, formerly middleware).
 * - Cheap redirect for anonymous visitors (cookie presence only).
 * - Security headers on every response.
 * The real session + permission checks happen in the DAL (src/lib/auth/*), never here.
 */
const PUBLIC_PREFIXES = ["/login", "/forgot-password", "/api/health", "/_next", "/favicon.ico"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const hasCookie = req.cookies.has("ucoop_session");

  if (!isPublic && !hasCookie && !pathname.startsWith("/api/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "same-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|ico|webp)$).*)"] };
