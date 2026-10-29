// US numbers only: the shop's customers are local, so 10 digits get the +1 country code.
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return digits;
  return null;
}

// "19195550142" (normalizePhone's output) → "(919) 555-0142"
export function formatPhone(digits: string): string {
  return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
}
