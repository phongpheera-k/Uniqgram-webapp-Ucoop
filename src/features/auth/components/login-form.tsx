"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Alert } from "@/components/feedback/alert";
import { IC } from "@/lib/icons";
import { loginAction } from "@/features/auth/server/auth-actions";
import type { FormAlert, LoginState } from "@/features/auth/types";
import { AUTH_CARD, BTN, BTN_GHOST, BTN_SM_MEDIUM, FIELD, LABEL, LINK_BTN } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

export interface DemoAccount {
  username: string;
  label: string;
}

interface Props {
  initialUsername?: string;
  /** Alert shown before the first submit (e.g. session expired — AUTH-08). */
  initialAlert?: FormAlert | null;
  /** Provided only in demo mode. */
  demoAccounts?: DemoAccount[];
  demoPassword?: string;
}

export function LoginForm({ initialUsername = "", initialAlert = null, demoAccounts = [], demoPassword = "" }: Props) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, { alert: initialAlert, username: initialUsername });
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const alert = state.alert;
  return (
    <form
      className={AUTH_CARD}
      action={(fd) => {
        formAction(fd);
        setPassword("");
      }}
    >
      <div>
        <h2 className="m-0 text-2xl">เข้าสู่ระบบ</h2>
        <p className="mt-1 mb-0 text-muted">กรอกชื่อผู้ใช้และรหัสผ่านที่ได้รับจากผู้ดูแลระบบ</p>
      </div>

      {alert ? (
        <Alert tone={alert.tone} icon={IC[alert.icon]} live={alert.tone === "info" ? "status" : "alert"}>
          {alert.text}
        </Alert>
      ) : null}

      <div>
        <label className={LABEL} htmlFor="lg-u">ชื่อผู้ใช้</label>
        <input id="lg-u" name="username" className={FIELD} type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required autoFocus={!initialUsername} value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label className={LABEL} htmlFor="lg-p">รหัสผ่าน</label>
        <div className="flex gap-2">
          <input id="lg-p" name="password" className={cn(FIELD, "flex-1")} type={show ? "text" : "password"} autoComplete="current-password" required autoFocus={!!initialUsername} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className={cn(BTN_GHOST, "h-11 min-w-[76px]")} aria-pressed={show} onClick={() => setShow((v) => !v)}>
            {show ? "ซ่อน" : "แสดง"}
          </button>
        </div>
      </div>

      <button type="submit" className={cn(BTN, "h-[46px] text-base")} disabled={pending}>
        {pending ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
      </button>
      <Link href={username ? `/forgot-password?u=${encodeURIComponent(username)}` : "/forgot-password"} className={cn(LINK_BTN, "self-start")}>
        ลืมรหัสผ่าน?
      </Link>

      {demoAccounts.length > 0 ? (
        <div className="flex flex-col gap-2.5 border-t border-line-soft pt-3.5">
          <span className="text-sm text-muted">โหมดทดลอง — กดเพื่อกรอกให้ (รหัสผ่านทุกบัญชี {demoPassword})</span>
          <div className="flex flex-wrap gap-2">
            {demoAccounts.map((d) => (
              <button key={d.username} type="button" className={BTN_SM_MEDIUM} onClick={() => { setUsername(d.username); setPassword(demoPassword); }}>
                {d.username} · {d.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
