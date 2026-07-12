import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { TripFilters } from "@/components/trips/trip-filters";
import { TripTable } from "@/components/trips/trip-table";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-permission";
import { hasPermission } from "@/lib/rbac";
import { listTrips } from "@/lib/trips/queries";
import { tripFilterSchema } from "@/lib/trips/schema";
import { cn } from "@/lib/utils";

const NOTICE_MESSAGES: Record<string, string> = {
  dispatched: "Trip dispatched. Vehicle and driver are now On Trip.",
  completed: "Trip completed. Vehicle and driver are available again and fuel was logged.",
  cancelled: "Trip cancelled.",
};

type TripsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const session = await requireAuth();
  const canWrite = hasPermission(session.user.role, "trips:write");

  const rawParams = await searchParams;
  const parsedFilters = tripFilterSchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : undefined,
    status: typeof rawParams.status === "string" ? rawParams.status : undefined,
  });

  const filters = parsedFilters.success ? parsedFilters.data : {};
  const trips = await listTrips(filters);

  const noticeKey = typeof rawParams.notice === "string" ? rawParams.notice : null;
  const notice = noticeKey ? NOTICE_MESSAGES[noticeKey] : null;

  return (
    <PageShell
      title="Trip management"
      description="Create, dispatch, complete, and cancel trips with automatic vehicle and driver status updates."
      actions={
        canWrite ? (
          <Link className={cn(buttonVariants())} href="/trips/new">
            Create trip
          </Link>
        ) : undefined
      }
    >
      {notice ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {notice}
        </p>
      ) : null}

      <TripFilters filters={filters} />
      <TripTable canWrite={canWrite} trips={trips} />
    </PageShell>
  );
}
