// CRACKODH
"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FuelActionState } from "@/lib/fuel/actions";
import { toDateTimeLocalValue } from "@/lib/fuel/schema";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

type TripOption = {
  id: string;
  reference: string;
  vehicleId: string;
};

type FuelFormProps = {
  action: (prevState: FuelActionState, formData: FormData) => Promise<FuelActionState>;
  vehicles: { id: string; label: string; meta: string }[];
  trips: TripOption[];
  defaultValues?: {
    vehicleId?: string;
    tripId?: string | null;
    liters?: number;
    cost?: number;
    odometer?: number | null;
    loggedAt?: Date;
  };
  submitLabel: string;
};

function fieldError(fieldErrors: Record<string, string[]> | undefined, field: string) {
  const message = fieldErrors?.[field]?.[0];
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

export function FuelForm({
  action,
  vehicles,
  trips,
  defaultValues,
  submitLabel,
}: FuelFormProps) {
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
          <Label htmlFor="liters">Liters</Label>
          <Input
            defaultValue={defaultValues?.liters}
            id="liters"
            min="0"
            name="liters"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "liters")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cost">Cost</Label>
          <Input
            defaultValue={defaultValues?.cost}
            id="cost"
            min="0"
            name="cost"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "cost")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="odometer">Odometer (optional)</Label>
          <Input
            defaultValue={defaultValues?.odometer ?? undefined}
            id="odometer"
            min="0"
            name="odometer"
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "odometer")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="loggedAt">Logged at</Label>
          <Input
            defaultValue={
              defaultValues?.loggedAt
                ? toDateTimeLocalValue(defaultValues.loggedAt)
                : toDateTimeLocalValue(new Date())
            }
            id="loggedAt"
            name="loggedAt"
            required
            type="datetime-local"
          />
          {fieldError(state.fieldErrors, "loggedAt")}
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
