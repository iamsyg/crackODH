// CRACKODH
"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlatformErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PlatformError({ error, reset }: PlatformErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isPermissionDenied =
    error.name === "PermissionDeniedError" ||
    error.message.toLowerCase().includes("permission");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold">
        {isPermissionDenied ? "Access denied" : "Something went wrong"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {isPermissionDenied
          ? "You do not have permission to view this page. Contact your fleet manager if you need access."
          : "An unexpected error occurred while loading this page."}
      </p>
      <div className="flex gap-2">
        {!isPermissionDenied ? (
          <Button onClick={reset} type="button" variant="outline">
            Try again
          </Button>
        ) : null}
        <Link className={cn(buttonVariants())} href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
