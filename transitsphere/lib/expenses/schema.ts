// CRACKODH
import { z } from "zod";

const expenseCategorySchema = z.enum(["TOLL", "PARKING", "MAINTENANCE", "OTHER"]);

export const EXPENSE_CATEGORY_OPTIONS = [
  { value: "TOLL", label: "Toll" },
  { value: "PARKING", label: "Parking" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OTHER", label: "Other" },
] as const;

export const expenseFormSchema = z.object({
  vehicleId: z.string().trim().min(1, "Vehicle is required."),
  tripId: z.string().trim().optional(),
  category: expenseCategorySchema,
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  note: z.string().trim().optional(),
  incurredAt: z.coerce.date({ message: "Date is required." }),
});

export type ExpenseFormInput = z.infer<typeof expenseFormSchema>;

export function parseExpenseForm(formData: FormData) {
  const tripId = formData.get("tripId");
  const note = formData.get("note");

  return expenseFormSchema.safeParse({
    vehicleId: formData.get("vehicleId"),
    tripId: typeof tripId === "string" && tripId.length > 0 ? tripId : undefined,
    category: formData.get("category"),
    amount: formData.get("amount"),
    note: typeof note === "string" && note.length > 0 ? note : undefined,
    incurredAt: formData.get("incurredAt"),
  });
}

export function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}
