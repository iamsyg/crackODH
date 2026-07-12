// CRACKODH
import type { DefaultSession } from "next-auth";

import type { TransitOpsRole } from "@/types/roles";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: TransitOpsRole } & DefaultSession["user"];
  }

  interface User {
    role: TransitOpsRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: TransitOpsRole;
  }
}
