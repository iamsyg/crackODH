// CRACKODH
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { authOptions } from "@/lib/auth";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">TransitOps</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Sign in to manage your fleet operations.</p>
        <LoginForm />
      </section>
    </main>
  );
}
