// CRACKODH
import { z } from "zod";

const maintenanceStatusSchema = z.enum(["OPEN", "CLOSED"]);

export const maintenanceFormSchema = z.object({
  vehicleId: z.string().trim().min(1, "Vehicle is required."),
  description: z.string().trim().min(2, "Description is required."),
  cost: z.coerce.number().min(0, "Cost cannot be negative.").optional(),
});

export const maintenanceFilterSchema = z.object({
  q: z.string().trim().optional(),
  status: maintenanceStatusSchema.optional(),
});

export type MaintenanceFormInput = z.infer<typeof maintenanceFormSchema>;
export type MaintenanceFilterInput = z.infer<typeof maintenanceFilterSchema>;

export function parseMaintenanceForm(formData: FormData) {
  const cost = formData.get("cost");
  return maintenanceFormSchema.safeParse({
    vehicleId: formData.get("vehicleId"),
    description: formData.get("description"),
    cost: cost === null || cost === "" ? 0 : cost,
  });
}

export function parseCloseMaintenanceForm(formData: FormData) {
  return z
    .object({
      cost: z.coerce.number().min(0, "Cost cannot be negative."),
    })
    .safeParse({
      cost: formData.get("cost"),
    });
}
