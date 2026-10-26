import { sql } from "@/lib/admin/db";
import { InputError, isUuid } from "@/lib/admin/leads";
import { hashPassword } from "@/lib/admin/password";

export type TeamMember = { id: string; email: string; name: string; role: "owner" | "tech"; active: boolean };

const MIN_PASSWORD = 10;

function checkPassword(password: string) {
  if (password.length < MIN_PASSWORD) throw new InputError("Use at least 10 characters.");
}

export async function listUsers(): Promise<TeamMember[]> {
  const rows = await sql`select id, email, name, role, active from users order by active desc, name`;
  return rows as TeamMember[];
}

export async function createUser(
  input: { email: string; name: string; role: string },
  password: string
): Promise<string> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError("Check the email address.");
  if (!name) throw new InputError("Enter their name.");
  if (input.role !== "owner" && input.role !== "tech") throw new InputError("Pick owner or tech.");
  checkPassword(password);
  const [taken] = await sql`select id from users where email = ${email}`;
  if (taken) throw new InputError("Someone already signs in with that email.");
  const [user] = await sql`insert into users (email, name, role, password_hash)
    values (${email}, ${name}, ${input.role}, ${await hashPassword(password)}) returning id`;
  return user.id;
}

export async function resetPassword(userId: string, password: string): Promise<void> {
  if (!isUuid(userId)) throw new InputError("That person doesn't exist.");
  checkPassword(password);
  await sql`update users set password_hash = ${await hashPassword(password)} where id = ${userId}`;
  await sql`delete from sessions where user_id = ${userId}`;
}

export async function setActive(userId: string, active: boolean): Promise<void> {
  if (!isUuid(userId)) throw new InputError("That person doesn't exist.");
  if (!active) {
    const [{ others }] = await sql`select count(*)::int as others from users
      where role = 'owner' and active and id <> ${userId}`;
    const [target] = await sql`select role from users where id = ${userId}`;
    if (target?.role === "owner" && others === 0) throw new InputError("Keep at least one active owner.");
  }
  await sql`update users set active = ${active} where id = ${userId}`;
  if (!active) await sql`delete from sessions where user_id = ${userId}`;
}
