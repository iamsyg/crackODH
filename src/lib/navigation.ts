import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Droplets,
  LayoutDashboard,
  Route,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

import type { Permission } from "@/lib/rbac";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
  description: string;
};

export const mainNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard:view",
    description: "Fleet KPIs, filters, and operational overview.",
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: Truck,
    permission: "vehicles:read",
    description: "Vehicle registry, status, and lifecycle management.",
  },
  {
    title: "Drivers",
    href: "/drivers",
    icon: Users,
    permission: "drivers:read",
    description: "Driver profiles, licenses, and compliance.",
  },
  {
    title: "Trips",
    href: "/trips",
    icon: Route,
    permission: "trips:read",
    description: "Trip creation, dispatch, completion, and cancellation.",
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    permission: "maintenance:read",
    description: "Maintenance logs and vehicle availability updates.",
  },
  {
    title: "Fuel & Expenses",
    href: "/fuel",
    icon: Droplets,
    permission: "fuel:read",
    description: "Fuel logs, operational expenses, and cost tracking.",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    permission: "reports:view",
    description: "Analytics, efficiency metrics, and CSV export.",
  },
];
