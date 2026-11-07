"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { NavMenu } from "@/components/layout/nav-menu";
import { SearchBox } from "@/components/layout/search-box";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { useModShortcut } from "@/hooks/use-keyboard-shortcut";
import type { ShellModel } from "@/features/shell/types";

/** One popup at a time: a category menu, the search box, or the profile dropdown. */
type Open = { kind: "none" } | { kind: "cat"; id: string } | { kind: "search" } | { kind: "profile" };

export function TopBar({ model }: { model: ShellModel }) {
  const [open, setOpen] = useState<Open>({ kind: "none" });
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

  const anyOpen = open.kind !== "none";
  return (
    <>
      {anyOpen ? <button type="button" className="backdrop" tabIndex={-1} aria-label="ปิดเมนู" onClick={() => setOpen({ kind: "none" })} /> : null}
      <header className="topbar" onKeyDown={(e) => { if (e.key === "Escape") setOpen({ kind: "none" }); }}>
        <div className="topbar-in">
          <Link href="/dashboard" className="brand" aria-label="Ucoop หน้าหลัก">
            <span className="brand-mark">U</span>
            <span className="brand-text">
              <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.2 }}>Ucoop</span>
              <span className="brand-sub">สหกรณ์ออมทรัพย์</span>
            </span>
          </Link>
          <span aria-hidden="true" style={{ width: 1, height: 28, background: "#2a3d4b", flex: "none" }} />
          <NavMenu categories={model.categories} openCat={open.kind === "cat" ? open.id : null} setOpenCat={(id) => setOpen(id ? { kind: "cat", id } : { kind: "none" })} />
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
