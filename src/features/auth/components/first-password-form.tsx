"use client";

import { useActionState, useState } from "react";
import { evaluatePasswordRules } from "@/lib/auth/password-rules";
import { firstPasswordAction, logoutAction } from "@/features/auth/server/auth-actions";
import { PasswordRulesList } from "@/features/auth/components/password-rules-list";
import { emptyPasswordState, type PasswordFormState } from "@/features/auth/types";

export function FirstPasswordForm({ username }: { username: string }) {
  const [state, formAction, pending] = useActionState<PasswordFormState, FormData>(firstPasswordAction, emptyPasswordState);
  const [np1, setNp1] = useState("");
  const [np2, setNp2] = useState("");

  const rules = evaluatePasswordRules(np1, null, state.rejectedSame);
  const mismatch = np2.length > 0 && np1 !== np2;
  const canSubmit = rules.every((r) => r.ok) && np1 === np2 && !pending;

  return (
    <form className="auth-card" action={formAction}>
      <div>
        <h2 style={{ margin: 0, fontSize: 24 }}>ตั้งรหัสผ่านใหม่</h2>
        <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>บัญชี {username} เข้าใช้งานครั้งแรก ต้องเปลี่ยนรหัสผ่านก่อนเข้าสู่ระบบ</p>
      </div>
      <div>
        <label className="lbl" htmlFor="ch-1">รหัสผ่านใหม่</label>
        <input id="ch-1" name="newPassword" className={`field${state.fieldErrors.newPassword ? " err" : ""}`} type="password" autoComplete="new-password" autoFocus value={np1} onChange={(e) => setNp1(e.target.value)} style={{ width: "100%", height: 44 }} />
        {state.fieldErrors.newPassword && state.rejectedSame === np1 ? <div role="alert" className="ferr">{state.fieldErrors.newPassword}</div> : null}
      </div>
      <PasswordRulesList rules={rules} />
      <div>
        <label className="lbl" htmlFor="ch-2">ยืนยันรหัสผ่านใหม่</label>
        <input id="ch-2" name="confirmPassword" className={`field${mismatch ? " err" : ""}`} type="password" autoComplete="new-password" value={np2} onChange={(e) => setNp2(e.target.value)} style={{ width: "100%", height: 44 }} aria-invalid={mismatch} />
        {mismatch ? <div role="alert" className="ferr">รหัสผ่านทั้งสองช่องไม่ตรงกัน</div> : null}
      </div>
      <button type="submit" className="btn" disabled={!canSubmit} style={{ height: 46 }}>
        {pending ? "กำลังบันทึก…" : "บันทึกและเข้าสู่ระบบ"}
      </button>
      <button type="submit" formAction={logoutAction} formNoValidate className="link-btn" style={{ alignSelf: "flex-start" }}>
        ← ยกเลิกและออก
      </button>
    </form>
  );
}
