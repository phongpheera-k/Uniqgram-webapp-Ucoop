# Ucoop webapp — progress & context

Last updated: 2026-11-08

## Goal
Thai-language savings-cooperative web app built with Next.js, following the design in `../../design/`
(prototype `.dc.html` files + briefs) and the BRD in `../../brd/ucoop-prototype/`.
Project rules: `../../CLAUDE.md`, `AGENTS.md` (feature-driven structure, thin `page.tsx`, server-only DAL with RBAC,
PDPA masking + audit log, 4 UI states Ready/Loading/Empty/Error, tokens Sarabun / Teal #0E5A73 / Slate #10202B / Neutral #F3F5F7).

## Status by story
| Story | Scope | Status |
|---|---|---|
| 0001 | Authentication: login, lockout, forgot password, first-login password, idle timeout | Done |
| 0002 | App shell (start menu, search, profile menu, favorites) + Dashboard (staff / member) | Done |
| 0007 | Account (change password) + Member in/out report with CSV export | Done |
| 0003–0006 | Members list / approvals / profile / registration / admin | Not started (routes are placeholders) |
| Responsive | Mobile and tablet layout | Done (see below) |
| Tailwind | Tailwind v4 installed, tokens mapped | Done (foundation only, see below) |

## Stack
Next.js 16.4.5 (App Router, Turbopack, `proxy.ts` instead of middleware), React 19.3, TypeScript strict,
Zod, bcryptjs, vitest 5, Tailwind CSS v4 (`@tailwindcss/postcss`).
`npm i` needs `--legacy-peer-deps` (vitest peer conflict).

## Run
```bash
cd webapp/ucoop
npm run dev        # http://localhost:3000
npm run typecheck && npx eslint src && npm test && npm run build
```
Env (Zod, `src/lib/env.ts`): `SESSION_IDLE_MINUTES` (30), `MAX_LOGIN_ATTEMPTS` (5), `DEMO_MODE` (on outside production).

Demo accounts, password `Demo@1234`: `admin.wipa`, `reg.somsak` (first login), `reg.kanya`, `appr.niran`,
`comm.pranee`, `m100245`, `m100231` (member), `temp.staff02` (suspended), `lock.user` (locked).

## Architecture notes
- `src/features/<feature>/{components,server,schemas,types}`: auth, shell, dashboard, account, reports, members.
- `src/lib/db/client.ts`: in-memory store on `globalThis` (users, sessions, audit, permission matrix, favorites,
  reset requests). It is the single seam to replace with a real DB.
- Sessions: opaque id cookie `ucoop_session` (HttpOnly, SameSite=Lax), server-side idle timeout, client `IdleGuard`
  pings `/api/session/touch` and shows an expiry modal.
- Permissions: role × module × action matrix (`src/lib/auth/permission-data.ts`); menu items hidden without permission;
  403 rendered inside the shell.
- PDPA: `maskNid`, NID check digit in `src/lib/pdpa/pii.ts`; every profile/report access goes through `logAudit`.
- Thai Buddhist dates, Asia/Bangkok, in `src/lib/formatters/`.

## Git / deployment
- Repo: https://github.com/phongpheera-k/Uniqgram-webapp-Ucoop.git (branch `main`).
- The user pushed the first commit themselves and stored credentials locally; Claude may push from now on
  (never embed a token in the remote URL or git config).
- Uncommitted at time of writing: responsive layout changes, Tailwind setup, this file.

## Responsive layout (done)
- `<=1024px`: category bar becomes a slide-in drawer (hamburger in `top-bar.tsx`, `NavMenu` props `className` /
  `onNavigate`); categories expand as an accordion; search expands full-width; results and profile dropdown are fixed.
- `<=640px`: single-column KPIs, tables scroll horizontally inside their panel, 44px touch targets,
  login side panel collapses to the brand only.
- Verified in the browser pane at 375px and 768px (login, dashboard, reports, drawer, search).
- Not yet checked: profile and first-password pages on mobile, landscape phones.

## Tailwind (foundation only)
- Added `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `postcss.config.mjs`.
- `src/app/globals.css` starts with `@import "tailwindcss"` and an `@theme inline` block exposing the design tokens
  (`bg-teal`, `text-slate`, `border-line`, `bg-neutral`, `text-muted`, status colours, `font-sans` = Sarabun).
- The existing hand-written classes (`.topbar`, `.panel`, `.tbl`, `.btn` …) and inline styles were kept unchanged and are
  unlayered, so they override Tailwind's preflight and utilities. Result: no visual change (checked login, dashboard,
  change-password in a production build).
- Not done: rewriting every component's classes and inline styles into utilities. Doing that all at once would be a
  large, risky change. Recommended path: write new UI with utilities, and migrate legacy classes feature by feature
  (shell/top-bar first), checking screenshots each time. Then remove the matching rules from `globals.css`.

## Deviations / decisions worth knowing
- Members search is mock data (`features/members/server/member-queries.ts`) until Story 0003.
- Demo role switcher in the profile menu only exists when `DEMO_MODE` is on.
- Placeholders for future stories use `MenuPlaceholderPage` (`features/shell/components/menu-page.tsx`).

## Known gotchas
- Port 3000 may already hold a stale server; kill with `lsof -ti :3000 | xargs kill`.
- Inline `style` beats class rules: use `!important` when a media query must override an inline value
  (e.g. `.auth-side>div:nth-child(n+2)`).

## Next steps
1. Commit and push the responsive and Tailwind changes.
2. Stories 0003–0006 when requested.
3. Gradually migrate legacy CSS classes to Tailwind utilities.
4. Replace the in-memory store with a real database.
