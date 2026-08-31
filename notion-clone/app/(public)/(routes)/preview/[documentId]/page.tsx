"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { ArrowUpRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/Toolbar";
import { Cover } from "@/components/Cover";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Logo } from "@/app/(marketing)/_components/Logo";

interface PreviewPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

/**
 * The public, read-only render of a published note.
 *
 * `documents.getById` already returns published, non-archived documents to
 * anonymous callers, so this page needs no auth and no backend change. The
 * Publish popover has always pointed here; before this route existed every
 * link it produced was a 404.
 */
export default function PreviewPage({ params }: PreviewPageProps) {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  // Client route, so the tab title is set here rather than by generateMetadata.
  useEffect(() => {
    if (document?.title) window.document.title = document.title + " | Strata";
  }, [document?.title]);

  if (document === undefined) {
    return (
      <div className="mx-auto mt-16 w-full max-w-doc px-[54px]">
        <Skeleton className="h-12 w-[55%]" />
        <div className="mt-8 space-y-3">
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[84%]" />
          <Skeleton className="h-4 w-[62%]" />
        </div>
      </div>
    );
  }

  if (document === null) {
    return <PreviewUnavailable />;
  }

  return (
    <div className="min-h-full pb-40">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <Link href="/" aria-label="Strata home">
          <Logo />
        </Link>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            Make your own
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </header>

      <Cover preview url={document.coverImage} />

      <article className="mx-auto w-full max-w-doc">
        <Toolbar preview initialData={document} />
        <Editor
          editable={false}
          onChange={() => undefined}
          initialContent={document.content}
        />
      </article>
    </div>
  );
}

function PreviewUnavailable() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">
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
