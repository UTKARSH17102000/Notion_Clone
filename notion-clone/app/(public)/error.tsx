"use client";

import Link from "next/link";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * `documents.getById` throws rather than returning null when a note is missing,
 * unpublished, or owned by someone else. For a public visitor that is not an
 * application failure, it is the normal "this link is not live" case, so the
 * public route group catches it here instead of showing a generic error.
 */
export default function PreviewError() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-muted">
        <Globe className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <h1 className="mt-6 font-serif text-2xl font-semibold tracking-tight">
        This note is not published
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The link may have expired, or the author may have unpublished the page.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Go to Strata</Link>
      </Button>
    </div>
  );
}
