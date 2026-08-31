"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Search, Trash2, Undo, X } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

/**
 * Nearly every archived note is called "Untitled", so the title alone cannot
 * tell two rows apart. Pull the first readable line out of the stored
 * BlockNote JSON and use it as a preview.
 */
function contentPreview(content?: string) {
  if (!content) return null;

  try {
    const blocks = JSON.parse(content);
    if (!Array.isArray(blocks)) return null;

    for (const block of blocks) {
      const nodes = Array.isArray(block?.content) ? block.content : [];
      const text = nodes
        .map((node: any) =>
          typeof node?.text === "string"
            ? node.text
            : (Array.isArray(node?.content) ? node.content : [])
                .map((child: any) => child?.text ?? "")
                .join("")
        )
        .join("")
        .trim();

      if (text) return text.length > 64 ? text.slice(0, 64) + "..." : text;
    }
  } catch {
    return null;
  }

  return null;
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function TrashBox() {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filteredDocuments = useMemo(
    () =>
      documents?.filter((document) =>
        document.title.toLowerCase().includes(search.toLowerCase())
      ),
    [documents, search]
  );

  const onClick = (documentId: string) => {
    router.push("/documents/" + documentId);
  };

  const onRestore = (event: React.MouseEvent, documentId: Id<"documents">) => {
    event.stopPropagation();

    toast.promise(restore({ id: documentId }), {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note",
    });
  };

  const onRemove = (documentId: Id<"documents">) => {
    toast.promise(remove({ id: documentId }), {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note",
    });

    if (params.documentId === documentId) router.push("/documents");
  };

  const onRemoveSelected = () => {
    const ids = Array.from(selected) as Id<"documents">[];

    toast.promise(Promise.all(ids.map((id) => remove({ id }))), {
      loading: "Deleting " + ids.length + " notes...",
      success: ids.length + " notes deleted.",
      error: "Failed to delete notes",
    });

    setSelected(new Set());
  };

  const toggleSelected = (event: React.MouseEvent, documentId: string) => {
    event.stopPropagation();
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(documentId)) next.delete(documentId);
      else next.add(documentId);
      return next;
    });
  };

  if (documents === undefined) {
    return (
      <div className="flex h-32 items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  const count = documents.length;

  return (
    <div className="flex max-h-[min(28rem,var(--radix-popover-content-available-height,60vh))] flex-col text-sm">
      <div className="flex items-baseline justify-between border-b px-3 py-2.5">
        <h2 className="font-medium text-foreground">Trash</h2>
        <p className="text-xs text-muted-foreground">
          {count === 0 ? "Empty" : count + (count === 1 ? " note" : " notes")}
        </p>
      </div>

      {count > 0 && (
        <div className="flex items-center gap-x-2 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            className="h-7 border-0 bg-muted px-2 focus-visible:ring-1"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by page title..."
            aria-label="Filter trashed notes by title"
          />
        </div>
      )}

      {selected.size > 0 && (
        <div className="flex items-center justify-between gap-x-2 border-y bg-destructive/10 px-3 py-2">
          <p className="text-xs font-medium text-destructive">
            {selected.size} selected
          </p>
          <div className="flex items-center gap-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setSelected(new Set())}
            >
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
            <ConfirmModal
              title={"Delete " + selected.size + " notes forever?"}
              description="These notes and everything nested inside them will be permanently removed. This cannot be undone."
              confirmLabel="Delete forever"
              onConfirm={onRemoveSelected}
            >
              <Button
                variant="destructive"
                size="sm"
                className="h-7 px-2 text-xs"
              >
                Delete forever
              </Button>
            </ConfirmModal>
          </div>
        </div>
      )}

      {/* Bounded and scrollable. The old list ran off the bottom of the viewport. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-1">
        {count === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-sm font-medium text-foreground">
              Nothing in the trash
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Notes you move to the trash land here and stay until you delete
              them.
            </p>
          </div>
        )}

        {count > 0 && filteredDocuments?.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No notes match that filter.
          </p>
        )}

        {filteredDocuments?.map((document: Doc<"documents">) => {
          const preview = contentPreview(document.content);
          const isSelected = selected.has(document._id);

          return (
            <div
              key={document._id}
              className={cn(
                "flex w-full items-start gap-x-2 rounded-sm px-2 py-1.5",
                isSelected ? "bg-primary/10" : "hover:bg-accent"
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => undefined}
                onClick={(event) => toggleSelected(event, document._id)}
                aria-label={"Select " + document.title}
                className="mt-1.5 h-3.5 w-3.5 shrink-0 accent-[hsl(var(--primary))]"
              />

              <button
                type="button"
                onClick={() => onClick(document._id)}
                className="min-w-0 flex-1 rounded-sm py-0.5 text-left"
              >
                <span className="block truncate font-medium text-foreground">
                  {document.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {preview ?? "No content"}
                  {" · "}
                  {dateFormat.format(new Date(document._creationTime))}
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-x-0.5">
                {/* Safe action: quiet weight. */}
                <button
                  type="button"
                  onClick={(event) => onRestore(event, document._id)}
                  aria-label={"Restore " + document.title}
                  className="rounded-sm p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Undo className="h-4 w-4" />
                </button>

                {/* Destructive action: destructive colour and a named confirm. */}
                <ConfirmModal
                  title={'Delete "' + document.title + '" forever?'}
                  description="This note and everything nested inside it will be permanently removed. This cannot be undone."
                  confirmLabel="Delete forever"
                  onConfirm={() => onRemove(document._id)}
                >
                  <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    aria-label={"Delete " + document.title + " forever"}
                    className="rounded-sm p-1.5 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </ConfirmModal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
