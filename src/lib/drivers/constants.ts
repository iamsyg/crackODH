// CRACKODH
export const DRIVER_STATUS_LABELS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
} as const;

export type DriverStatusValue = keyof typeof DRIVER_STATUS_LABELS;

export const DRIVER_STATUS_OPTIONS = (
  Object.entries(DRIVER_STATUS_LABELS) as [DriverStatusValue, string][]
).map(([value, label]) => ({ value, label }));

export const LICENSE_CATEGORY_OPTIONS = ["A", "B", "C", "D", "E"] as const;

export function formatLicenseExpiry(dateIso: string) {
  return new Date(dateIso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function toDateInputValue(dateIso: string) {
  return dateIso.slice(0, 10);
}

export function getLicenseCompliance(dateIso: string) {
  const expiry = new Date(dateIso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return { label: "Expired", variant: "danger" as const };
  if (daysUntilExpiry <= 30) return { label: "Expiring soon", variant: "warning" as const };
  return { label: "Valid", variant: "success" as const };
}

export function isLicenseEligible(dateIso: string, status: DriverStatusValue) {
  const compliance = getLicenseCompliance(dateIso);
  return compliance.label === "Valid" && status !== "SUSPENDED";
}
