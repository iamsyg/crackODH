// CRACKODH
import { ROLE_LABELS } from "@/lib/rbac";
import type { TransitOpsRole } from "@/types/roles";

import { SignOutButton } from "./sign-out-button";

type AppHeaderProps = {
  userName?: string | null;
  userEmail?: string | null;
  role?: TransitOpsRole;
};

export function AppHeader({ userName, userEmail, role }: AppHeaderProps) {
  const displayName = userName ?? userEmail ?? "User";
  const roleLabel = role ? ROLE_LABELS[role] : "Team member";

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
        <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
      </div>
      <SignOutButton />
    </header>
  );
}
