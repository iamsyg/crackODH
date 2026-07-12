// CRACKODH
export const TRIP_STATUS_LABELS = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type TripStatusValue = keyof typeof TRIP_STATUS_LABELS;

export const TRIP_STATUS_OPTIONS = (
  Object.entries(TRIP_STATUS_LABELS) as [TripStatusValue, string][]
).map(([value, label]) => ({ value, label }));

export const ACTIVE_TRIP_STATUSES: TripStatusValue[] = ["DRAFT", "DISPATCHED"];
