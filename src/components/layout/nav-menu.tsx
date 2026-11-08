"use client";

import { useRef, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/features/shell/server/shell-actions";
import type { ShellCategory } from "@/features/shell/types";

interface Props {
  categories: ShellCategory[];
  openCat: string | null;
  setOpenCat: (id: string | null) => void;
  /** Mobile / tablet: the nav is a slide-in drawer, shown only while open. */
  drawerOpen?: boolean;
  /** Called after navigating to an item (lets the mobile drawer close). */
  onNavigate?: () => void;
}

/** Start menu (SHL-02, SHL-06): 6 categories, popup under the button, arrow/Enter/Esc keyboard control. */
export function NavMenu({ categories, openCat, setOpenCat, drawerOpen = false, onNavigate }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const barRef = useRef<HTMLElement>(null);
  const [, startTransition] = useTransition();

  const catButtons = () => Array.from(barRef.current?.querySelectorAll<HTMLButtonElement>("[data-cat]") ?? []);
  const itemButtons = () => Array.from(barRef.current?.querySelectorAll<HTMLButtonElement>("[data-mi]") ?? []);
  const focusSoon = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

  const activeCat = categories.find((c) => c.id !== "fav" && c.items.some((i) => i.route === pathname))?.id ?? null;

  function onKeyDown(e: React.KeyboardEvent) {
    const target = e.target as HTMLElement;
    const inItem = target.hasAttribute("data-mi");
    const catBtn = target.closest("[data-cat]") as HTMLButtonElement | null;
    if (e.key === "Escape" && openCat) {
      e.preventDefault();
      e.stopPropagation();
      const id = openCat;
      setOpenCat(null);
      focusSoon(() => barRef.current?.querySelector<HTMLButtonElement>(`[data-cat="${id}"]`)?.focus());
      return;
    }
    if (inItem) {
      const items = itemButtons();
      const i = items.indexOf(target as HTMLButtonElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
      else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (i <= 0) barRef.current?.querySelector<HTMLButtonElement>(`[data-cat="${openCat}"]`)?.focus();
        else items[i - 1]?.focus();
      } else if (e.key === "Home") { e.preventDefault(); items[0]?.focus(); }
      else if (e.key === "End") { e.preventDefault(); items[items.length - 1]?.focus(); }
      return;
    }
    if (catBtn) {
      const btns = catButtons();
      const i = btns.indexOf(catBtn);
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const next = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length]!;
        next.focus();
        if (openCat) setOpenCat(next.dataset.cat ?? null);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const id = catBtn.dataset.cat ?? null;
        if (openCat !== id) setOpenCat(id);
        focusSoon(() => itemButtons()[0]?.focus());
      }
    }
  }

  return (
    <nav id="main-nav" aria-label="เมนูหลัก" ref={barRef} onKeyDown={onKeyDown} className={cn(
        "fixed top-14 bottom-0 left-0 z-35 w-[min(360px,90vw)] flex-col items-stretch gap-0.5 overflow-y-auto bg-slate p-2 shadow-[8px_0_24px_rgba(16,32,43,.35)] min-[641px]:top-16",
        "nav:static nav:z-auto nav:h-full nav:w-auto nav:min-w-0 nav:flex-1 nav:flex-row nav:items-center nav:overflow-visible nav:bg-transparent nav:p-0 nav:shadow-none",
        drawerOpen ? "flex" : "hidden nav:flex",
      )}
    >
      {categories.map((c) => {
        const open = openCat === c.id;
        const cls = cn(
          "flex h-12 w-full cursor-pointer items-center gap-1.5 rounded-md border-0 px-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-150 min-[1101px]:gap-2 min-[1101px]:px-3 nav:h-11 nav:w-auto",
          open ? "bg-bar-hover text-white nav:rounded-t-md nav:rounded-b-none nav:bg-white nav:text-slate" : "bg-transparent hover:bg-bar-hover",
          !open && (c.soon ? "text-bar-soon" : "text-bar-text"),
          open && c.soon && "nav:text-muted",
          !open && activeCat === c.id && "shadow-[inset_0_-3px_0_var(--color-teal-accent)]",
        );
        return (
          <div key={c.id} className="relative nav:flex nav:h-full nav:items-center">
            <button type="button" className={cls} data-cat={c.id} aria-haspopup="true" aria-expanded={open} onClick={() => setOpenCat(open ? null : c.id)}>
              <Icon d={c.icon} />
              <span className="flex-1 text-left nav:flex-none nav:text-center">{c.label}</span>
              {c.soon ? <span className={cn("inline rounded-sm px-1.5 text-xs leading-[18px] font-medium nav:hidden min-[1181px]:inline", open ? "bg-bar-chip text-bar-chip-text nav:bg-mute-bg nav:text-sub" : "bg-bar-chip text-bar-chip-text")}>เร็ว ๆ นี้</span> : null}
              <Icon d={IC.chevronDown} size={14} stroke={2} className="opacity-70" />
            </button>
            {open ? (
              <div className="z-40 mt-0.5 mb-1.5 w-full rounded-lg border border-line bg-white p-2 text-ink nav:absolute nav:top-[54px] nav:left-0 nav:m-0 nav:w-[400px] nav:max-w-[90vw] nav:animate-drop nav:rounded-[0_8px_8px_8px] nav:shadow-[0_12px_32px_rgba(16,32,43,.22)]" role="menu" aria-label={c.label}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 border-b border-line-soft px-2.5 pt-1.5 pb-2.5">
                  <span className="text-base font-bold">{c.label}</span>
                  <span className="text-sm text-muted">{c.soon ? "อยู่ระหว่างพัฒนา" : c.id === "fav" ? "เมนูที่ปักดาวไว้" : `${c.items.length} เมนู`}</span>
                </div>
                {c.items.length === 0 ? <div className="px-2.5 py-4 text-sm text-muted">ยังไม่มีเมนูโปรด — กดรูปดาวข้างเมนูใดก็ได้เพื่อเก็บไว้ที่นี่</div> : null}
                {c.items.map((it) => (
                  <div className="flex items-center gap-1" key={it.id}>
                    <button
                      type="button"
                      data-mi="1"
                      role="menuitem"
                      aria-disabled={it.soon}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-3 rounded-md border-0 p-2.5 text-left",
                        it.soon ? "cursor-not-allowed hover:bg-[#f6f7f8]" : "cursor-pointer hover:bg-hover focus-visible:bg-hover",
                        it.route === pathname ? "bg-teal-light" : "bg-transparent",
                      )}
                      onClick={() => {
                        if (it.soon || !it.route) return;
                        setOpenCat(null);
                        onNavigate?.();
                        router.push(it.route);
                      }}
                    >
                      <span className={cn("flex size-9 flex-none items-center justify-center rounded-md", it.soon ? "bg-[#eef1f3] text-icon" : "bg-teal-light text-teal")}><Icon d={it.icon} size={20} /></span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="flex items-center gap-2">
                          <span className={cn("text-[15px] font-semibold", it.soon ? "text-muted" : "text-ink")}>{it.label}</span>
                          {it.soon ? <span className="inline-flex items-center rounded-full bg-mute-bg px-2 text-xs font-medium whitespace-nowrap text-mute">เร็ว ๆ นี้</span> : null}
                        </span>
                        <span className="text-sm leading-[1.35] text-muted">{it.desc}</span>
                      </span>
                    </button>
                    {!it.soon ? (
                      <button
                        type="button"
                        className="flex size-10 flex-none cursor-pointer items-center justify-center rounded-md border-0 bg-transparent hover:bg-[#f1f3f5]"
                        aria-pressed={it.fav}
                        aria-label={it.fav ? `เอา “${it.label}” ออกจาก Favorite` : `ปักดาว “${it.label}” ไว้ใน Favorite`}
                        onClick={() => startTransition(() => toggleFavoriteAction(it.id))}
                      >
                        <Icon d={IC.star} fill={it.fav ? "#C98A00" : "none"} color={it.fav ? "#9A6A00" : "#5A6672"} />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
