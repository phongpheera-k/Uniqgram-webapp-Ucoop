"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Alert } from "@/components/feedback/alert";
import { IC } from "@/lib/icons";
import { loginAction } from "@/features/auth/server/auth-actions";
import type { FormAlert, LoginState } from "@/features/auth/types";

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
      className="auth-card"
      action={(fd) => {
        formAction(fd);
        setPassword("");
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 24 }}>เข้าสู่ระบบ</h2>
        <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>กรอกชื่อผู้ใช้และรหัสผ่านที่ได้รับจากผู้ดูแลระบบ</p>
      </div>

      {alert ? (
        <Alert tone={alert.tone} icon={IC[alert.icon]} live={alert.tone === "info" ? "status" : "alert"}>
          {alert.text}
        </Alert>
      ) : null}

      <div>
        <label className="lbl" htmlFor="lg-u">ชื่อผู้ใช้</label>
        <input id="lg-u" name="username" className="field" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required autoFocus={!initialUsername} value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", height: 44 }} />
      </div>
      <div>
        <label className="lbl" htmlFor="lg-p">รหัสผ่าน</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input id="lg-p" name="password" className="field" type={show ? "text" : "password"} autoComplete="current-password" required autoFocus={!!initialUsername} value={password} onChange={(e) => setPassword(e.target.value)} style={{ flex: 1, height: 44 }} />
          <button type="button" className="btn ghost" aria-pressed={show} onClick={() => setShow((v) => !v)} style={{ minWidth: 76, height: 44 }}>
            {show ? "ซ่อน" : "แสดง"}
          </button>
        </div>
      </div>

      <button type="submit" className="btn" disabled={pending} style={{ height: 46, fontSize: 16 }}>
        {pending ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
      </button>
      <Link href={username ? `/forgot-password?u=${encodeURIComponent(username)}` : "/forgot-password"} className="link-btn" style={{ alignSelf: "flex-start" }}>
        ลืมรหัสผ่าน?
      </Link>

      {demoAccounts.length > 0 ? (
        <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>โหมดทดลอง — กดเพื่อกรอกให้ (รหัสผ่านทุกบัญชี {demoPassword})</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {demoAccounts.map((d) => (
              <button key={d.username} type="button" className="sm-btn demo" onClick={() => { setUsername(d.username); setPassword(demoPassword); }}>
                {d.username} · {d.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
