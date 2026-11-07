"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/feedback/alert";
import { evaluatePasswordRules } from "@/lib/auth/password-rules";
import { PasswordRulesList } from "@/features/auth/components/password-rules-list";
import { changePasswordAction } from "@/features/account/server/account-actions";
import { emptyPasswordState, type PasswordFormState } from "@/features/auth/types";

export function ChangePasswordForm() {
  const [state, setState] = useState<PasswordFormState>(emptyPasswordState);
  const [pending, start] = useTransition();
  const [cur, setCur] = useState("");
  const [np1, setNp1] = useState("");
  const [np2, setNp2] = useState("");

  const rules = evaluatePasswordRules(np1, cur);
  const mismatch = np2.length > 0 && np1 !== np2;
  const canSubmit = cur.length > 0 && rules.every((r) => r.ok) && np1 === np2 && !pending;

  return (
    <form
      className="panel"
      style={{ maxWidth: 520, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          const r = await changePasswordAction(emptyPasswordState, fd);
          setState(r);
          // Keep what the user typed on error; clear everything after success.
          if (r.ok) { setCur(""); setNp1(""); setNp2(""); }
        });
      }}
    >
      {state.ok && state.message ? <Alert tone="ok" live="status">{state.message}</Alert> : null}
      <div>
        <label className="lbl" htmlFor="pw-0">รหัสผ่านปัจจุบัน</label>
        <input id="pw-0" name="currentPassword" className={`field${state.fieldErrors.currentPassword ? " err" : ""}`} type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} style={{ width: "100%", height: 44 }} aria-invalid={!!state.fieldErrors.currentPassword} />
        {state.fieldErrors.currentPassword ? <div role="alert" className="ferr">{state.fieldErrors.currentPassword}</div> : null}
      </div>
      <div>
        <label className="lbl" htmlFor="pw-1">รหัสผ่านใหม่</label>
        <input id="pw-1" name="newPassword" className="field" type="password" autoComplete="new-password" value={np1} onChange={(e) => setNp1(e.target.value)} style={{ width: "100%", height: 44 }} />
        {state.fieldErrors.newPassword && state.rejectedSame === np1 ? <div role="alert" className="ferr">{state.fieldErrors.newPassword}</div> : null}
      </div>
      <PasswordRulesList rules={rules} />
      <div>
        <label className="lbl" htmlFor="pw-2">ยืนยันรหัสผ่านใหม่</label>
        <input id="pw-2" name="confirmPassword" className={`field${mismatch ? " err" : ""}`} type="password" autoComplete="new-password" value={np2} onChange={(e) => setNp2(e.target.value)} style={{ width: "100%", height: 44 }} aria-invalid={mismatch} />
        {mismatch ? <div role="alert" className="ferr">รหัสผ่านทั้งสองช่องไม่ตรงกัน</div> : null}
      </div>
      <div>
        <button type="submit" className="btn" disabled={!canSubmit}>{pending ? "กำลังบันทึก…" : "บันทึกรหัสผ่านใหม่"}</button>
      </div>
    </form>
  );
}
