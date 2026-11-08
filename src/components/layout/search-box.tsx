"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { StatusChip, type ChipStatus } from "@/components/ui/status-chip";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { searchMembersAction } from "@/features/shell/server/shell-actions";
import type { MemberSearchHit, ShellMenuItem } from "@/features/shell/types";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  items: ShellMenuItem[];
  canSearchMembers: boolean;
  kbdHint: string;
  categoryLabelOf: Record<string, string>;
}

/** Expanding search (SHL-07). Menu hits are pre-filtered by permission on the server (SHL-08). */
export function SearchBox({ open, setOpen, items, canSearchMembers, kbdHint, categoryLabelOf }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [q, setQ] = useState("");
  const dq = useDebounce(q.trim(), 200);
  const [members, setMembers] = useState<{ q: string; hits: MemberSearchHit[] }>({ q: "", hits: [] });

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    if (open && canSearchMembers && dq) {
      searchMembersAction(dq).then((hits) => { if (!cancelled) setMembers({ q: dq, hits }); });
    }
    return () => { cancelled = true; };
  }, [dq, open, canSearchMembers]);

  const ql = q.trim().toLowerCase();
  const menuHits = ql ? items.filter((i) => i.label.toLowerCase().includes(ql) || i.desc.toLowerCase().includes(ql)).slice(0, 5) : [];
  const memberHits = canSearchMembers && ql && members.q === dq ? members.hits : [];
  const showResults = open && ql.length > 0;
  const none = showResults && menuHits.length === 0 && memberHits.length === 0 && members.q === dq;

  function close(returnFocus = true) {
    setOpen(false);
    setQ("");
    if (returnFocus) btnRef.current?.focus();
  }

  function go(href: string) {
    close(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const rows = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-sr]"));
      if (!rows.length) return;
      e.preventDefault();
      const i = rows.indexOf(document.activeElement as HTMLElement);
      const next = e.key === "ArrowDown" ? (i + 1) % rows.length : i <= 0 ? (i === 0 ? -1 : rows.length - 1) : i - 1;
      (next === -1 ? inputRef.current : rows[next])?.focus();
    }
    if (e.key === "Enter" && document.activeElement === inputRef.current) {
      const first = menuHits[0];
      if (first?.route) go(first.route);
      else if (memberHits[0]) go(`/members?q=${memberHits[0].id}`);
    }
  }

  return (
    <div onKeyDown={onKeyDown} className="relative flex flex-none items-center max-nav:static">
      <div className={cn("flex items-center rounded-full transition-[background,box-shadow] duration-250 max-nav:ml-auto", open && "bg-bar-field shadow-[inset_0_0_0_1px_var(--color-bar-line)] max-nav:absolute max-nav:inset-x-2 max-nav:top-2.5 max-nav:z-41")}>
        <input
          ref={inputRef}
          className={cn("h-11 border-0 bg-transparent font-[inherit] text-[15px] text-white outline-none transition-[width,opacity,padding] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] placeholder:text-bar-dim", open ? "w-[300px] pr-1 pl-[18px] opacity-100 max-[1100px]:w-[200px] max-nav:w-auto max-nav:flex-1" : "w-0 p-0 opacity-0")}
          type="search"
          placeholder="ค้นหาเมนู หรือ ชื่อ/เลขสมาชิก"
          aria-label="ค้นหา"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          tabIndex={open ? 0 : -1}
          autoComplete="off"
        />
        {!open ? <span className="ml-1 rounded-sm border border-bar-line px-1.5 text-xs leading-[18px] whitespace-nowrap text-bar-chip-text max-[1100px]:hidden" aria-hidden="true">{kbdHint}</span> : null}
        <button ref={btnRef} type="button" className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full bg-transparent text-bar-text hover:bg-bar-hover" aria-label={`ค้นหา (${kbdHint})`} aria-expanded={open} title={`ค้นหา (${kbdHint})`} onClick={() => (open ? close(false) : setOpen(true))}>
          <Icon d={IC.search} size={20} stroke={2} />
        </button>
      </div>
      {showResults ? (
        <div className="fixed inset-x-2 top-[68px] z-40 w-auto rounded-lg border border-line bg-white p-2 text-ink animate-drop shadow-[0_12px_32px_rgba(16,32,43,.22)] max-[640px]:top-[60px] nav:absolute nav:inset-x-auto nav:top-14 nav:right-0 nav:w-[380px] nav:max-w-[92vw]" role="listbox" aria-label="ผลการค้นหา">
          {none ? <div className="px-2.5 py-3.5 text-sm text-muted">ไม่พบผลลัพธ์สำหรับ “{q.trim()}”</div> : null}
          {menuHits.length > 0 ? (
            <>
              <div className="px-2.5 py-1 text-[13px] font-semibold text-muted">เมนู</div>
              {menuHits.map((r) => (
                <button key={r.id} type="button" className="flex w-full cursor-pointer items-center gap-2.5 rounded-md border-0 bg-transparent px-2.5 py-2 text-left hover:bg-hover focus-visible:bg-hover" data-sr="1" role="option" aria-selected="false" onClick={() => r.route && go(r.route)}>
                  <span className="flex size-[30px] flex-none items-center justify-center rounded-md bg-teal-light text-teal"><Icon d={r.icon} size={16} /></span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-sm text-muted">{categoryLabelOf[r.id] ?? "ทั่วไป"} › {r.label}</span>
                  </span>
                </button>
              ))}
            </>
          ) : null}
          {memberHits.length > 0 ? (
            <>
              <div className="px-2.5 pt-2 pb-1 text-[13px] font-semibold text-muted">สมาชิก</div>
              {memberHits.map((m) => (
                <button key={m.id} type="button" className="flex w-full cursor-pointer items-center gap-2.5 rounded-md border-0 bg-transparent px-2.5 py-2 text-left hover:bg-hover focus-visible:bg-hover" data-sr="1" role="option" aria-selected="false" onClick={() => go(`/members?q=${m.id}`)}>
                  <span className="flex size-[30px] flex-none items-center justify-center rounded-full bg-mute-bg text-[13px] font-semibold text-mute">{m.name.charAt(0)}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-sm text-muted">เลขสมาชิก <span className="tabular-nums">{m.id}</span> · {m.dept}</span>
                  </span>
                  <StatusChip status={m.status as ChipStatus} />
                </button>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
