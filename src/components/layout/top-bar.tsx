"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { NavMenu } from "@/components/layout/nav-menu";
import { SearchBox } from "@/components/layout/search-box";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { useModShortcut } from "@/hooks/use-keyboard-shortcut";
import type { ShellModel } from "@/features/shell/types";

/** One popup at a time: a category menu, the search box, or the profile dropdown. */
type Open = { kind: "none" } | { kind: "cat"; id: string } | { kind: "search" } | { kind: "profile" };

export function TopBar({ model }: { model: ShellModel }) {
  const [open, setOpen] = useState<Open>({ kind: "none" });
  const [drawer, setDrawer] = useState(false); // mobile / tablet navigation drawer
  const kbdHint = useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘K" : "Ctrl+K"),
    () => "Ctrl+K",
  );

  const openSearch = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setOpen({ kind: "search" });
  }, []);
  useModShortcut("k", openSearch);

  const categoryLabelOf = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of model.categories) if (c.id !== "fav") for (const i of c.items) m[i.id] = c.label;
    return m;
  }, [model.categories]);

  const anyOpen = open.kind !== "none" || drawer;
  const closeAll = () => { setOpen({ kind: "none" }); setDrawer(false); };
  return (
    <>
      {anyOpen ? <button type="button" className="fixed inset-0 z-25 m-0 cursor-default border-0 bg-transparent p-0" tabIndex={-1} aria-label="ปิดเมนู" onClick={closeAll} /> : null}
      <header className="sticky top-0 z-30 border-b border-bar-edge bg-slate text-bar-text" onKeyDown={(e) => { if (e.key === "Escape") closeAll(); }}>
        <div className="flex h-14 items-center gap-2 px-2 min-[641px]:h-16 nav:gap-4 nav:pr-4 nav:pl-5">
          <button type="button" className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full bg-transparent text-bar-text hover:bg-bar-hover nav:hidden" aria-label={drawer ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={drawer} aria-controls="main-nav" onClick={() => { setOpen({ kind: "none" }); setDrawer(!drawer); }}>
            <Icon d={drawer ? IC.close : IC.menu} size={22} stroke={2} />
          </button>
          <Link href="/dashboard" className="flex flex-none cursor-pointer items-center gap-2.5 rounded-md border-0 bg-transparent px-1 py-1.5 text-white no-underline hover:text-white" aria-label="Ucoop หน้าหลัก">
            <span className="flex size-[34px] items-center justify-center rounded-lg bg-teal text-[17px] font-bold shadow-[inset_0_0_0_1px_#2a7f99]">U</span>
            <span className="flex flex-col items-start leading-[1.15]">
              <span className="text-[17px] font-bold tracking-[0.2px]">Ucoop</span>
              <span className="hidden text-xs leading-[inherit] text-bar-dim min-[1181px]:inline">สหกรณ์ออมทรัพย์</span>
            </span>
          </Link>
          <span aria-hidden="true" className="hidden h-7 w-px flex-none bg-bar-sep nav:block" />
          <NavMenu drawerOpen={drawer} onNavigate={() => setDrawer(false)} categories={model.categories} openCat={open.kind === "cat" ? open.id : null} setOpenCat={(id) => setOpen(id ? { kind: "cat", id } : { kind: "none" })} />
          <SearchBox
            open={open.kind === "search"}
            setOpen={(v) => setOpen(v ? { kind: "search" } : { kind: "none" })}
            items={model.searchItems}
            canSearchMembers={model.canSearchMembers}
            kbdHint={kbdHint}
            categoryLabelOf={categoryLabelOf}
          />
          <ProfileMenu user={model.user} open={open.kind === "profile"} setOpen={(v) => setOpen(v ? { kind: "profile" } : { kind: "none" })} demoRoles={model.demoRoles} />
        </div>
      </header>
    </>
  );
}
