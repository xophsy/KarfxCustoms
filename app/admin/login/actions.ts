"use server";

import { redirect } from "next/navigation";
import { attemptLogin, logout, setSessionCookie } from "@/lib/admin/session";

export async function login(_prev: { error: string } | undefined, form: FormData) {
  const result = await attemptLogin(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
  if (!result.ok) return { error: result.error };
  setSessionCookie(result.token);
  redirect("/admin/leads");
}

export async function logOut() {
  await logout();
  redirect("/admin/login");
}
