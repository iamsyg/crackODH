import { z } from "zod";

const driverStatusSchema = z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]);

export const driverFormSchema = z.object({
  name: z.string().trim().min(1, "Driver name is required."),
  licenseNumber: z.string().trim().min(2, "License number is required."),
  licenseCategory: z.string().trim().min(1, "License category is required."),
  licenseExpiryDate: z.coerce.date({ message: "License expiry date is required." }),
  contactNumber: z.string().trim().min(6, "Contact number is required."),
  safetyScore: z.coerce
    .number()
    .min(0, "Safety score must be at least 0.")
    .max(100, "Safety score cannot exceed 100."),
  status: driverStatusSchema,
});

export type DriverFormInput = z.infer<typeof driverFormSchema>;

export const driverFilterSchema = z.object({
  q: z.string().trim().optional(),
  status: driverStatusSchema.optional(),
  licenseCategory: z.string().trim().optional(),
  compliance: z.enum(["expired", "expiring", "valid"]).optional(),
});

export type DriverFilterInput = z.infer<typeof driverFilterSchema>;

export function parseDriverForm(formData: FormData) {
  return driverFormSchema.safeParse({
    name: formData.get("name"),
    licenseNumber: formData.get("licenseNumber"),
    licenseCategory: formData.get("licenseCategory"),
    licenseExpiryDate: formData.get("licenseExpiryDate"),
    contactNumber: formData.get("contactNumber"),
    safetyScore: formData.get("safetyScore"),
    status: formData.get("status") ?? "AVAILABLE",
  });
}
