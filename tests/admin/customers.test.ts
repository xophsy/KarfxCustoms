import { beforeEach, describe, expect, it } from "vitest";
import { sql } from "@/lib/admin/db";
import { addVehicle, archiveVehicle, getCustomer, listCustomers, updateCustomer } from "@/lib/admin/customers";
import { upsertCustomer } from "@/lib/admin/leads";
import { createTestUser, resetDb } from "./helpers";

describe("customers", () => {
  let uid: string;
  beforeEach(async () => {
    await resetDb();
    uid = await createTestUser("owner@example.com", "a-strong-password", "owner");
  });

  it("finds a customer by part of the phone number", async () => {
    await upsertCustomer({ name: "Jordan Pierce", phone: "(919) 555-0142" });
    await upsertCustomer({ name: "Nora Kim", phone: "(919) 555-0124" });
    expect((await listCustomers("555-0142")).map((c) => c.name)).toEqual(["Jordan Pierce"]);
  });

  it("finds a customer by name or email, ignoring case", async () => {
    await upsertCustomer({ name: "Jordan Pierce", phone: "(919) 555-0142", email: "jp@example.com" });
    expect((await listCustomers("jordan")).map((c) => c.name)).toEqual(["Jordan Pierce"]);
    expect((await listCustomers("JP@EXAMPLE")).map((c) => c.name)).toEqual(["Jordan Pierce"]);
    expect(await listCustomers("100%")).toEqual([]);
  });

  it("won't give one customer another customer's phone number", async () => {
    await upsertCustomer({ name: "Jordan Pierce", phone: "(919) 555-0142" });
    const nora = await upsertCustomer({ name: "Nora Kim", phone: "(919) 555-0124" });
    await expect(
      updateCustomer(nora, { name: "Nora Kim", phone: "919.555.0142", email: "", notes: "" }, uid)
    ).rejects.toThrow("Another customer already has this phone number.");
  });

  it("hides an archived vehicle from the customer but keeps the row", async () => {
    const id = await upsertCustomer({ name: "Jordan Pierce", phone: "(919) 555-0142" });
    const vehicleId = await addVehicle(id, "2025 Porsche 911 Carrera T", uid);
    expect((await getCustomer(id))?.vehicles.map((v) => v.label)).toEqual(["2025 Porsche 911 Carrera T"]);
    await archiveVehicle(vehicleId, uid);
    expect((await getCustomer(id))?.vehicles).toEqual([]);
    expect((await sql`select count(*)::int as n from vehicles`)[0].n).toBe(1);
  });
});
