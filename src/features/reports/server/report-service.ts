/**
 * Member report calculations (Story-0007 RPT-02..04). Pure functions — no I/O — so the
 * acceptance invariants can be unit-tested:
 *   closing[n] = closing[n-1] + joined[n] − left[n]
 *   Σ members-by-department = total members
 */
export interface MonthlyFlow {
  label: string;
  joined: number;
  left: number;
}

export interface MonthlyRow extends MonthlyFlow {
  net: number;
  closing: number;
}

export function buildMonthlyRows(opening: number, flows: MonthlyFlow[]): MonthlyRow[] {
  let running = opening;
  return flows.map((f) => {
    const net = f.joined - f.left;
    running += net;
    return { ...f, net, closing: running };
  });
}

export interface ReportTotals {
  joined: number;
  left: number;
  latestClosing: number | null;
  latestLabel: string | null;
}

export function summarizeRows(rows: MonthlyRow[]): ReportTotals {
  const last = rows.at(-1);
  return {
    joined: rows.reduce((a, r) => a + r.joined, 0),
    left: rows.reduce((a, r) => a + r.left, 0),
    latestClosing: last?.closing ?? null,
    latestLabel: last?.label ?? null,
  };
}

export interface DeptRow {
  dept: string;
  count: number;
  /** Share of all members, 1 decimal, e.g. "21.3%". */
  pct: string;
  /** Bar width in % relative to the largest department. */
  barPct: number;
}

export function buildDeptRows(counts: Array<[string, number]>): { rows: DeptRow[]; total: number } {
  const total = counts.reduce((a, [, n]) => a + n, 0);
  const max = Math.max(1, ...counts.map(([, n]) => n));
  return {
    total,
    rows: counts.map(([dept, count]) => ({
      dept,
      count,
      pct: total ? ((count / total) * 100).toFixed(1) + "%" : "0.0%",
      barPct: Math.round((count / max) * 100),
    })),
  };
}

export function formatSigned(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

/** CSV with UTF-8 BOM so Thai text opens correctly in Excel. Summary data only (RPT-07). */
export function toCsv(rows: MonthlyRow[], depts: DeptRow[]): string {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines: string[] = [
    ["เดือน", "เข้าใหม่", "ลาออก/พ้นสภาพ", "สุทธิ", "คงเหลือสิ้นเดือน"].map(esc).join(","),
    ...rows.map((r) => [r.label, r.joined, r.left, r.net, r.closing].map(esc).join(",")),
    "",
    ["หน่วยงาน", "จำนวน", "สัดส่วน"].map(esc).join(","),
    ...depts.map((d) => [d.dept, d.count, d.pct].map(esc).join(",")),
  ];
  return "﻿" + lines.join("\r\n");
}
