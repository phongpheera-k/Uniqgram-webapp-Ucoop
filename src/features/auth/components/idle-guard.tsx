"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { expireSessionAction } from "@/features/auth/server/auth-actions";

const PING_EVERY_MS = 60_000;

/**
 * Idle watchdog (AUTH-08 / S07). After `idleMinutes` without user activity it ends the
 * session on the server and shows the “session expired” modal. While the user is active it
 * pings the keep-alive endpoint (throttled) so the server-side idle window slides too.
 */
export function IdleGuard({ idleMinutes }: { idleMinutes: number }) {
  const [expiredUser, setExpiredUser] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const lastActivity = useRef(0);
  const lastPing = useRef(0);
  const btn = useRef<HTMLButtonElement>(null);

  const onActivity = useCallback(() => {
    lastActivity.current = Date.now();
  }, []);

  useEffect(() => {
    if (expired) return;
    lastActivity.current = Date.now();
    lastPing.current = Date.now();
    const events = ["pointerdown", "keydown", "scroll", "visibilitychange"] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    const idleMs = idleMinutes * 60_000;
    const timer = window.setInterval(async () => {
      const now = Date.now();
      if (now - lastActivity.current >= idleMs) {
        const u = await expireSessionAction().catch(() => null);
        setExpiredUser(u);
        setExpired(true);
        return;
      }
      if (lastActivity.current > lastPing.current && now - lastPing.current >= PING_EVERY_MS) {
        lastPing.current = now;
        fetch("/api/session/touch", { method: "POST", cache: "no-store" }).catch(() => undefined);
      }
    }, 5_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      window.clearInterval(timer);
    };
  }, [expired, idleMinutes, onActivity]);

  useEffect(() => {
    if (expired) btn.current?.focus();
  }, [expired]);

  if (!expired) return null;
  const href = expiredUser ? `/login?expired=1&u=${encodeURIComponent(expiredUser)}` : "/login?expired=1";
  return (
    <div className="modal-bg" style={{ zIndex: 100 }}>
      <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="m-ex" aria-describedby="m-exd">
        <span className="chip warn" style={{ padding: 8, borderRadius: 10 }}>
          <Icon d={IC.clock} size={26} />
        </span>
        <h2 id="m-ex" style={{ margin: 0, fontSize: 20 }}>เซสชันหมดอายุ</h2>
        <p id="m-exd" style={{ margin: 0, color: "#4a5560" }}>ไม่มีการใช้งานเกิน {idleMinutes} นาที ระบบออกจากระบบให้เพื่อความปลอดภัย งานที่ยังไม่บันทึกอาจหายไป</p>
        {/* Full navigation so no stale client state survives. */}
        <a ref={btn as unknown as React.Ref<HTMLAnchorElement>} href={href} className="btn">เข้าสู่ระบบอีกครั้ง</a>
      </div>
    </div>
  );
}
