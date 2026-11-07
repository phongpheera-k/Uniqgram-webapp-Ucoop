import "server-only";
import { z } from "zod";

/** Validate environment variables once, on first import (boot). */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Idle timeout in minutes (AUTH-08). Default policy value: 30. */
  SESSION_IDLE_MINUTES: z.coerce.number().int().min(1).max(480).default(30),
  /** Failed login attempts before auto-lock (AUTH-03). Default policy value: 5. */
  MAX_LOGIN_ATTEMPTS: z.coerce.number().int().min(3).max(20).default(5),
  /**
   * Demo mode: shows demo accounts on the login page and the role switcher.
   * Defaults to ON outside production. NEVER enable in a real deployment.
   */
  DEMO_MODE: z.enum(["true", "false"]).optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  throw new Error("Invalid environment variables: " + JSON.stringify(parsed.error.flatten().fieldErrors));
}

export const env = {
  NODE_ENV: parsed.data.NODE_ENV,
  SESSION_IDLE_MINUTES: parsed.data.SESSION_IDLE_MINUTES,
  MAX_LOGIN_ATTEMPTS: parsed.data.MAX_LOGIN_ATTEMPTS,
  DEMO_MODE: parsed.data.DEMO_MODE === undefined ? parsed.data.NODE_ENV !== "production" : parsed.data.DEMO_MODE === "true",
};
