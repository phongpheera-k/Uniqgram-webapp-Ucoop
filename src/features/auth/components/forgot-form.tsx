"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Icon } from "@/components/ui/icon";
import { IC } from "@/lib/icons";
import { forgotAction } from "@/features/auth/server/auth-actions";
import type { ForgotState } from "@/features/auth/types";
import { AUTH_CARD, BTN, CHIP_BASE, CHIP_TONE, FIELD, FIELD_ERR, FIELD_ERR_TEXT, LABEL, LINK_BTN } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

export function ForgotForm({ initialUsername = "" }: { initialUsername?: string }) {
  const [state, formAction, pending] = useActionState<ForgotState, FormData>(forgotAction, { sent: false, error: null, username: initialUsername });

  if (state.sent) {
    return (
      <div className={cn(AUTH_CARD, "gap-3.5")}>
        <span className={cn(CHIP_BASE, CHIP_TONE.ok, "self-start")}>
          <Icon d={IC.check} size={14} stroke={2.2} />
          ส่งคำขอแล้ว
        </span>
        <h2 className="m-0 text-2xl">ส่งคำขอเรียบร้อย</h2>
        <p role="status" className="m-0 text-muted">
          หากมีชื่อผู้ใช้นี้ในระบบ ผู้ดูแลระบบจะติดต่อกลับเพื่อออกรหัสผ่านชั่วคราวให้ ซึ่งต้องเปลี่ยนใหม่เมื่อเข้าใช้งานครั้งแรก
        </p>
        <Link href="/login" className={cn(BTN, "h-11")}>กลับไปหน้าเข้าสู่ระบบ</Link>
      </div>
    );
  }

  return (
    <form className={AUTH_CARD} action={formAction}>
      <div>
        <h2 className="m-0 text-2xl">ลืมรหัสผ่าน</h2>
        <p className="mt-1 mb-0 text-muted">กรอกชื่อผู้ใช้ ระบบจะส่งคำขอรีเซ็ตรหัสผ่านไปยังผู้ดูแลระบบ</p>
      </div>
      <div>
        <label className={LABEL} htmlFor="fg-u">ชื่อผู้ใช้</label>
        <input id="fg-u" name="username" className={cn(FIELD, state.error && FIELD_ERR)} type="text" defaultValue={state.username} autoCapitalize="none" spellCheck={false} required autoFocus aria-invalid={!!state.error} />
        {state.error ? <div role="alert" className={FIELD_ERR_TEXT}>{state.error}</div> : null}
      </div>
      <button type="submit" className={cn(BTN, "h-[46px]")} disabled={pending}>
        {pending ? "กำลังส่ง…" : "ส่งคำขอรีเซ็ตรหัสผ่าน"}
      </button>
      <Link href="/login" className={cn(LINK_BTN, "self-start")}>← กลับไปหน้าเข้าสู่ระบบ</Link>
    </form>
  );
}
