// CRACKODH
"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TripActionState } from "@/lib/trips/actions";
import type { DispatchOption, SerializedTrip } from "@/lib/trips/serialize";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

type TripFormProps = {
  action: (prevState: TripActionState, formData: FormData) => Promise<TripActionState>;
  trip?: SerializedTrip;
  vehicles: DispatchOption[];
  drivers: DispatchOption[];
  submitLabel: string;
};

function fieldError(fieldErrors: Record<string, string[]> | undefined, field: string) {
  const message = fieldErrors?.[field]?.[0];
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

export function TripForm({ action, trip, vehicles, drivers, submitLabel }: TripFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid gap-6 rounded-xl border border-border bg-card p-6">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="source">Source</Label>
          <Input defaultValue={trip?.source} id="source" name="source" required />
          {fieldError(state.fieldErrors, "source")}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="destination">Destination</Label>
          <Input defaultValue={trip?.destination} id="destination" name="destination" required />
          {fieldError(state.fieldErrors, "destination")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="vehicleId">Vehicle</Label>
          <select
            className={selectClassName}
            defaultValue={trip?.vehicleId ?? ""}
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
          <Label htmlFor="driverId">Driver</Label>
          <select
            className={selectClassName}
            defaultValue={trip?.driverId ?? ""}
            id="driverId"
            name="driverId"
            required
          >
            <option disabled value="">
              Select driver
            </option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.label} ({driver.meta})
              </option>
            ))}
          </select>
          {fieldError(state.fieldErrors, "driverId")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cargoWeight">Cargo weight (kg)</Label>
          <Input
            defaultValue={trip?.cargoWeight}
            id="cargoWeight"
            min="0"
            name="cargoWeight"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "cargoWeight")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="plannedDistance">Planned distance (km)</Label>
          <Input
            defaultValue={trip?.plannedDistance}
            id="plannedDistance"
            min="0"
            name="plannedDistance"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "plannedDistance")}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="revenue">Expected revenue (optional)</Label>
          <Input
            defaultValue={trip?.revenue ?? undefined}
            id="revenue"
            min="0"
            name="revenue"
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "revenue")}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button disabled={isPending} type="submit">
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
