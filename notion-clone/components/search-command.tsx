"use client";

import { useEffect, useMemo, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { useShortcutKey } from "@/hooks/use-shortcut-key";
import { api } from "@/convex/_generated/api";

const RECENTS_KEY = "strata:recent-documents";
const RECENTS_LIMIT = 4;

function readRecents(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rememberRecentDocument(id: string) {
  try {
    const next = [id, ...readRecents().filter((entry) => entry !== id)].slice(
      0,
      RECENTS_LIMIT
    );
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // A private window or blocked storage just means no recents. Not fatal.
  }
}

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMounted] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const shortcutKey = useShortcutKey();

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) setRecentIds(readRecents());
  }, [isOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const { recents, rest } = useMemo(() => {
    if (!documents) return { recents: [], rest: [] };

    const byId = new Map(documents.map((document) => [document._id, document]));
    const recents = recentIds
      .map((id) => byId.get(id as any))
      .filter(Boolean) as typeof documents;
    const recentSet = new Set(recents.map((document) => document._id));

    return {
      recents,
      rest: documents.filter((document) => !recentSet.has(document._id)),
    };
  }, [documents, recentIds]);

  const onSelect = (id: string) => {
    rememberRecentDocument(id);
    router.push("/documents/" + id);
    onClose();
  };

  if (!isMounted) return null;

  const firstName = user?.firstName ?? "your";

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={"Search " + firstName + "'s Strata..."} />
      <CommandList>
        <CommandEmpty>
          <p className="text-sm font-medium text-foreground">No pages found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different title, or create a new page.
          </p>
        </CommandEmpty>

        {recents.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recents.map((document) => (
                <Row
                  key={document._id}
                  document={document}
                  onSelect={onSelect}
                />
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading={recents.length > 0 ? "All pages" : "Pages"}>
          {rest.map((document) => (
            <Row key={document._id} document={document} onSelect={onSelect} />
          ))}
        </CommandGroup>
      </CommandList>

      <div className="flex items-center justify-between gap-x-4 border-t px-3 py-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-x-1.5">
          <Hint>up</Hint>
          <Hint>down</Hint>
          to navigate
        </span>
        <span className="flex items-center gap-x-1.5">
          <Hint>enter</Hint>
          to open
          <Hint>esc</Hint>
          to close
        </span>
      </div>
    </CommandDialog>
  );
};

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 select-none items-center rounded-sm border bg-muted px-1.5 font-mono text-[10px] font-medium">
      {children}
    </kbd>
  );
}

function Row({
  document,
  onSelect,
}: {
  document: any;
  onSelect: (id: string) => void;
}) {
  return (
    <CommandItem
      value={document._id + "-" + document.title}
      title={document.title}
      onSelect={() => onSelect(document._id)}
    >
      {document.icon ? (
        <span className="mr-2 text-[1.125rem] leading-none">
          {document.icon}
        </span>
      ) : (
        <File className="mr-2 h-4 w-4 text-muted-foreground" />
      )}
      <span className="truncate">{document.title}</span>
    </CommandItem>
  );
}
