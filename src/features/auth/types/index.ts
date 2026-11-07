export type AlertTone = "bad" | "warn" | "info";
export type AlertIcon = "alert" | "lock" | "minus" | "clock";

export interface FormAlert {
  tone: AlertTone;
  icon: AlertIcon;
  text: string;
}

export interface LoginState {
  alert: FormAlert | null;
  username: string;
}

export interface ForgotState {
  sent: boolean;
  error: string | null;
  username: string;
}

export interface PasswordFormState {
  ok: boolean;
  fieldErrors: Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string>>;
  message: string | null;
  /** Value the server rejected as identical to the old password (drives the live rule list). */
  rejectedSame: string | null;
}

export const emptyPasswordState: PasswordFormState = { ok: false, fieldErrors: {}, message: null, rejectedSame: null };
