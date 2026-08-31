import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-full min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
        There is no page here
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The link may be mistyped, or the page may have been unpublished by its
        author.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href="/">Go to Strata</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/documents">Your pages</Link>
        </Button>
      </div>
    </div>
  );
}
