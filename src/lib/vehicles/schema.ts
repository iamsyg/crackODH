import { z } from "zod";

const vehicleStatusSchema = z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]);

export const vehicleFormSchema = z.object({
  registrationNumber: z.string().trim().min(2, "Registration number is required."),
  name: z.string().trim().min(1, "Vehicle name is required."),
  model: z.string().trim().optional(),
  type: z.string().trim().min(1, "Vehicle type is required."),
  maxLoadCapacity: z.coerce.number().positive("Capacity must be greater than zero."),
  odometer: z.coerce.number().min(0, "Odometer cannot be negative."),
  acquisitionCost: z.coerce.number().min(0, "Acquisition cost cannot be negative."),
  status: vehicleStatusSchema,
  region: z.string().trim().optional(),
});

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;

export const vehicleFilterSchema = z.object({
  q: z.string().trim().optional(),
  type: z.string().trim().optional(),
  status: vehicleStatusSchema.optional(),
  region: z.string().trim().optional(),
});

export type VehicleFilterInput = z.infer<typeof vehicleFilterSchema>;

export function parseVehicleForm(formData: FormData) {
  return vehicleFormSchema.safeParse({
    registrationNumber: formData.get("registrationNumber"),
    name: formData.get("name"),
    model: formData.get("model") || undefined,
    type: formData.get("type"),
    maxLoadCapacity: formData.get("maxLoadCapacity"),
    odometer: formData.get("odometer"),
    acquisitionCost: formData.get("acquisitionCost"),
    status: formData.get("status") ?? "AVAILABLE",
    region: formData.get("region") || undefined,
  });
}
