"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
      </div>

      <h1 className="mt-6 font-serif text-2xl font-semibold tracking-tight">
        Something broke on our side
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Your pages are safe. This screen means Strata failed to render, not that
        anything was lost.
      </p>

      {/* Recovery in place, rather than only a link away from the failure. */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/documents">Back to your pages</Link>
        </Button>
      </div>

      {error.digest && (
        <p className="mt-8 font-mono text-[11px] text-muted-foreground">
          Reference {error.digest}
        </p>
      )}
    </div>
  );
}
