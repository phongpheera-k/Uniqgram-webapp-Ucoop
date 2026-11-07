export function formatBaht(n: number | string): string {
  const v = typeof n === "string" ? parseFloat(n.replace(/,/g, "")) : n;
  return Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatInt(n: number): string {
  return n.toLocaleString("en-US");
}
