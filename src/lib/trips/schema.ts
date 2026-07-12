// CRACKODH
import { z } from "zod";

const tripStatusSchema = z.enum(["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"]);

export const tripFormSchema = z.object({
  source: z.string().trim().min(2, "Source is required."),
  destination: z.string().trim().min(2, "Destination is required."),
  vehicleId: z.string().trim().min(1, "Vehicle is required."),
  driverId: z.string().trim().min(1, "Driver is required."),
  cargoWeight: z.coerce.number().positive("Cargo weight must be greater than zero."),
  plannedDistance: z.coerce.number().positive("Planned distance must be greater than zero."),
  revenue: z.coerce.number().min(0, "Revenue cannot be negative.").optional(),
});

export const completeTripSchema = z.object({
  actualDistance: z.coerce.number().positive("Actual distance must be greater than zero."),
  finalOdometer: z.coerce.number().min(0, "Final odometer cannot be negative."),
  fuelLiters: z.coerce.number().positive("Fuel consumed must be greater than zero."),
  fuelCost: z.coerce.number().min(0, "Fuel cost cannot be negative."),
  revenue: z.coerce.number().min(0, "Revenue cannot be negative.").optional(),
});

export const tripFilterSchema = z.object({
  q: z.string().trim().optional(),
  status: tripStatusSchema.optional(),
});

export type TripFormInput = z.infer<typeof tripFormSchema>;
export type CompleteTripInput = z.infer<typeof completeTripSchema>;
export type TripFilterInput = z.infer<typeof tripFilterSchema>;

export function parseTripForm(formData: FormData) {
  const revenue = formData.get("revenue");
  return tripFormSchema.safeParse({
    source: formData.get("source"),
    destination: formData.get("destination"),
    vehicleId: formData.get("vehicleId"),
    driverId: formData.get("driverId"),
    cargoWeight: formData.get("cargoWeight"),
    plannedDistance: formData.get("plannedDistance"),
    revenue: revenue === null || revenue === "" ? undefined : revenue,
  });
}

export function parseCompleteTripForm(formData: FormData) {
  const revenue = formData.get("revenue");
  return completeTripSchema.safeParse({
    actualDistance: formData.get("actualDistance"),
    finalOdometer: formData.get("finalOdometer"),
    fuelLiters: formData.get("fuelLiters"),
    fuelCost: formData.get("fuelCost"),
    revenue: revenue === null || revenue === "" ? undefined : revenue,
  });
}
