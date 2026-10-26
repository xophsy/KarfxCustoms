import { describe, expect, it } from "vitest";
import { formatAge } from "@/lib/admin/format";

// 2026-10-26 10:00 in Raleigh (EDT, UTC-4)
const now = new Date("2026-10-26T14:00:00Z");
const ago = (ms: number) => new Date(now.getTime() - ms);
const MIN = 60_000;

describe("formatAge", () => {
  it("counts minutes and hours for today", () => {
    expect(formatAge(ago(20_000), now)).toBe("Just now");
    expect(formatAge(ago(18 * MIN), now)).toBe("18 min ago");
    expect(formatAge(ago(3 * 60 * MIN), now)).toBe("3 h ago");
  });

  it("uses the Raleigh calendar for yesterday and older days", () => {
    expect(formatAge(new Date("2026-10-25T03:30:00Z"), now)).toBe("Oct 24"); // Oct 25 in UTC, but Oct 24 11:30 PM in Raleigh
    expect(formatAge(new Date("2026-10-25T16:00:00Z"), now)).toBe("Yesterday");
    expect(formatAge(new Date("2026-10-20T16:00:00Z"), now)).toBe("Oct 20");
    expect(formatAge(new Date("2025-12-30T16:00:00Z"), now)).toBe("Dec 30, 2025");
  });
});
