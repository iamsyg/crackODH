// CRACKODH
"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TripActionState } from "@/lib/trips/actions";
import type { SerializedTrip } from "@/lib/trips/serialize";

function fieldError(fieldErrors: Record<string, string[]> | undefined, field: string) {
  const message = fieldErrors?.[field]?.[0];
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

type CompleteTripFormProps = {
  action: (prevState: TripActionState, formData: FormData) => Promise<TripActionState>;
  trip: SerializedTrip;
};

export function CompleteTripForm({ action, trip }: CompleteTripFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid gap-6 rounded-xl border border-border bg-card p-6">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
        Completing <span className="font-medium text-foreground">{trip.reference}</span> for{" "}
        {trip.vehicleRegistration} driven by {trip.driverName}.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="actualDistance">Actual distance (km)</Label>
          <Input
            defaultValue={trip.plannedDistance}
            id="actualDistance"
            min="0"
            name="actualDistance"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "actualDistance")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="finalOdometer">Final odometer (km)</Label>
          <Input id="finalOdometer" min="0" name="finalOdometer" required step="0.01" type="number" />
          {fieldError(state.fieldErrors, "finalOdometer")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fuelLiters">Fuel consumed (liters)</Label>
          <Input id="fuelLiters" min="0" name="fuelLiters" required step="0.01" type="number" />
          {fieldError(state.fieldErrors, "fuelLiters")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fuelCost">Fuel cost</Label>
          <Input id="fuelCost" min="0" name="fuelCost" required step="0.01" type="number" />
          {fieldError(state.fieldErrors, "fuelCost")}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="revenue">Revenue (optional)</Label>
          <Input
            defaultValue={trip.revenue ?? undefined}
            id="revenue"
            min="0"
            name="revenue"
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "revenue")}
        </div>
      </div>

      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending ? "Completing..." : "Complete trip"}
        </Button>
      </div>
    </form>
  );
}
