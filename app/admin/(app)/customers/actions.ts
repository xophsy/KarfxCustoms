"use server";

import { revalidatePath } from "next/cache";
import { addVehicle, archiveVehicle, updateCustomer } from "@/lib/admin/customers";
import { InputError } from "@/lib/admin/leads";
import { requireUser } from "@/lib/admin/session";

const field = (form: FormData, key: string) => String(form.get(key) ?? "");

export async function saveCustomer(_prev: { error?: string; saved?: boolean } | undefined, form: FormData) {
  const user = await requireUser();
  const id = field(form, "id");
  try {
    await updateCustomer(
      id,
      { name: field(form, "name"), phone: field(form, "phone"), email: field(form, "email"), notes: field(form, "notes") },
      user.id
    );
  } catch (err) {
    if (err instanceof InputError) return { error: err.message };
    throw err;
  }
  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");
  return { saved: true };
}

export async function addVehicleAction(form: FormData) {
  const user = await requireUser();
  const customerId = field(form, "customerId");
  await addVehicle(customerId, field(form, "label"), user.id);
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function archiveVehicleAction(form: FormData) {
  const user = await requireUser();
  await archiveVehicle(field(form, "vehicleId"), user.id);
  revalidatePath(`/admin/customers/${field(form, "customerId")}`);
}
