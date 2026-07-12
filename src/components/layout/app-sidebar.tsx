import type { NavItem } from "@/lib/navigation";

import { AppNav } from "./app-nav";

type AppSidebarProps = {
  items: NavItem[];
};

export function AppSidebar({ items }: AppSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <div className="border-b border-sidebar-border px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">TransitOps</p>
        <p className="mt-1 text-sm text-sidebar-foreground/70">Fleet operations</p>
      </div>
      <AppNav items={items} />
    </aside>
  );
}
