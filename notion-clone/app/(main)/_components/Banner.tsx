"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface BannerProps {
  documentId: Id<"documents">;
}

export function Banner({ documentId }: BannerProps) {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    toast.promise(remove({ id: documentId }), {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });

    router.push("/documents");
  };

  const onRestore = () => {
    toast.promise(restore({ id: documentId }), {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div
      role="status"
      className="flex w-full items-center justify-center gap-x-3 border-b border-destructive/30 bg-destructive/10 p-2 text-center text-sm text-destructive"
    >
      <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
      <p className="font-medium">This page is in the Trash.</p>

      {/* Safe action reads as the default; the irreversible one is destructive. */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRestore}
        className="h-auto border-destructive/40 bg-background p-1 px-2 font-normal text-foreground hover:bg-accent"
      >
        Restore page
      </Button>

      <ConfirmModal
        title="Delete this page forever?"
        description="This page and everything nested inside it will be permanently removed. This cannot be undone."
        confirmLabel="Delete forever"
        onConfirm={onRemove}
      >
        <Button
          variant="destructive"
          size="sm"
          className="h-auto p-1 px-2 font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
}
