"use server";

import { revalidatePath } from "next/cache";
import { InputError, logActivity } from "@/lib/admin/leads";
import { requireUser } from "@/lib/admin/session";
import { createUser, resetPassword, setActive } from "@/lib/admin/users";

type Result = { error?: string; done?: string } | undefined;
const field = (form: FormData, key: string) => String(form.get(key) ?? "");

async function run(work: () => Promise<string>): Promise<Result> {
  try {
    const done = await work();
    revalidatePath("/admin/team");
    return { done };
  } catch (err) {
    if (err instanceof InputError) return { error: err.message };
    throw err;
  }
}

export async function addMember(_prev: Result, form: FormData): Promise<Result> {
  const owner = await requireUser("owner");
  return run(async () => {
    const id = await createUser({ email: field(form, "email"), name: field(form, "name"), role: field(form, "role") }, field(form, "password"));
    await logActivity("user", id, "created", owner.id);
    return `Added ${field(form, "name").trim()}. Give them their email and password to sign in.`;
  });
}

export async function changePassword(_prev: Result, form: FormData): Promise<Result> {
  const owner = await requireUser("owner");
  return run(async () => {
    await resetPassword(field(form, "id"), field(form, "password"));
    await logActivity("user", field(form, "id"), "password-reset", owner.id);
    return "Password changed. They've been signed out everywhere.";
  });
}

export async function changeActive(_prev: Result, form: FormData): Promise<Result> {
  const owner = await requireUser("owner");
  const active = field(form, "active") === "true";
  return run(async () => {
    await setActive(field(form, "id"), active);
    await logActivity("user", field(form, "id"), active ? "reactivated" : "deactivated", owner.id);
    return active ? "Reactivated." : "Deactivated and signed out.";
  });
}
