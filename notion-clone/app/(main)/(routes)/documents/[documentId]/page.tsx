"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/Toolbar";
import { Cover } from "@/components/Cover";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentNotFound } from "@/components/document-not-found";
import { rememberRecentDocument } from "@/components/search-command";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/Editor"), {
        ssr: false,
        loading: () => <EditorSkeleton />,
      }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  useEffect(() => {
    if (document) rememberRecentDocument(params.documentId);
  }, [document, params.documentId]);

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 w-full max-w-doc px-[54px]">
          <Skeleton className="h-12 w-[55%]" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[86%]" />
            <Skeleton className="h-4 w-[64%]" />
            <Skeleton className="h-4 w-[78%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <DocumentNotFound />;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      {/*
        The old class was `md:max-w-3xl lg:md-max-w-4xl`. The second was not a
        real Tailwind class, so the wide breakpoint never applied. Both widths
        were past a readable measure anyway, so the column is now set from the
        --doc-column token and tuned to roughly 70 characters.
      */}
      <div className="mx-auto w-full max-w-doc">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="space-y-3 px-[54px] pt-4">
      <Skeleton className="h-4 w-[92%]" />
      <Skeleton className="h-4 w-[80%]" />
      <Skeleton className="h-4 w-[60%]" />
    </div>
  );
}
