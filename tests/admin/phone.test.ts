import { describe, expect, it } from "vitest";
import { normalizePhone } from "@/lib/admin/phone";

describe("normalizePhone", () => {
  it.each(["(919) 555-0142", "919.555.0142", "+1 919 555 0142", "19195550142"])("%s → 19195550142", (raw) => {
    expect(normalizePhone(raw)).toBe("19195550142");
  });
  it("rejects short or long numbers", () => {
    expect(normalizePhone("555-0142")).toBeNull();
    expect(normalizePhone("291955501421")).toBeNull();
    expect(normalizePhone("")).toBeNull();
  });
});
