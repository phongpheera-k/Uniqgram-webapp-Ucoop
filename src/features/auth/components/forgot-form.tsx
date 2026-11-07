"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { forgotAction } from "@/features/auth/server/auth-actions";
import type { ForgotState } from "@/features/auth/types";

export function ForgotForm({ initialUsername = "" }: { initialUsername?: string }) {
  const [state, formAction, pending] = useActionState<ForgotState, FormData>(forgotAction, { sent: false, error: null, username: initialUsername });

  if (state.sent) {
    return (
      <div className="auth-card" style={{ gap: 14 }}>
        <span className="chip ok" style={{ alignSelf: "flex-start" }}>
          <Icon d={IC.check} size={14} stroke={2.2} />
          ส่งคำขอแล้ว
        </span>
        <h2 style={{ margin: 0, fontSize: 24 }}>ส่งคำขอเรียบร้อย</h2>
        <p role="status" style={{ margin: 0, color: "var(--muted)" }}>
          หากมีชื่อผู้ใช้นี้ในระบบ ผู้ดูแลระบบจะติดต่อกลับเพื่อออกรหัสผ่านชั่วคราวให้ ซึ่งต้องเปลี่ยนใหม่เมื่อเข้าใช้งานครั้งแรก
        </p>
        <Link href="/login" className="btn" style={{ height: 44 }}>กลับไปหน้าเข้าสู่ระบบ</Link>
      </div>
    );
  }

  return (
    <form className="auth-card" action={formAction}>
      <div>
        <h2 style={{ margin: 0, fontSize: 24 }}>ลืมรหัสผ่าน</h2>
        <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>กรอกชื่อผู้ใช้ ระบบจะส่งคำขอรีเซ็ตรหัสผ่านไปยังผู้ดูแลระบบ</p>
      </div>
      <div>
        <label className="lbl" htmlFor="fg-u">ชื่อผู้ใช้</label>
        <input id="fg-u" name="username" className={`field${state.error ? " err" : ""}`} type="text" defaultValue={state.username} autoCapitalize="none" spellCheck={false} required autoFocus style={{ width: "100%", height: 44 }} aria-invalid={!!state.error} />
        {state.error ? <div role="alert" className="ferr">{state.error}</div> : null}
      </div>
      <button type="submit" className="btn" disabled={pending} style={{ height: 46 }}>
        {pending ? "กำลังส่ง…" : "ส่งคำขอรีเซ็ตรหัสผ่าน"}
      </button>
      <Link href="/login" className="link-btn" style={{ alignSelf: "flex-start" }}>← กลับไปหน้าเข้าสู่ระบบ</Link>
    </form>
  );
}
