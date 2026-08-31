"use client";

import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, PlusCircle, Search, Trash } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@/hooks/use-search";
import { useShortcutKey } from "@/hooks/use-shortcut-key";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const DocumentsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const documents = useQuery(api.documents.getSearch);
  const search = useSearch();
  const shortcutKey = useShortcutKey();

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push("/documents/" + documentId)
    );

    toast.promise(promise, {
      loading: "Creating a new note....",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const firstName = user?.firstName ?? "there";

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-6 py-16">
      <header>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight">
          {firstName}&apos;s Strata
        </h1>
      </header>

      {documents === undefined ? (
        <div className="mt-10 space-y-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-3/4" />
        </div>
      ) : documents.length === 0 ? (
        <section className="mt-10 rounded-md border border-dashed p-8">
          <h2 className="text-base font-medium">Start with a page</h2>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Every note lives in a page. Pages nest as deep as you need, and any
            one of them can be published as a public link.
          </p>
          <Button onClick={onCreate} className="mt-5">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create a note
          </Button>
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Jump back in
          </h2>
          <ul className="mt-2 divide-y border-y">
            {documents.slice(0, 6).map((document: any) => (
              <li key={document._id}>
                <button
                  type="button"
                  onClick={() => router.push("/documents/" + document._id)}
                  className="flex w-full items-center gap-x-3 px-1 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  {document.icon ? (
                    <span className="text-lg leading-none">
                      {document.icon}
                    </span>
                  ) : (
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {document.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {dateFormat.format(new Date(document._creationTime))}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button onClick={onCreate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a note
            </Button>
            <Button variant="outline" onClick={search.onOpen}>
              <Search className="mr-2 h-4 w-4" />
              Search
              <kbd className="ml-2 inline-flex h-5 select-none items-center rounded-sm border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {shortcutKey}K
              </kbd>
            </Button>
          </div>
        </section>
      )}

      <p className="mt-10 flex items-center gap-x-2 text-xs text-muted-foreground">
        <Trash className="h-3.5 w-3.5" aria-hidden />
        Deleted pages wait in the Trash until you remove them for good.
      </p>
    </div>
  );
};

export default DocumentsPage;
