// CRACKODH
export const VEHICLE_STATUS_LABELS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
} as const;

export type VehicleStatusValue = keyof typeof VEHICLE_STATUS_LABELS;

export const VEHICLE_STATUS_OPTIONS = (
  Object.entries(VEHICLE_STATUS_LABELS) as [VehicleStatusValue, string][]
).map(([value, label]) => ({ value, label }));

export const VEHICLE_TYPE_OPTIONS = [
  "Van",
  "Truck",
  "Pickup",
  "Bus",
  "Motorcycle",
  "Trailer",
  "Other",
] as const;
