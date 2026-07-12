// CRACKODH
"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExpenseActionState } from "@/lib/expenses/actions";
import { EXPENSE_CATEGORY_OPTIONS, toDateTimeLocalValue } from "@/lib/expenses/schema";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

type TripOption = {
  id: string;
  reference: string;
  vehicleId: string;
};

type ExpenseFormProps = {
  action: (prevState: ExpenseActionState, formData: FormData) => Promise<ExpenseActionState>;
  vehicles: { id: string; label: string; meta: string }[];
  trips: TripOption[];
  defaultValues?: {
    vehicleId?: string;
    tripId?: string | null;
    category?: string;
    amount?: number;
    note?: string | null;
    incurredAt?: Date;
  };
  submitLabel: string;
};

function fieldError(fieldErrors: Record<string, string[]> | undefined, field: string) {
  const message = fieldErrors?.[field]?.[0];
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

export function ExpenseForm({
  action,
  vehicles,
  trips,
  defaultValues,
  submitLabel,
}: ExpenseFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const selectedVehicleId = defaultValues?.vehicleId ?? "";
  const filteredTrips = selectedVehicleId
    ? trips.filter((trip) => trip.vehicleId === selectedVehicleId)
    : trips;

  return (
    <form action={formAction} className="grid gap-6 rounded-xl border border-border bg-card p-6">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="vehicleId">Vehicle</Label>
          <select
            className={selectClassName}
            defaultValue={defaultValues?.vehicleId ?? ""}
            id="vehicleId"
            name="vehicleId"
            required
          >
            <option disabled value="">
              Select vehicle
            </option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.label} ({vehicle.meta})
              </option>
            ))}
          </select>
          {fieldError(state.fieldErrors, "vehicleId")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tripId">Trip (optional)</Label>
          <select
            className={selectClassName}
            defaultValue={defaultValues?.tripId ?? ""}
            id="tripId"
            name="tripId"
          >
            <option value="">No linked trip</option>
            {filteredTrips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.reference}
              </option>
            ))}
          </select>
          {fieldError(state.fieldErrors, "tripId")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            className={selectClassName}
            defaultValue={defaultValues?.category ?? "OTHER"}
            id="category"
            name="category"
            required
          >
            {EXPENSE_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError(state.fieldErrors, "category")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            defaultValue={defaultValues?.amount}
            id="amount"
            min="0"
            name="amount"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "amount")}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="note">Note (optional)</Label>
          <Input defaultValue={defaultValues?.note ?? ""} id="note" name="note" placeholder="Optional" />
          {fieldError(state.fieldErrors, "note")}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="incurredAt">Incurred at</Label>
          <Input
            defaultValue={
              defaultValues?.incurredAt
                ? toDateTimeLocalValue(defaultValues.incurredAt)
                : toDateTimeLocalValue(new Date())
            }
            id="incurredAt"
            name="incurredAt"
            required
            type="datetime-local"
          />
          {fieldError(state.fieldErrors, "incurredAt")}
        </div>
      </div>

      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
