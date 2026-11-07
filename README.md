# Ucoop webapp

Next.js 16 (App Router, TypeScript strict) implementation of the Ucoop prototype in `../../design/`.
Architecture: feature-driven colocation — see `../../.agents/skills/nextjs-enterprise-architecture/SKILL.md`.

## Implemented stories (`../../brd/ucoop-prototype/`)

| Story | Scope | Routes |
|---|---|---|
| 0001 Authen | login, lock after 5 failures, forgot password (neutral message), forced first-time password change, 30-min idle expiry (server + client guard + modal), logout, audit of every auth event | `/login` `/forgot-password` `/first-password` |
| 0002 Shell & Dashboard | top bar, Start menu (6 categories, keyboard nav, favorites), expanding search (Ctrl/⌘+K, permission-filtered), profile menu, breadcrumbs, role dashboards, 403 view | `/dashboard` (+ placeholders for later stories) |
| 0007 Account & Reports | my profile + permission list, change password, member report (monthly in/out, by department), CSV export (audited), report-view audit | `/profile` `/profile/password` `/members/reports` |

Menu items belonging to Stories 0003–0006 (`/members`, `/members/register`, `/members/approvals`, `/me`, `/admin/*`) already enforce their permission and render a “coming in Story-XXXX” panel.

## Run

```bash
npm install --legacy-peer-deps   # vitest 5 peer-range workaround
npm run dev                      # http://localhost:3000
npm test && npm run lint && npm run typecheck
```

Demo mode (demo-account buttons on the login page + role switcher in the profile menu) is on outside production, or force it with `DEMO_MODE=true`. All seed accounts use password `Demo@1234`
(`admin.wipa`, `reg.somsak` [first-login], `reg.kanya`, `appr.niran`, `comm.pranee`, `m100245`, `temp.staff02` [suspended], `lock.user` [locked]).

Env vars (validated with Zod in `src/lib/env.ts`): `SESSION_IDLE_MINUTES` (30), `MAX_LOGIN_ATTEMPTS` (5), `DEMO_MODE`.

## Notes / deviations from the prototype

- Real URLs (`/members/reports`) instead of hash routes; the prototype's `#/…` links map 1:1.
- No database yet: `src/lib/db/client.ts` is an in-memory store (users, sessions, audit, permission matrix, favorites). It resets on restart; swap this one module for a real DB.
- Passwords are bcrypt-hashed; sessions are opaque random ids held server-side; the cookie is HttpOnly/SameSite=Lax.
- Dashboard KPIs other than the member total are fixed demo values (as in the prototype).
- Report data is mock; the invariants from Story-0007 (closing balance roll-forward, departments sum = total) are unit-tested and enforced at runtime.
- `proxy.ts` (Next 16’s renamed middleware) only redirects anonymous visitors and sets security headers; authorization lives in the DAL.
