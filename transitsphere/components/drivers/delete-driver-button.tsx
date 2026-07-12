// CRACKODH
"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { deleteDriver } from "@/lib/drivers/actions";

type DeleteDriverButtonProps = {
  driverId: string;
  driverName: string;
};

export function DeleteDriverButton({ driverId, driverName }: DeleteDriverButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          `Delete ${driverName}? Drivers with trip history will be marked Off Duty instead.`,
        );
        if (!confirmed) return;

        startTransition(async () => {
          await deleteDriver(driverId);
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
