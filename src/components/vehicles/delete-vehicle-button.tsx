"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { deleteVehicle } from "@/lib/vehicles/actions";

type DeleteVehicleButtonProps = {
  vehicleId: string;
  vehicleName: string;
};

export function DeleteVehicleButton({ vehicleId, vehicleName }: DeleteVehicleButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          `Delete ${vehicleName}? Vehicles with trip or maintenance history will be marked Retired instead.`,
        );
        if (!confirmed) return;

        startTransition(async () => {
          await deleteVehicle(vehicleId);
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
