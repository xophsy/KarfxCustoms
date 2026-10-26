import { sql } from "@/lib/admin/db";
import { hashPassword } from "@/lib/admin/password";

export async function resetDb() {
  await sql`truncate users, sessions, login_failures, customers, vehicles, leads, activity restart identity cascade`;
}

export async function createTestUser(email: string, password: string, role: "owner" | "tech"): Promise<string> {
  const [user] = await sql`insert into users (email, name, role, password_hash)
    values (${email}, ${role === "owner" ? "Owner Test" : "Tech Test"}, ${role}, ${await hashPassword(password)}) returning id`;
  return user.id;
}
