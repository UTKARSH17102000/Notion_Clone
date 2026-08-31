"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * `getById` throws for a missing or foreign document, so this also backs the
 * error boundary. Either way the user gets a way out instead of a bare string.
 */
export function DocumentNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-muted">
        <FileQuestion className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <h1 className="mt-6 text-xl font-semibold tracking-tight">
        This page is not available
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        It may have been deleted forever, or it belongs to another workspace.
        Pages you moved to the trash can still be restored.
      </p>
      <div className="mt-6 flex items-center gap-x-2">
        <Button asChild>
          <Link href="/documents">Back to your pages</Link>
        </Button>
      </div>
    </div>
  );
}
