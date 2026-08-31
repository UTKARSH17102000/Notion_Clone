"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "motion/react";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useShortcutKey } from "@/hooks/use-shortcut-key";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}

export function Item({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const shortcutKey = useShortcutKey();

  const onArchive = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id }).then(() => router.push("/documents"));

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note",
    });
  };

  const handleExpand = (event: React.MouseEvent) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreate = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) onExpand?.();
        router.push(`/documents/${documentId}`);
      }
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note",
    });
  };

  // Left and right arrows expand and collapse the row, matching how tree
  // widgets behave everywhere else.
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!id || !onExpand) return;
    if (event.key === "ArrowRight" && !expanded) {
      event.preventDefault();
      onExpand();
    }
    if (event.key === "ArrowLeft" && expanded) {
      event.preventDefault();
      onExpand();
    }
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      className={cn(
        "group relative flex min-h-[27px] w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-foreground"
      )}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
    >
      {/* The accent marker is the only chroma in the rail. */}
      {active && (
        <motion.span
          layoutId="tree-active-marker"
          aria-hidden
          className="absolute inset-y-0 left-0 w-[2px] bg-vivid"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}

      {!!id && (
        <button
          type="button"
          onClick={handleExpand}
          aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
          aria-expanded={!!expanded}
          className="mr-1 rounded-sm text-muted-foreground/60 hover:bg-accent-foreground/10 hover:text-foreground"
        >
          <ChevronIcon className="h-4 w-4 shrink-0" />
        </button>
      )}

      <button
        type="button"
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-current={active ? "page" : undefined}
        className="flex min-w-0 flex-1 items-center gap-x-2 rounded-sm text-left"
      >
        {documentIcon ? (
          <span className="shrink-0 text-[18px] leading-none">
            {documentIcon}
          </span>
        ) : (
          <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{label}</span>
      </button>

      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded-sm border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          {shortcutKey}K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                aria-label={`More actions for ${label}`}
                /* Hidden until hover, but always reachable by keyboard. */
                className="rounded-sm p-0.5 text-muted-foreground opacity-0 hover:bg-accent-foreground/10 hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="start" side="right">
              <DropdownMenuItem
                onClick={onArchive}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Move to Trash
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <p className="p-2 text-xs text-muted-foreground">
                Last edited by: {user?.fullName}
              </p>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={onCreate}
            aria-label={`Add a page inside ${label}`}
            className="rounded-sm p-0.5 text-muted-foreground opacity-0 hover:bg-accent-foreground/10 hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className="flex gap-x-2 py-[3px]"
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
