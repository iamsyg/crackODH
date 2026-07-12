// CRACKODH
"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { deleteFuelLog } from "@/lib/fuel/actions";

type DeleteFuelLogButtonProps = {
  fuelLogId: string;
  label: string;
};

export function DeleteFuelLogButton({ fuelLogId, label }: DeleteFuelLogButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(`Delete fuel log for ${label}?`);
        if (!confirmed) return;

        startTransition(async () => {
          await deleteFuelLog(fuelLogId);
        });
      }}
      size="sm"
      type="button"
      variant="destructive"
    >
      {isPending ? "Removing..." : "Delete"}
    </Button>
  );
}
