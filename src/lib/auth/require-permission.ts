// CRACKODH
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { hasPermission, type Permission } from "@/lib/rbac";
import type { TransitOpsRole } from "@/types/roles";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, permission)) {
    throw new Error("You do not have permission to perform this action.");
  }
  return session;
}

export async function getAuthRole(): Promise<TransitOpsRole | null> {
  const session = await getServerSession(authOptions);
  return session?.user.role ?? null;
}
