"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VehicleActionState } from "@/lib/vehicles/actions";
import { VEHICLE_STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS } from "@/lib/vehicles/constants";
import type { SerializedVehicle } from "@/lib/vehicles/serialize";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

type VehicleFormProps = {
  action: (prevState: VehicleActionState, formData: FormData) => Promise<VehicleActionState>;
  vehicle?: SerializedVehicle;
  submitLabel: string;
};

function fieldError(fieldErrors: Record<string, string[]> | undefined, field: string) {
  const message = fieldErrors?.[field]?.[0];
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

export function VehicleForm({ action, vehicle, submitLabel }: VehicleFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid gap-6 rounded-xl border border-border bg-card p-6">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="registrationNumber">Registration number</Label>
          <Input
            defaultValue={vehicle?.registrationNumber}
            id="registrationNumber"
            name="registrationNumber"
            placeholder="VAN-05"
            required
          />
          {fieldError(state.fieldErrors, "registrationNumber")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Vehicle name</Label>
          <Input defaultValue={vehicle?.name} id="name" name="name" placeholder="Van-05" required />
          {fieldError(state.fieldErrors, "name")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="model">Model</Label>
          <Input defaultValue={vehicle?.model ?? ""} id="model" name="model" placeholder="Optional" />
          {fieldError(state.fieldErrors, "model")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <select
            className={selectClassName}
            defaultValue={vehicle?.type ?? "Van"}
            id="type"
            name="type"
            required
          >
            {VEHICLE_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldError(state.fieldErrors, "type")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="maxLoadCapacity">Max load capacity (kg)</Label>
          <Input
            defaultValue={vehicle?.maxLoadCapacity}
            id="maxLoadCapacity"
            min="0"
            name="maxLoadCapacity"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "maxLoadCapacity")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="odometer">Odometer (km)</Label>
          <Input
            defaultValue={vehicle?.odometer}
            id="odometer"
            min="0"
            name="odometer"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "odometer")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="acquisitionCost">Acquisition cost</Label>
          <Input
            defaultValue={vehicle?.acquisitionCost}
            id="acquisitionCost"
            min="0"
            name="acquisitionCost"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "acquisitionCost")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            className={selectClassName}
            defaultValue={vehicle?.status ?? "AVAILABLE"}
            id="status"
            name="status"
            required
          >
            {VEHICLE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError(state.fieldErrors, "status")}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="region">Region</Label>
          <Input defaultValue={vehicle?.region ?? ""} id="region" name="region" placeholder="Optional" />
          {fieldError(state.fieldErrors, "region")}
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
