// CRACKODH
"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MaintenanceActionState } from "@/lib/maintenance/actions";
import type { SerializedMaintenanceLog } from "@/lib/maintenance/serialize";

type CloseMaintenanceFormProps = {
  action: (prevState: MaintenanceActionState, formData: FormData) => Promise<MaintenanceActionState>;
  log: SerializedMaintenanceLog;
};

function fieldError(fieldErrors: Record<string, string[]> | undefined, field: string) {
  const message = fieldErrors?.[field]?.[0];
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

export function CloseMaintenanceForm({ action, log }: CloseMaintenanceFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="grid gap-4 rounded-xl border border-border bg-card p-6">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <p className="text-sm text-muted-foreground">
        Close maintenance for <span className="font-medium text-foreground">{log.vehicleRegistration}</span>:{" "}
        {log.description}. The vehicle will return to Available.
      </p>

      <div className="grid gap-2">
        <Label htmlFor="cost">Final maintenance cost</Label>
        <Input
          defaultValue={log.cost}
          id="cost"
          min="0"
          name="cost"
          required
          step="0.01"
          type="number"
        />
        {fieldError(state.fieldErrors, "cost")}
      </div>

      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending ? "Closing..." : "Close maintenance"}
        </Button>
      </div>
    </form>
  );
}
