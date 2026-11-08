"use client";

import { useRef, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { toggleFavoriteAction } from "@/features/shell/server/shell-actions";
import type { ShellCategory } from "@/features/shell/types";

interface Props {
  categories: ShellCategory[];
  openCat: string | null;
  setOpenCat: (id: string | null) => void;
  /** Extra class for the <nav> (used by the mobile drawer). */
  className?: string;
  /** Called after navigating to an item (lets the mobile drawer close). */
  onNavigate?: () => void;
}

/** Start menu (SHL-02, SHL-06): 6 categories, popup under the button, arrow/Enter/Esc keyboard control. */
export function NavMenu({ categories, openCat, setOpenCat, className, onNavigate }: Props) {
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
    <nav id="main-nav" aria-label="เมนูหลัก" ref={barRef} onKeyDown={onKeyDown} className={`topnav${className ? ` ${className}` : ""}`}>
      {categories.map((c) => {
        const open = openCat === c.id;
        const cls = ["cat", open && "is-open", c.soon && "is-soon", activeCat === c.id && "is-active"].filter(Boolean).join(" ");
        return (
          <div key={c.id} className="cat-wrap">
            <button type="button" className={cls} data-cat={c.id} aria-haspopup="true" aria-expanded={open} onClick={() => setOpenCat(open ? null : c.id)}>
              <Icon d={c.icon} />
              <span>{c.label}</span>
              {c.soon ? <span className="soon-tag">เร็ว ๆ นี้</span> : null}
              <Icon d={IC.chevronDown} size={14} stroke={2} style={{ opacity: 0.7 }} />
            </button>
            {open ? (
              <div className="popup" role="menu" aria-label={c.label}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, padding: "6px 10px 10px", borderBottom: "1px solid var(--line-soft)", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{c.label}</span>
                  <span style={{ fontSize: 14, color: "var(--muted)" }}>{c.soon ? "อยู่ระหว่างพัฒนา" : c.id === "fav" ? "เมนูที่ปักดาวไว้" : `${c.items.length} เมนู`}</span>
                </div>
                {c.items.length === 0 ? <div style={{ padding: "16px 10px", color: "var(--muted)", fontSize: 14 }}>ยังไม่มีเมนูโปรด — กดรูปดาวข้างเมนูใดก็ได้เพื่อเก็บไว้ที่นี่</div> : null}
                {c.items.map((it) => (
                  <div className="mi-row" key={it.id}>
                    <button
                      type="button"
                      data-mi="1"
                      role="menuitem"
                      aria-disabled={it.soon}
                      className={["mi", it.soon && "is-soon", it.route === pathname && "is-current"].filter(Boolean).join(" ")}
                      onClick={() => {
                        if (it.soon || !it.route) return;
                        setOpenCat(null);
                        onNavigate?.();
                        router.push(it.route);
                      }}
                    >
                      <span className="mi-ic"><Icon d={it.icon} size={20} /></span>
                      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="mi-label" style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{it.label}</span>
                          {it.soon ? <span className="chip mute" style={{ fontSize: 12, padding: "0 8px" }}>เร็ว ๆ นี้</span> : null}
                        </span>
                        <span style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.35 }}>{it.desc}</span>
                      </span>
                    </button>
                    {!it.soon ? (
                      <button
                        type="button"
                        className="star"
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
