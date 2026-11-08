"use client";

import { useActionState, useState } from "react";
import { evaluatePasswordRules } from "@/lib/auth/password-rules";
import { firstPasswordAction, logoutAction } from "@/features/auth/server/auth-actions";
import { PasswordRulesList } from "@/features/auth/components/password-rules-list";
import { emptyPasswordState, type PasswordFormState } from "@/features/auth/types";
import { AUTH_CARD, BTN, FIELD, FIELD_ERR, FIELD_ERR_TEXT, LABEL, LINK_BTN } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

export function FirstPasswordForm({ username }: { username: string }) {
  const [state, formAction, pending] = useActionState<PasswordFormState, FormData>(firstPasswordAction, emptyPasswordState);
  const [np1, setNp1] = useState("");
  const [np2, setNp2] = useState("");

  const rules = evaluatePasswordRules(np1, null, state.rejectedSame);
  const mismatch = np2.length > 0 && np1 !== np2;
  const canSubmit = rules.every((r) => r.ok) && np1 === np2 && !pending;

  return (
    <form className={AUTH_CARD} action={formAction}>
      <div>
        <h2 className="m-0 text-2xl">ตั้งรหัสผ่านใหม่</h2>
        <p className="mt-1 mb-0 text-muted">บัญชี {username} เข้าใช้งานครั้งแรก ต้องเปลี่ยนรหัสผ่านก่อนเข้าสู่ระบบ</p>
      </div>
      <div>
        <label className={LABEL} htmlFor="ch-1">รหัสผ่านใหม่</label>
        <input id="ch-1" name="newPassword" className={cn(FIELD, state.fieldErrors.newPassword && FIELD_ERR)} type="password" autoComplete="new-password" autoFocus value={np1} onChange={(e) => setNp1(e.target.value)} />
        {state.fieldErrors.newPassword && state.rejectedSame === np1 ? <div role="alert" className={FIELD_ERR_TEXT}>{state.fieldErrors.newPassword}</div> : null}
      </div>
      <PasswordRulesList rules={rules} />
      <div>
        <label className={LABEL} htmlFor="ch-2">ยืนยันรหัสผ่านใหม่</label>
        <input id="ch-2" name="confirmPassword" className={cn(FIELD, mismatch && FIELD_ERR)} type="password" autoComplete="new-password" value={np2} onChange={(e) => setNp2(e.target.value)} aria-invalid={mismatch} />
        {mismatch ? <div role="alert" className={FIELD_ERR_TEXT}>รหัสผ่านทั้งสองช่องไม่ตรงกัน</div> : null}
      </div>
      <button type="submit" className={cn(BTN, "h-[46px]")} disabled={!canSubmit}>
        {pending ? "กำลังบันทึก…" : "บันทึกและเข้าสู่ระบบ"}
      </button>
      <button type="submit" formAction={logoutAction} formNoValidate className={cn(LINK_BTN, "self-start")}>
        ← ยกเลิกและออก
      </button>
    </form>
  );
}
