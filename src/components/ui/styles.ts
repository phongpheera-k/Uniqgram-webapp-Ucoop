/**
 * Shared Tailwind class strings for the Ucoop design system (ported from design/prototype).
 * Keep every string a complete literal so Tailwind's scanner can see it.
 * Tokens (bg-teal, text-sub, border-line …) are defined in src/app/globals.css (@theme).
 */

/* ---------- layout ---------- */
export const MAIN = "mx-auto max-w-[1440px] px-6 pt-4 pb-14 max-nav:px-4 max-nav:pb-12 max-[640px]:px-3 max-[640px]:pt-3 max-[640px]:pb-10";
export const STACK = "flex flex-col gap-5";
export const WRAP_ROW = "flex flex-wrap items-start gap-5";

/* ---------- surfaces ---------- */
export const PANEL = "overflow-hidden rounded-lg border border-line bg-white max-[640px]:overflow-x-auto";
export const PANEL_H = "flex items-center justify-between gap-3 border-b border-line bg-panel-h px-4 py-3 max-[640px]:flex-wrap max-[640px]:px-3 max-[640px]:py-2.5 [&_h2]:m-0 [&_h2]:text-base [&_h2]:font-bold";
export const STATE_BOX = "flex flex-col items-center gap-2.5 px-6 py-10 text-center";
export const STATE_ICON = "flex size-14 items-center justify-center rounded-xl";

/* ---------- KPI ---------- */
export const KPI_GRID = "grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3 max-[640px]:grid-cols-1";
export const KPI = "flex flex-col gap-1.5 px-[18px] py-4";
export const KPI_VALUE = "text-[28px] leading-[1.2] font-bold tabular-nums text-slate max-[640px]:text-2xl";

/* ---------- buttons & links ---------- */
const BTN_BASE = "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border font-semibold no-underline";
export const BTN = `${BTN_BASE} h-10 border-teal bg-teal px-4 text-white hover:bg-teal-dark hover:text-white disabled:cursor-not-allowed disabled:border-[#dde2e6] disabled:bg-[#dde2e6] disabled:text-mute max-[640px]:min-h-11`;
export const BTN_GHOST = `${BTN_BASE} h-10 border-line-strong bg-white px-4 text-teal hover:bg-[#f1f5f7] hover:text-teal-dark disabled:cursor-not-allowed disabled:opacity-60 max-[640px]:min-h-11`;
export const BTN_SM = "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-line-strong bg-white px-2.5 text-sm font-semibold whitespace-nowrap text-teal hover:bg-[#f1f5f7] disabled:cursor-wait disabled:opacity-60 max-[640px]:h-11";
export const BTN_SM_MEDIUM = BTN_SM.replace("font-semibold", "font-medium");
export const LINK_BTN = "cursor-pointer rounded border-0 bg-transparent px-1 py-1.5 font-semibold text-teal no-underline hover:text-teal-dark hover:underline";
export const CRUMB = "cursor-pointer border-0 bg-transparent py-0.5 text-sm text-teal no-underline hover:underline";

/* ---------- forms ---------- */
export const LABEL = "mb-1.5 block text-sm font-semibold";
export const FIELD = "h-11 w-full min-w-0 rounded-md border border-line-strong bg-white px-3 text-[15px] text-ink";
export const FIELD_ERR = "border-[#b3261e] shadow-[0_0_0_1px_#b3261e]";
export const FIELD_ERR_TEXT = "mt-1.5 text-sm text-bad";

/* ---------- chips ---------- */
export const CHIP_BASE = "inline-flex items-center gap-1.5 rounded-full py-px pr-2.5 pl-2 text-sm font-medium whitespace-nowrap";
export const CHIP_TONE = {
  ok: "bg-ok-bg text-ok",
  warn: "bg-warn-bg text-warn",
  bad: "bg-bad-bg text-bad",
  mute: "bg-mute-bg text-mute",
  info: "bg-teal-light text-teal-dark",
} as const;

/* ---------- alerts ---------- */
export const ALERT_BASE = "flex gap-2.5 rounded-md border px-3 py-2.5 text-sm leading-[1.45]";
export const ALERT_TONE = {
  bad: "border-[#f0b5af] bg-bad-bg text-[#7a130b]",
  warn: "border-[#ebc97a] bg-warn-bg text-[#5c3b00]",
  info: "border-[#b6d3dd] bg-teal-light text-teal-dark",
  ok: "border-[#a9d6b8] bg-ok-bg text-[#124b2b]",
} as const;

/* ---------- tables ---------- */
export const TABLE =
  "w-full border-collapse text-[15px] max-[640px]:min-w-[520px] " +
  "[&_th]:border-b [&_th]:border-line [&_th]:bg-head [&_th]:px-3.5 [&_th]:py-[9px] [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:whitespace-nowrap [&_th]:text-sub " +
  "[&_td]:border-b [&_td]:border-line-soft [&_td]:px-3.5 [&_td]:py-2.5 [&_td]:align-middle " +
  "max-[640px]:[&_td]:px-2.5 max-[640px]:[&_td]:py-2 max-[640px]:[&_th]:px-2.5 max-[640px]:[&_th]:py-2 " +
  "[&_tbody_tr]:hover:bg-row [&_th.num]:text-right";
export const NUM = "num text-right tabular-nums whitespace-nowrap";
export const TNUM = "tabular-nums";

/* ---------- auth ---------- */
export const AUTH_WRAP = "flex min-h-screen flex-wrap bg-neutral";
export const AUTH_SIDE =
  "flex flex-[1_1_380px] flex-col justify-between gap-10 bg-slate px-10 py-12 text-bar-text " +
  "max-nav:basis-full max-nav:gap-6 max-nav:px-6 max-nav:py-8 max-[640px]:gap-0 max-[640px]:p-4 max-[640px]:[&>div:nth-child(n+2)]:hidden";
export const AUTH_MAIN = "flex min-w-0 flex-[1_1_460px] items-center justify-center px-6 py-8 max-nav:basis-full max-[640px]:items-start max-[640px]:px-3 max-[640px]:pt-4 max-[640px]:pb-4";
export const AUTH_CARD = "flex w-[440px] max-w-full min-w-0 flex-col gap-4 rounded-[10px] border border-line bg-white p-7 max-[640px]:rounded-lg max-[640px]:p-5";

/* ---------- modal ---------- */
export const MODAL_BG = "fixed inset-0 z-90 flex items-center justify-center overflow-auto bg-[rgba(16,32,43,.55)] p-4";
export const MODAL = "flex w-[420px] max-w-full flex-col items-start gap-3.5 rounded-[10px] bg-white p-6 text-ink shadow-[0_20px_48px_rgba(16,32,43,.35)] max-[640px]:p-5";

/* ---------- misc ---------- */
export const DL = "m-0 grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-x-3 gap-y-2 max-[640px]:grid-cols-1 [&_dt]:text-muted";
export const SKELETON = "block h-3.5 animate-shim rounded-sm bg-[linear-gradient(90deg,#e3e8ec,#f2f4f6,#e3e8ec)] bg-[length:200%_100%]";
