# Ucoop webapp — progress & context

Last updated: 2026-11-08

> Rule (see `.agents/skills/nextjs-enterprise-architecture/SKILL.md` §6): after **every** piece of work, update this file —
> add a *Change log* entry (what, how verified), refresh *Remaining work*, and the status table.

## Goal
Thai-language savings-cooperative web app built with Next.js, following the design in `../../design/`
(prototype `.dc.html` files + briefs) and the BRD in `../../brd/ucoop-prototype/`.
Project rules: `../../CLAUDE.md`, `../../AGENTS.md`, skill `../../.agents/skills/nextjs-enterprise-architecture/SKILL.md`
(feature-driven structure, thin `page.tsx`, server-only DAL with RBAC, PDPA masking + audit log, 4 UI states,
**Tailwind CSS v4 only**, responsive, tokens Sarabun / Teal #0E5A73 / Slate #10202B / Neutral #F3F5F7).

## Status by story
| Story | Scope | Status |
|---|---|---|
| 0001 | Authentication: login, lockout, forgot password, first-login password, idle timeout | Done |
| 0002 | App shell (start menu, search, profile menu, favorites) + Dashboard (staff / member) | Done |
| 0007 | Account (change password) + Member in/out report with CSV export | Done |
| 0003–0006 | Members list / approvals / profile / registration / admin | Not started (routes are placeholders) |
| Responsive | Phone ≤640px, tablet, desktop; drawer navigation below 1025px | Done |
| Tailwind | All components on Tailwind v4 utilities; legacy CSS removed | Done |
| Storybook | Complete Storybook design system & component CSS (12 stories, Tailwind v4, Sarabun) | Done |

## Remaining work
1. **Commit + push** the Tailwind migration, responsive fixes and docs (nothing is committed from this session's last change set).
2. Stories **0003–0006** (members list/filters/approvals, profile tabs, registration wizard, admin users/roles/audit) — not requested yet.
3. Visual comparison against the prototype was done **statically** (token/markup values + before/after computed-style diff). The prototype cannot be rendered locally because its runtime `design/prototype/support.js` is not in the repo. If the file is provided, do a real side-by-side pass.
4. Not yet checked on a phone-sized viewport: first-password and forgot-password pages, idle-expired modal, landscape orientation.
5. Replace the in-memory store (`src/lib/db/client.ts`) with a real database.
6. Add `tailwind-merge`-free guard: avoid passing conflicting utilities to `cn()` (e.g. `BTN_SM_MEDIUM` exists for that reason). Consider adding `tailwind-merge` if more variants appear.
7. Optional: automated visual/e2e tests (Playwright) for the 375 / 768 / 1440 viewports.

## Stack
Next.js 16.4.5 (App Router, Turbopack, `proxy.ts` instead of middleware), React 19.3, TypeScript strict,
Zod, bcryptjs, vitest 5, **Tailwind CSS v4** (`tailwindcss`, `@tailwindcss/postcss`, `postcss`; no `tailwind.config`).
`npm i` needs `--legacy-peer-deps` (vitest peer conflict).

## Run
```bash
cd webapp/ucoop
npm run dev              # http://localhost:3000
npm run storybook        # http://localhost:6006
npm run build-storybook  # builds static storybook to storybook-static/
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

## Styling (Tailwind v4)
- `src/app/globals.css` = `@import "tailwindcss"` + `@theme` tokens (colours `teal`, `slate`, `neutral`, `ink`, `sub`, `muted`,
  `line*`, status `ok/warn/bad/mute(-bg)`, top-bar `bar-*`; `font-sans` = Sarabun; breakpoint `nav` = 1025px; `animate-drop`,
  `animate-shim`) + a few `@layer base` rules (body 15px/1.5, bold headings, link colours, focus ring, reduced motion).
  **No component CSS lives here.**
- Shared class strings: `src/components/ui/styles.ts` (`BTN`, `BTN_GHOST`, `BTN_SM`, `PANEL`, `PANEL_H`, `TABLE`, `FIELD`,
  `CHIP_*`, `ALERT_*`, `MAIN`, `AUTH_*`, `MODAL*`, …). Compose with `cn()`.
- Inline `style` remains only for data-driven values (skeleton widths, report bar `%`).
- Responsive: `max-[640px]:` for phones, `nav:` / `max-nav:` for desktop vs drawer shell. Drawer lives in `top-bar.tsx` + `nav-menu.tsx`.
- `--text-*--line-height` are 1.5 in `@theme` to match the prototype's inherited 1.5; use `leading-[inherit]` when a child must keep a parent's tighter line-height (brand sub-title, KPI unit).

## Git / deployment
- Repo: https://github.com/phongpheera-k/Uniqgram-webapp-Ucoop.git (branch `main`), git root is `webapp/ucoop`.
- The user stored credentials locally; Claude may push on request (never embed a token in the remote URL or git config).
- Note: `../../AGENTS.md`, `../../CLAUDE.md` and `../../.agents/` sit **outside** this git repo (one level above the pushed root), so doc changes there are not pushed.

## Deviations / decisions worth knowing
- Members search is mock data (`features/members/server/member-queries.ts`) until Story 0003.
- Demo role switcher in the profile menu only exists when `DEMO_MODE` is on.
- Placeholders for future stories use `MenuPlaceholderPage` (`features/shell/components/menu-page.tsx`).
- Headings are bold and line-height is 1.5, as in the prototype (the intermediate Tailwind-foundation commit had accidentally made headings regular weight via preflight).

## Known gotchas
- Port 3000 may already hold a stale server; kill with `lsof -ti :3000 | xargs kill`.
- A Tailwind named text size (`text-sm`) also sets line-height; we map them to 1.5, but arbitrary sizes (`text-[17px]`) inherit.
- Tailwind arbitrary-variant selectors (`[&_th]:…`) have higher specificity than plain utilities on the same cell; use `!` (e.g. `text-[15px]!`) to override.
- Turbopack cannot build from a `node_modules` symlink (needed a real copy for the before/after comparison worktree).

## Change log (newest first)
### 2026-11-08 — Storybook for Ucoop Design System & Component CSS
- **Done:** Set up Storybook 10.6 (`@storybook/nextjs-vite`) supporting React 19 + Next.js 16 + Tailwind CSS v4. Configured `.storybook/preview.tsx` with `globals.css` import, viewports (Mobile 390px, Tablet 768px, Desktop 1440px), background presets, and `.storybook/preview-head.html` with Google Fonts Sarabun.
- **Stories created (12 modules):**
  1. `01-Tokens.stories.tsx`: Color palette (Brand, Text, Status, Surfaces) and Sarabun typography & line-height 1.5.
  2. `02-Buttons.stories.tsx`: `BTN`, `BTN_GHOST`, `BTN_SM`, `BTN_SM_MEDIUM`, `LINK_BTN`, `CRUMB`, disabled & touch targets.
  3. `03-StatusChips.stories.tsx`: All semantic `StatusChip` options (active, approved, pending, docs, rejected, resigned, live, soon, paid) and generic `Chip` tones.
  4. `04-Alerts.stories.tsx`: `Alert` with all tones (bad, warn, info, ok) and accessible ARIA live regions.
  5. `05-Panels.stories.tsx`: `PANEL` and `PANEL_H` with headers, action buttons, tables, and description lists.
  6. `06-Forms.stories.tsx`: `LABEL`, `FIELD`, `FIELD_ERR`, `FIELD_ERR_TEXT`, dropdowns, and `PasswordRulesList`.
  7. `07-Tables.stories.tsx`: `TABLE`, `NUM`, `TNUM`, sortable headers, hover states, and PDPA masked citizen ID.
  8. `08-KPI.stories.tsx`: `KPI_GRID`, `KPI`, `KPI_VALUE` for staff & member dashboards.
  9. `09-Skeleton.stories.tsx`: `Skeleton`, `TableSkeleton`, `CardsSkeleton` with `animate-shim`.
  10. `10-Icons.stories.tsx`: Visual directory of all system icons from `src/lib/icons.ts`.
  11. `11-FeedbackStates.stories.tsx`: 4-state views (`EmptyState`, `ForbiddenView`, `ComingSoon`, `ErrorState` with retry).
  12. `12-Modals.stories.tsx`: `MODAL_BG` and `MODAL` for confirmation, return with reason, and session expired.
- **Fixes:** added `sort` icon to `src/lib/icons.ts`; fixed `PasswordRulesList` typing in story.
- **Verified:** `npm run typecheck` (tsc --noEmit: 0 errors), `npm test` (vitest: 13 test files, 28 tests pass), `npm run build-storybook` (0 errors), `npm run build` (Next.js build: 0 errors).

### 2026-11-08 — Tailwind migration + prototype fidelity check + docs
- **Done:** removed all hand-written component CSS (~230 lines) and static inline styles; every component under `src/components`, `src/features`, `src/app` now uses Tailwind utilities, with shared strings in `src/components/ui/styles.ts`. `Icon` takes `className` (no `style`). New `postcss.config.mjs`, tokens in `@theme`.
- **Fidelity check:** built the pre-migration commit (`fed2fb0`) in a worktree and diffed computed styles element-by-element (≈30 properties + geometry) for login, dashboard, members, reports, profile, change-password at 1440 / 768 / 375 px. Remaining differences are intentional: headings bold + line-height 1.5 (match `design/prototype/Main.dc.html`), panel header 3px taller from that line-height, and the hamburger no longer shows on desktop (it was visible at ≥1025px before — a bug from the earlier responsive commit).
- **Fixes found by the diff:** brand sub-title and KPI-unit line-height, report row header font size, mobile table header padding, brand name stays 17px, nav label alignment, `z-index` on desktop nav.
- **Verified:** `npx tsc --noEmit`, `npx eslint src`, `npx vitest run` (9 pass), `npm run build`; manual check of desktop start-menu popup and profile dropdown, mobile drawer and search.
- **Docs:** skill `SKILL.md` gets §5 Styling (Tailwind) and §6 Progress tracking; `AGENTS.md` / `CLAUDE.md` summaries updated.
- **Not verified:** pages listed in *Remaining work* #4; real prototype render (see #3).

### 2026-11-08 — Responsive layout + Tailwind foundation (commit `fed2fb0`)
- Drawer navigation below 1024px, full-width search, horizontally scrollable tables, 44px touch targets, compact login on phones. Tailwind v4 installed with tokens (legacy CSS kept at that point).

### Earlier — Stories 0001 / 0002 / 0007 (commit `e04d82c`)
- Auth, shell/dashboard, account & reports implemented and verified (typecheck, lint, 9 unit tests, build, browser walkthrough of lockout, first-password, idle expiry, permissions).
