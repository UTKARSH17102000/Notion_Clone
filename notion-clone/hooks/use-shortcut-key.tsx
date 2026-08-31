"use client";

import { useEffect, useState } from "react";

/**
 * The command palette binds to both Meta and Control. Show the modifier the
 * viewer's platform actually uses instead of hardcoding the Mac glyph.
 */
export function useShortcutKey() {
  const [key, setKey] = useState("Ctrl ");

  useEffect(() => {
    const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    setKey(isApple ? "⌘" : "Ctrl ");
  }, []);

  return key;
}
