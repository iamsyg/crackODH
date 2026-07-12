import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { authOptions } from "@/lib/auth";
import { mainNavigation } from "@/lib/navigation";
import { hasPermission } from "@/lib/rbac";

export default async function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const role = session.user.role;
  const navigation = mainNavigation.filter((item) => hasPermission(role, item.permission));

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar items={navigation} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          userName={session.user.name}
          userEmail={session.user.email}
          role={role}
        />
        <MobileNav items={navigation} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
