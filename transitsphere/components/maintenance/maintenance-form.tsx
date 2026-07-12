// CRACKODH
"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MaintenanceActionState } from "@/lib/maintenance/actions";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

type MaintenanceFormProps = {
  action: (prevState: MaintenanceActionState, formData: FormData) => Promise<MaintenanceActionState>;
  vehicles: { id: string; label: string; meta: string }[];
  defaultVehicleId?: string;
  defaultDescription?: string;
  defaultCost?: number;
  submitLabel: string;
  showVehicleSelect?: boolean;
};

function fieldError(fieldErrors: Record<string, string[]> | undefined, field: string) {
  const message = fieldErrors?.[field]?.[0];
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

export function MaintenanceForm({
  action,
  vehicles,
  defaultVehicleId,
  defaultDescription,
  defaultCost,
  submitLabel,
  showVehicleSelect = true,
}: MaintenanceFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid gap-6 rounded-xl border border-border bg-card p-6">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4">
        {showVehicleSelect ? (
          <div className="grid gap-2">
            <Label htmlFor="vehicleId">Vehicle</Label>
            <select
              className={selectClassName}
              defaultValue={defaultVehicleId ?? ""}
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
        ) : (
          defaultVehicleId ? <input name="vehicleId" type="hidden" value={defaultVehicleId} /> : null
        )}

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            defaultValue={defaultDescription}
            id="description"
            name="description"
            placeholder="Oil change, brake inspection..."
            required
          />
          {fieldError(state.fieldErrors, "description")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cost">Estimated cost</Label>
          <Input
            defaultValue={defaultCost ?? 0}
            id="cost"
            min="0"
            name="cost"
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "cost")}
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
