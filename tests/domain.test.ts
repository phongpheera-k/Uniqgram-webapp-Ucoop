import { describe, expect, it } from "vitest";
import { evaluatePasswordRules, passwordRulesPass } from "@/lib/auth/password-rules";
import { isValidNid, maskNid, nidCheckDigit } from "@/lib/pdpa/pii";
import { DEFAULT_PERMS, matrixHas } from "@/lib/auth/permission-data";
import { buildDeptRows, buildMonthlyRows, summarizeRows, toCsv } from "@/features/reports/server/report-service";

describe("password rules (AUTH-07 / ACC-05)", () => {
  it("requires length, mixed case and a digit", () => {
    expect(passwordRulesPass("Ucoop2569", "old")).toBe(true);
    expect(passwordRulesPass("ucoop2569", "old")).toBe(false);
    expect(passwordRulesPass("Ucoop", "old")).toBe(false);
    expect(passwordRulesPass("Ucoopppp", "old")).toBe(false);
  });
  it("rejects a password equal to the current one", () => {
    expect(passwordRulesPass("Ucoop2569", "Ucoop2569")).toBe(false);
    expect(evaluatePasswordRules("Ucoop2569", "Ucoop2569").find((r) => r.id === "different")?.ok).toBe(false);
  });
});

describe("PDPA", () => {
  it("masks all but the last 3 digits of a Thai NID", () => {
    expect(maskNid("1-0000-00245-02-5")).toBe("×-××××-×××××-02-5");
  });
  it("validates the NID check digit", () => {
    const d12 = "100000024502";
    expect(isValidNid(d12 + nidCheckDigit(d12))).toBe(true);
    expect(isValidNid(d12 + ((+nidCheckDigit(d12) + 1) % 10))).toBe(false);
  });
});

describe("permission matrix (Story-0001/0002/0007)", () => {
  it("member role cannot view reports or the registry", () => {
    expect(matrixHas(DEFAULT_PERMS, "member", "report", "view")).toBe(false);
    expect(matrixHas(DEFAULT_PERMS, "member", "member", "view")).toBe(false);
  });
  it("registrar can view but not export reports; committee can do both", () => {
    expect(matrixHas(DEFAULT_PERMS, "registrar", "report", "view")).toBe(true);
    expect(matrixHas(DEFAULT_PERMS, "registrar", "report", "export")).toBe(false);
    expect(matrixHas(DEFAULT_PERMS, "committee", "report", "export")).toBe(true);
  });
});

describe("member report invariants (Story-0007 acceptance)", () => {
  const flows = [
    { label: "a", joined: 24, left: 5 },
    { label: "b", joined: 31, left: 7 },
    { label: "c", joined: 22, left: 30 },
  ];
  it("closing = previous closing + joined − left on every row", () => {
    const rows = buildMonthlyRows(1000, flows);
    let prev = 1000;
    for (const r of rows) {
      expect(r.closing).toBe(prev + r.joined - r.left);
      prev = r.closing;
    }
    expect(summarizeRows(rows).latestClosing).toBe(prev);
  });
  it("department counts sum to the total and percentages are derived from it", () => {
    const { rows, total } = buildDeptRows([["x", 50], ["y", 150]]);
    expect(total).toBe(200);
    expect(rows.map((r) => r.pct)).toEqual(["25.0%", "75.0%"]);
    expect(rows[1]!.barPct).toBe(100);
  });
  it("csv carries summary data only and a BOM", () => {
    const csv = toCsv(buildMonthlyRows(10, [{ label: "m", joined: 1, left: 0 }]), buildDeptRows([["d", 11]]).rows);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain('"m","1","0","1","11"');
  });
});
