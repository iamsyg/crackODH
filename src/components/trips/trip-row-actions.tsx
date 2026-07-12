"use client";

import Link from "next/link";
import { useTransition } from "react";

import { TripStatusBadge } from "@/components/trips/trip-status-badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { cancelTrip, deleteTrip, dispatchTrip } from "@/lib/trips/actions";
import type { SerializedTrip } from "@/lib/trips/serialize";
import { cn } from "@/lib/utils";

type TripRowActionsProps = {
  trip: SerializedTrip;
  canWrite: boolean;
};

export function TripRowActions({ trip, canWrite }: TripRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  if (!canWrite) return null;

  function runAction(action: () => Promise<unknown>, message: string) {
    if (!window.confirm(message)) return;
    startTransition(async () => {
      await action();
    });
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {trip.status === "DRAFT" ? (
        <>
          <Link
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            href={`/trips/${trip.id}/edit`}
          >
            Edit
          </Link>
          <Button
            disabled={isPending}
            onClick={() =>
              runAction(
                () => dispatchTrip(trip.id),
                `Dispatch ${trip.reference}? Vehicle and driver will be marked On Trip.`,
              )
            }
            size="sm"
            type="button"
          >
            Dispatch
          </Button>
          <Button
            disabled={isPending}
            onClick={() =>
              runAction(() => cancelTrip(trip.id), `Cancel draft ${trip.reference}?`)
            }
            size="sm"
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={() => runAction(() => deleteTrip(trip.id), `Delete draft ${trip.reference}?`)}
            size="sm"
            type="button"
            variant="destructive"
          >
            Delete
          </Button>
        </>
      ) : null}

      {trip.status === "DISPATCHED" ? (
        <>
          <Link
            className={cn(buttonVariants({ size: "sm" }))}
            href={`/trips/${trip.id}/complete`}
          >
            Complete
          </Link>
          <Button
            disabled={isPending}
            onClick={() =>
              runAction(
                () => cancelTrip(trip.id),
                `Cancel ${trip.reference}? Vehicle and driver will return to Available.`,
              )
            }
            size="sm"
            type="button"
            variant="destructive"
          >
            Cancel
          </Button>
        </>
      ) : null}

      {trip.status === "COMPLETED" || trip.status === "CANCELLED" ? (
        <TripStatusBadge status={trip.status} />
      ) : null}
    </div>
  );
}
