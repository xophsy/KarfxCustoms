import { beforeEach, describe, expect, it, vi } from "vitest";
import { attemptLogin, userForToken } from "@/lib/admin/session";
import { createUser, resetPassword, setActive } from "@/lib/admin/users";
import { createTestUser, resetDb } from "./helpers";

// Server actions read the session cookie; tests supply it here.
const cookieJar = vi.hoisted(() => ({ token: "" }));
vi.mock("next/headers", () => ({
  cookies: () => ({ get: () => (cookieJar.token ? { value: cookieJar.token } : undefined), set: () => {}, delete: () => {} }),
}));
import { addMember, changeActive, changePassword } from "@/app/admin/(app)/team/actions";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

describe("team logins", () => {
  let ownerId: string;
  beforeEach(async () => {
    await resetDb();
    ownerId = await createTestUser("owner@example.com", "a-strong-password", "owner");
  });

  it("asks for at least 10 characters", async () => {
    await expect(createUser({ email: "carlos@example.com", name: "Carlos", role: "tech" }, "short")).rejects.toThrow(
      "Use at least 10 characters."
    );
    await expect(resetPassword(ownerId, "short")).rejects.toThrow("Use at least 10 characters.");
  });

  it("keeps at least one active owner", async () => {
    await expect(setActive(ownerId, false)).rejects.toThrow("Keep at least one active owner.");
  });

  it("signs a user out everywhere when their password is reset", async () => {
    const login = await attemptLogin("owner@example.com", "a-strong-password");
    const token = login.ok ? login.token : "";
    await resetPassword(ownerId, "another-strong-password");
    expect(await userForToken(token)).toBeNull();
  });

  it("refuses team actions from a tech", async () => {
    await createUser({ email: "tech@example.com", name: "Tech", role: "tech" }, "tech-password-1");
    const login = await attemptLogin("tech@example.com", "tech-password-1");
    cookieJar.token = login.ok ? login.token : "";
    const notFound = { digest: "NEXT_NOT_FOUND" };
    await expect(addMember(undefined, form({ email: "x@example.com", name: "X", role: "owner", password: "0123456789" }))).rejects.toMatchObject(notFound);
    await expect(changePassword(undefined, form({ id: ownerId, password: "0123456789" }))).rejects.toMatchObject(notFound);
    await expect(changeActive(undefined, form({ id: ownerId, active: "false" }))).rejects.toMatchObject(notFound);
  });
});
