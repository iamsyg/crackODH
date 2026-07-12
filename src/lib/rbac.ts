import type { TransitOpsRole } from "@/types/roles";

export const ROLE_LABELS: Record<TransitOpsRole, string> = {
  FLEET_MANAGER: "Fleet Manager",
  DRIVER: "Driver",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

export type Permission =
  | "dashboard:view"
  | "vehicles:read"
  | "vehicles:write"
  | "drivers:read"
  | "drivers:write"
  | "trips:read"
  | "trips:write"
  | "maintenance:read"
  | "maintenance:write"
  | "fuel:read"
  | "fuel:write"
  | "reports:view";

const ROLE_PERMISSIONS: Record<TransitOpsRole, Permission[]> = {
  FLEET_MANAGER: [
    "dashboard:view",
    "vehicles:read",
    "vehicles:write",
    "drivers:read",
    "trips:read",
    "trips:write",
    "maintenance:read",
    "maintenance:write",
    "fuel:read",
    "reports:view",
  ],
  DRIVER: ["dashboard:view", "vehicles:read", "drivers:read", "trips:read", "trips:write"],
  SAFETY_OFFICER: ["dashboard:view", "drivers:read", "drivers:write", "trips:read"],
  FINANCIAL_ANALYST: [
    "dashboard:view",
    "vehicles:read",
    "fuel:read",
    "fuel:write",
    "reports:view",
  ],
};

export function hasPermission(role: TransitOpsRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(role: TransitOpsRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}
