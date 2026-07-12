import type { Permission } from "@/lib/rbac";

export type NavIconName =
  | "dashboard"
  | "vehicles"
  | "drivers"
  | "trips"
  | "maintenance"
  | "fuel"
  | "reports";

export type NavItem = {
  title: string;
  href: string;
  icon: NavIconName;
  permission: Permission;
  description: string;
};

export const mainNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    permission: "dashboard:view",
    description: "Fleet KPIs, filters, and operational overview.",
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: "vehicles",
    permission: "vehicles:read",
    description: "Vehicle registry, status, and lifecycle management.",
  },
  {
    title: "Drivers",
    href: "/drivers",
    icon: "drivers",
    permission: "drivers:read",
    description: "Driver profiles, licenses, and compliance.",
  },
  {
    title: "Trips",
    href: "/trips",
    icon: "trips",
    permission: "trips:read",
    description: "Trip creation, dispatch, completion, and cancellation.",
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: "maintenance",
    permission: "maintenance:read",
    description: "Maintenance logs and vehicle availability updates.",
  },
  {
    title: "Fuel & Expenses",
    href: "/fuel",
    icon: "fuel",
    permission: "fuel:read",
    description: "Fuel logs, operational expenses, and cost tracking.",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "reports",
    permission: "reports:view",
    description: "Analytics, efficiency metrics, and CSV export.",
  },
];
