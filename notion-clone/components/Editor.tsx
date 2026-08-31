"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/ariakit";

import "@blocknote/core/style.css";
import "@blocknote/ariakit/style.css";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

/**
 * Parses the stored Convex `content` string into BlockNote's document format.
 * BlockNote rejects an empty array, so anything falsy or empty becomes
 * `undefined` and lets the editor start with its own default block.
 */
function parseInitialContent(initialContent?: string) {
  if (!initialContent) return undefined;

  try {
    const parsed = JSON.parse(initialContent) as PartialBlock[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

const AUTOSAVE_DELAY_MS = 800;

export default function Editor({
  onChange,
  initialContent,
  editable = true,
}: EditorProps) {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  // Keep the latest onChange without making it an editor dependency, so the
  // editor instance is created exactly once for the life of the component.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const pendingRef = useRef<string>();

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (pendingRef.current !== undefined) {
      onChangeRef.current(pendingRef.current);
      pendingRef.current = undefined;
    }
  }, []);

  // Autosave writes the whole document, so an undebounced save costs a full
  // serialise-and-upload per keystroke. Trailing debounce, flushed on blur and
  // unmount so nothing is lost.
  const scheduleSave = useCallback(
    (content: string) => {
      pendingRef.current = content;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(flush, AUTOSAVE_DELAY_MS);
    },
    [flush]
  );

  useEffect(() => flush, [flush]);

  const handleUpload = useCallback(
    async (file: File) => {
      const response = await edgestore.publicFiles.upload({ file });
      return response.url;
    },
    [edgestore]
  );

  const parsedContent = useMemo(
    () => parseInitialContent(initialContent),
    // Only the content the editor was mounted with matters. Later autosaves
    // come back through Convex and must not re-seed the editor mid-edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const editor = useCreateBlockNote(
    {
      initialContent: parsedContent,
      uploadFile: handleUpload,
    },
    []
  );

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={() => scheduleSave(JSON.stringify(editor.document, null, 2))}
      onBlur={flush}
    />
  );
}
