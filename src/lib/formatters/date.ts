/** Thai Buddhist-era date helpers (Asia/Bangkok). */
const MON = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parts(d: Date) {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  });
  const o: Record<string, string> = {};
  for (const p of f.formatToParts(d)) o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, hh: o.hour, mm: o.minute, wd: WD.indexOf(o.weekday) };
}

export function formatThaiDate(d: Date): string {
  const p = parts(d);
  return `${p.d} ${MON[p.m - 1]} ${p.y + 543}`;
}

export function formatThaiDateTime(d: Date): string {
  const p = parts(d);
  return `${p.d} ${MON[p.m - 1]} ${p.y + 543} ${p.hh}:${p.mm}`;
}

export function formatTime(d: Date): string {
  const p = parts(d);
  return `${p.hh}:${p.mm}`;
}

export function formatThaiLongDay(d: Date): string {
  const p = parts(d);
  return `วัน${DAYS[p.wd]}ที่ ${p.d} ${MON[p.m - 1]} ${p.y + 543}`;
}

export function thaiFiscalYear(d: Date): number {
  return parts(d).y + 543;
}
