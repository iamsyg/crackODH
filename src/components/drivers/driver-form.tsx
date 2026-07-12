// CRACKODH
"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DriverActionState } from "@/lib/drivers/actions";
import {
  DRIVER_STATUS_OPTIONS,
  LICENSE_CATEGORY_OPTIONS,
  toDateInputValue,
} from "@/lib/drivers/constants";
import type { SerializedDriver } from "@/lib/drivers/serialize";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

type DriverFormProps = {
  action: (prevState: DriverActionState, formData: FormData) => Promise<DriverActionState>;
  driver?: SerializedDriver;
  submitLabel: string;
};

function fieldError(fieldErrors: Record<string, string[]> | undefined, field: string) {
  const message = fieldErrors?.[field]?.[0];
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

export function DriverForm({ action, driver, submitLabel }: DriverFormProps) {
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
          <Label htmlFor="name">Full name</Label>
          <Input defaultValue={driver?.name} id="name" name="name" placeholder="Alex" required />
          {fieldError(state.fieldErrors, "name")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="licenseNumber">License number</Label>
          <Input
            defaultValue={driver?.licenseNumber}
            id="licenseNumber"
            name="licenseNumber"
            placeholder="DL-ALEX-2024"
            required
          />
          {fieldError(state.fieldErrors, "licenseNumber")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="licenseCategory">License category</Label>
          <select
            className={selectClassName}
            defaultValue={driver?.licenseCategory ?? "B"}
            id="licenseCategory"
            name="licenseCategory"
            required
          >
            {LICENSE_CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {fieldError(state.fieldErrors, "licenseCategory")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="licenseExpiryDate">License expiry date</Label>
          <Input
            defaultValue={driver ? toDateInputValue(driver.licenseExpiryDate) : undefined}
            id="licenseExpiryDate"
            name="licenseExpiryDate"
            required
            type="date"
          />
          {fieldError(state.fieldErrors, "licenseExpiryDate")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contactNumber">Contact number</Label>
          <Input
            defaultValue={driver?.contactNumber}
            id="contactNumber"
            name="contactNumber"
            placeholder="+1 555 0100"
            required
          />
          {fieldError(state.fieldErrors, "contactNumber")}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="safetyScore">Safety score</Label>
          <Input
            defaultValue={driver?.safetyScore ?? 100}
            id="safetyScore"
            max="100"
            min="0"
            name="safetyScore"
            required
            step="0.01"
            type="number"
          />
          {fieldError(state.fieldErrors, "safetyScore")}
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="status">Status</Label>
          <select
            className={selectClassName}
            defaultValue={driver?.status ?? "AVAILABLE"}
            id="status"
            name="status"
            required
          >
            {DRIVER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError(state.fieldErrors, "status")}
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
