"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { StatusChip, type ChipStatus } from "@/components/ui/status-chip";
import { IC } from "@/lib/icons";
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
    <div onKeyDown={onKeyDown} className="sbox-wrap">
      <div className={`sbox${open ? " open" : ""}`}>
        <input
          ref={inputRef}
          className="s-in"
          type="search"
          placeholder="ค้นหาเมนู หรือ ชื่อ/เลขสมาชิก"
          aria-label="ค้นหา"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          tabIndex={open ? 0 : -1}
          autoComplete="off"
        />
        {!open ? <span className="kbd" aria-hidden="true" style={{ marginLeft: 4 }}>{kbdHint}</span> : null}
        <button ref={btnRef} type="button" className="icon-btn" aria-label={`ค้นหา (${kbdHint})`} aria-expanded={open} title={`ค้นหา (${kbdHint})`} onClick={() => (open ? close(false) : setOpen(true))}>
          <Icon d={IC.search} size={20} stroke={2} />
        </button>
      </div>
      {showResults ? (
        <div className="results" role="listbox" aria-label="ผลการค้นหา">
          {none ? <div style={{ padding: "14px 10px", color: "var(--muted)", fontSize: 14 }}>ไม่พบผลลัพธ์สำหรับ “{q.trim()}”</div> : null}
          {menuHits.length > 0 ? (
            <>
              <div style={{ padding: "4px 10px", fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>เมนู</div>
              {menuHits.map((r) => (
                <button key={r.id} type="button" className="sr" data-sr="1" role="option" aria-selected="false" onClick={() => r.route && go(r.route)}>
                  <span className="mi-ic" style={{ width: 30, height: 30 }}><Icon d={r.icon} size={16} /></span>
                  <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: 14, color: "var(--muted)" }}>{categoryLabelOf[r.id] ?? "ทั่วไป"} › {r.label}</span>
                  </span>
                </button>
              ))}
            </>
          ) : null}
          {memberHits.length > 0 ? (
            <>
              <div style={{ padding: "8px 10px 4px", fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>สมาชิก</div>
              {memberHits.map((m) => (
                <button key={m.id} type="button" className="sr" data-sr="1" role="option" aria-selected="false" onClick={() => go(`/members?q=${m.id}`)}>
                  <span style={{ width: 30, height: 30, borderRadius: 15, background: "var(--mute-bg)", color: "var(--mute)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flex: "none" }}>{m.name.charAt(0)}</span>
                  <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{m.name}</span>
                    <span style={{ fontSize: 14, color: "var(--muted)" }}>เลขสมาชิก <span className="tnum">{m.id}</span> · {m.dept}</span>
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
