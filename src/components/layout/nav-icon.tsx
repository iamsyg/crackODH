import {
  BarChart3,
  Droplets,
  LayoutDashboard,
  Route,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { NavIconName } from "@/lib/navigation";

const navIcons: Record<NavIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  vehicles: Truck,
  drivers: Users,
  trips: Route,
  maintenance: Wrench,
  fuel: Droplets,
  reports: BarChart3,
};

export function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  const Icon = navIcons[name];
  return <Icon className={className} />;
}
