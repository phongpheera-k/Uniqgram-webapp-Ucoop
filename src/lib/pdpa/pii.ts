/**
 * PDPA helpers — Thai national ID (NID) handling.
 * NID is masked by default; showing it in full requires the `pii:view` permission.
 */

/** Mask all but the last 3 digits, keeping the dashes (e.g. ×-××××-×××××-02-5). */
export function maskNid(nid: string): string {
  let i = 0;
  return nid.replace(/\d/g, (d) => {
    const k = i++;
    return k >= 10 ? d : "×";
  });
}

/** Check digit for the first 12 digits of a Thai national ID. */
export function nidCheckDigit(d12: string): string {
  let s = 0;
  for (let i = 0; i < 12; i++) s += Number(d12[i]) * (13 - i);
  return String((11 - (s % 11)) % 10);
}

export function isValidNid(digits: string): boolean {
  return /^\d{13}$/.test(digits) && nidCheckDigit(digits.slice(0, 12)) === digits[12];
}

export function formatNid(d: string): string {
  return `${d[0]}-${d.slice(1, 5)}-${d.slice(5, 10)}-${d.slice(10, 12)}-${d[12]}`;
}
