"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { InputError, createManualLead, saveLeadNotes, setLeadStage, type LeadStage } from "@/lib/admin/leads";
import { requireUser } from "@/lib/admin/session";

const field = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function addLead(_prev: { error: string } | undefined, form: FormData) {
  const user = await requireUser();
  let id: string;
  try {
    id = await createManualLead(
      {
        name: field(form, "name"),
        phone: field(form, "phone"),
        email: field(form, "email") || undefined,
        vehicle: field(form, "vehicle"),
        service: field(form, "service") || undefined,
        source: field(form, "source"),
        notes: field(form, "notes"),
      },
      user.id
    );
  } catch (err) {
    if (err instanceof InputError) return { error: err.message };
    throw err;
  }
  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${id}`);
}

export async function moveLead(form: FormData) {
  const user = await requireUser();
  const id = field(form, "id");
  await setLeadStage(id, field(form, "stage") as LeadStage, user.id);
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function updateNotes(form: FormData) {
  const user = await requireUser();
  const id = field(form, "id");
  await saveLeadNotes(id, String(form.get("notes") ?? ""), user.id);
  revalidatePath(`/admin/leads/${id}`);
}
