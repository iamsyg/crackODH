// CRACKODH
"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);
    if (result?.error) {
      setError("Your email or password is incorrect.");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Work email
        <input autoComplete="email" className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" name="email" placeholder="you@company.com" required type="email" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Password
        <input autoComplete="current-password" className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" name="password" required type="password" />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="h-11 w-full rounded-lg bg-blue-600 px-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
