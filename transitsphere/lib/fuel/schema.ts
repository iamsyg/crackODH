// CRACKODH
import { z } from "zod";

export const fuelFormSchema = z.object({
  vehicleId: z.string().trim().min(1, "Vehicle is required."),
  tripId: z.string().trim().optional(),
  liters: z.coerce.number().positive("Liters must be greater than zero."),
  cost: z.coerce.number().min(0, "Cost cannot be negative."),
  odometer: z.coerce.number().min(0, "Odometer cannot be negative.").optional(),
  loggedAt: z.coerce.date({ message: "Date is required." }),
});

export type FuelFormInput = z.infer<typeof fuelFormSchema>;

export function parseFuelForm(formData: FormData) {
  const odometer = formData.get("odometer");
  const tripId = formData.get("tripId");

  return fuelFormSchema.safeParse({
    vehicleId: formData.get("vehicleId"),
    tripId: typeof tripId === "string" && tripId.length > 0 ? tripId : undefined,
    liters: formData.get("liters"),
    cost: formData.get("cost"),
    odometer: odometer === null || odometer === "" ? undefined : odometer,
    loggedAt: formData.get("loggedAt"),
  });
}

export function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
