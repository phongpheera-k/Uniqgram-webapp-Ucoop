"use client";

import Link from "next/link";
import { useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { logoutAction, switchDemoUserAction } from "@/features/auth/server/auth-actions";
import type { DemoRoleOption, ShellUser } from "@/features/shell/types";

interface Props {
  user: ShellUser;
  open: boolean;
  setOpen: (v: boolean) => void;
  demoRoles: DemoRoleOption[];
}

/** Profile circle with username underneath + dropdown (SHL-09). */
export function ProfileMenu({ user, open, setOpen, demoRoles }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && open) { e.preventDefault(); e.stopPropagation(); setOpen(false); btnRef.current?.focus(); return; }
    if (!open) return;
    const items = Array.from(wrapRef.current?.querySelectorAll<HTMLElement>("[data-pm]") ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items[(i <= 0 ? items.length : i) - 1]?.focus(); }
  }

  return (
    <div ref={wrapRef} onKeyDown={onKeyDown} style={{ position: "relative", flex: "none" }}>
      <button
        ref={btnRef}
        type="button"
        className="profile-btn"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`เมนูผู้ใช้ ${user.username}`}
        onClick={() => {
          setOpen(!open);
          if (!open) requestAnimationFrame(() => requestAnimationFrame(() => wrapRef.current?.querySelector<HTMLElement>("[data-pm]")?.focus()));
        }}
      >
        <span style={{ width: 34, height: 34, borderRadius: 17, background: "var(--teal-light)", color: "var(--teal)", boxShadow: "0 0 0 2px var(--teal-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{user.initials}</span>
        <span style={{ fontSize: 12, lineHeight: "14px", color: "#d3dce2", maxWidth: 96, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.username}</span>
      </button>
      {open ? (
        <div className="dd" role="menu" aria-label="เมนูผู้ใช้">
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px 12px", borderBottom: "1px solid var(--line-soft)", marginBottom: 6 }}>
            <span style={{ width: 44, height: 44, borderRadius: 22, background: "var(--teal-light)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flex: "none" }}>{user.initials}</span>
            <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontWeight: 700 }}>{user.name}</span>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>{user.username} · {user.roleName}</span>
            </span>
          </div>
          <Link href="/profile" className="dd-item" data-pm="1" role="menuitem" onClick={() => setOpen(false)}>
            <Icon d={IC.user} color="#4a5560" /><span>โปรไฟล์ของฉัน</span>
          </Link>
          <Link href="/profile/password" className="dd-item" data-pm="1" role="menuitem" onClick={() => setOpen(false)}>
            <Icon d={IC.lock} color="#4a5560" /><span>เปลี่ยนรหัสผ่าน</span>
          </Link>
          {demoRoles.length > 0 ? (
            <div style={{ borderTop: "1px solid var(--line-soft)", marginTop: 6 }}>
              <div className="dd-label" style={{ paddingTop: 10 }}><span>สลับบทบาท</span><span style={{ fontWeight: 500 }}>โหมดทดลอง</span></div>
              {demoRoles.map((r) => (
                <form key={r.username} action={switchDemoUserAction}>
                  <input type="hidden" name="username" value={r.username} />
                  <button type="submit" className="dd-item" data-pm="1" role="menuitemradio" aria-checked={r.current} style={{ minHeight: 40 }}>
                    <span className={`radio${r.current ? " on" : ""}`} aria-hidden="true" />
                    <span style={{ flex: 1 }}>{r.roleName}</span>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{r.username}</span>
                  </button>
                </form>
              ))}
            </div>
          ) : null}
          <form action={logoutAction} style={{ borderTop: "1px solid var(--line-soft)", marginTop: 6, paddingTop: 6 }}>
            <button type="submit" className="dd-item" data-pm="1" role="menuitem" style={{ color: "var(--bad)" }}>
              <Icon d={IC.logout} /><span style={{ fontWeight: 600 }}>ออกจากระบบ</span>
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
