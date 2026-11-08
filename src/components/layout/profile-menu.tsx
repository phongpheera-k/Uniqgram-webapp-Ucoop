"use client";

import Link from "next/link";
import { useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { logoutAction, switchDemoUserAction } from "@/features/auth/server/auth-actions";
import type { DemoRoleOption, ShellUser } from "@/features/shell/types";

const ITEM = "flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-md border-0 bg-transparent px-3 py-2 text-left text-inherit no-underline hover:bg-hover hover:text-inherit focus-visible:bg-hover";

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
    <div ref={wrapRef} onKeyDown={onKeyDown} className="relative flex-none">
      <button
        ref={btnRef}
        type="button"
        className="flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border-0 bg-transparent px-2 py-1 text-bar-text hover:bg-bar-hover"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`เมนูผู้ใช้ ${user.username}`}
        onClick={() => {
          setOpen(!open);
          if (!open) requestAnimationFrame(() => requestAnimationFrame(() => wrapRef.current?.querySelector<HTMLElement>("[data-pm]")?.focus()));
        }}
      >
        <span className="flex size-[34px] items-center justify-center rounded-full bg-teal-light text-sm font-bold text-teal shadow-[0_0_0_2px_var(--color-teal-accent)]">{user.initials}</span>
        <span className="max-w-24 truncate text-xs leading-3.5 text-[#d3dce2] max-[640px]:hidden">{user.username}</span>
      </button>
      {open ? (
        <div className="fixed top-[68px] right-2 z-40 w-[300px] max-w-[calc(100vw-16px)] animate-drop rounded-lg border border-line bg-white p-2 text-ink shadow-[0_12px_32px_rgba(16,32,43,.22)] max-[640px]:top-[60px] nav:absolute nav:top-[62px] nav:right-0" role="menu" aria-label="เมนูผู้ใช้">
          <div className="mb-1.5 flex items-center gap-3 border-b border-line-soft px-3 pt-2 pb-3">
            <span className="flex size-11 flex-none items-center justify-center rounded-full bg-teal-light font-bold text-teal">{user.initials}</span>
            <span className="flex min-w-0 flex-col">
              <span className="font-bold">{user.name}</span>
              <span className="text-sm text-muted">{user.username} · {user.roleName}</span>
            </span>
          </div>
          <Link href="/profile" className={ITEM} data-pm="1" role="menuitem" onClick={() => setOpen(false)}>
            <Icon d={IC.user} color="#4a5560" /><span>โปรไฟล์ของฉัน</span>
          </Link>
          <Link href="/profile/password" className={ITEM} data-pm="1" role="menuitem" onClick={() => setOpen(false)}>
            <Icon d={IC.lock} color="#4a5560" /><span>เปลี่ยนรหัสผ่าน</span>
          </Link>
          {demoRoles.length > 0 ? (
            <div className="mt-1.5 border-t border-line-soft">
              <div className="flex justify-between px-3 pt-2.5 pb-0.5 text-[13px] font-semibold text-muted"><span>สลับบทบาท</span><span className="font-medium">โหมดทดลอง</span></div>
              {demoRoles.map((r) => (
                <form key={r.username} action={switchDemoUserAction}>
                  <input type="hidden" name="username" value={r.username} />
                  <button type="submit" className={cn(ITEM, "min-h-10")} data-pm="1" role="menuitemradio" aria-checked={r.current}>
                    <span className={cn("flex size-[18px] flex-none items-center justify-center rounded-full border-2", r.current ? "border-teal after:size-2 after:rounded-full after:bg-teal after:content-['']" : "border-icon")} aria-hidden="true" />
                    <span className="flex-1">{r.roleName}</span>
                    <span className="text-[13px] text-muted">{r.username}</span>
                  </button>
                </form>
              ))}
            </div>
          ) : null}
          <form action={logoutAction} className="mt-1.5 border-t border-line-soft pt-1.5">
            <button type="submit" className={cn(ITEM, "text-bad")} data-pm="1" role="menuitem">
              <Icon d={IC.logout} /><span className="font-semibold">ออกจากระบบ</span>
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
