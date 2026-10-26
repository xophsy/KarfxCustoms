import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { DEMO, sql } from "@/lib/admin/db";
import { hashPassword, verifyPassword } from "@/lib/admin/password";

export type AdminUser = { id: string; email: string; name: string; role: "owner" | "tech" };

type LoginResult =
  | { ok: true; token: string }
  | { ok: false; error: "Email or password is wrong." | "Too many attempts. Try again in 15 minutes." };

export const SESSION_COOKIE = "kfx_session";
// Demo mode has no passwords: this cookie value signs in the sample owner (see db/seed-demo.sql).
export const DEMO_TOKEN = "demo";
const DEMO_EMAIL = "sales@restorfxraleigh.com";
const SESSION_DAYS = 30;
const MAX_FAILURES = 10;

function pepper(): string {
  const value = process.env.SESSION_PEPPER;
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_PEPPER is not set");
  return "dev-pepper";
}

// The database only ever sees a hash of the cookie, so a leaked sessions table can't be replayed.
const hashToken = (token: string) => createHash("sha256").update(token + pepper()).digest("hex");

// Unknown emails still pay for one scrypt check, so a wrong email takes as long as a wrong password.
let dummyHash: Promise<string> | undefined;
const dummy = () => (dummyHash ??= hashPassword("no user has this password"));

export async function attemptLogin(rawEmail: string, password: string): Promise<LoginResult> {
  const email = rawEmail.trim().toLowerCase();
  const [{ n }] = await sql`select count(*)::int as n from login_failures
    where email = ${email} and at > now() - interval '15 minutes'`;
  if (n >= MAX_FAILURES) return { ok: false, error: "Too many attempts. Try again in 15 minutes." };

  const [user] = await sql`select id, password_hash, active from users where email = ${email}`;
  const valid = await verifyPassword(password, user?.password_hash ?? (await dummy()));
  if (!user || !user.active || !valid) {
    await sql`insert into login_failures (email) values (${email})`;
    return { ok: false, error: "Email or password is wrong." };
  }

  await sql`delete from login_failures where email = ${email}`;
  const token = randomBytes(32).toString("base64url");
  await sql`insert into sessions (token_hash, user_id, expires_at)
    values (${hashToken(token)}, ${user.id}, now() + make_interval(days => ${SESSION_DAYS}))`;
  return { ok: true, token };
}

export async function userForToken(token: string | undefined): Promise<AdminUser | null> {
  if (!token) return null;
  if (DEMO) {
    if (token !== DEMO_TOKEN) return null;
    const [owner] = await sql`select id, email, name, role from users where email = ${DEMO_EMAIL}`;
    return (owner as AdminUser | undefined) ?? null;
  }
  const [user] = await sql`select u.id, u.email, u.name, u.role
    from sessions s join users u on u.id = s.user_id
    where s.token_hash = ${hashToken(token)} and s.expires_at > now() and u.active`;
  return (user as AdminUser | undefined) ?? null;
}

export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function requireUser(role?: "owner"): Promise<AdminUser> {
  const user = await userForToken(cookies().get(SESSION_COOKIE)?.value);
  if (!user) redirect("/admin/login");
  if (role === "owner" && user.role !== "owner") notFound();
  return user;
}

export async function logout(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token && !DEMO) await sql`delete from sessions where token_hash = ${hashToken(token)}`;
  cookies().delete({ name: SESSION_COOKIE, path: "/admin" });
}
