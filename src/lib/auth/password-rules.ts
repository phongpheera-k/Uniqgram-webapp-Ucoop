/**
 * Password policy (AUTH-07 / ACC-05). Pure — shared by client forms (instant feedback)
 * and server actions (authoritative check).
 */
export interface PasswordRule {
  id: "length" | "case" | "digit" | "different";
  label: string;
  ok: boolean;
}

/**
 * @param next      the new password
 * @param previous  the old password when the caller knows it (change-password form).
 *                  When unknown (forced first-time change) pass `null`: the "different from old"
 *                  rule is then only enforced by the server.
 * @param rejectedSame a value the server already rejected as equal to the old password
 */
export function evaluatePasswordRules(next: string, previous: string | null, rejectedSame?: string | null): PasswordRule[] {
  const different =
    next.length > 0 && (previous === null ? next !== (rejectedSame ?? undefined) : next !== previous);
  return [
    { id: "length", label: "ยาวอย่างน้อย 8 ตัวอักษร", ok: next.length >= 8 },
    { id: "case", label: "มีตัวอักษรอังกฤษพิมพ์เล็กและพิมพ์ใหญ่", ok: /[a-z]/.test(next) && /[A-Z]/.test(next) },
    { id: "digit", label: "มีตัวเลขอย่างน้อย 1 ตัว", ok: /\d/.test(next) },
    { id: "different", label: "ต่างจากรหัสผ่านเดิม", ok: different },
  ];
}

export function passwordRulesPass(next: string, previous: string | null, rejectedSame?: string | null): boolean {
  return evaluatePasswordRules(next, previous, rejectedSame).every((r) => r.ok);
}
