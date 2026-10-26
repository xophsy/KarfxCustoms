const TIME_ZONE = "America/New_York";

// YYYY-MM-DD for the shop's calendar day, whatever time zone the server runs in.
const shopDay = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);

export function formatAge(date: Date, now: Date = new Date()): string {
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (shopDay(date) === shopDay(now)) return `${Math.floor(minutes / 60)} h ago`;

  const yesterday = new Date(now.getTime() - 24 * 60 * 60_000);
  if (shopDay(date) === shopDay(yesterday)) return "Yesterday";

  const sameYear = shopDay(date).slice(0, 4) === shopDay(now).slice(0, 4);
  return date.toLocaleDateString("en-US", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}
