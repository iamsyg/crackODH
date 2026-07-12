// CRACKODH
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { hasPermission, type Permission } from "@/lib/rbac";
import type { TransitOpsRole } from "@/types/roles";

export class PermissionDeniedError extends Error {
  readonly name = "PermissionDeniedError";

  constructor(message = "You do not have permission to perform this action.") {
    super(message);
  }
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, permission)) {
    throw new PermissionDeniedError();
  }
  return session;
}

export async function requireActionPermission(permission: Permission) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, permission)) {
    return {
      ok: false as const,
      error: "You do not have permission to perform this action.",
    };
  }

  return { ok: true as const, session };
}

export async function getAuthRole(): Promise<TransitOpsRole | null> {
  const session = await getServerSession(authOptions);
  return session?.user.role ?? null;
}
