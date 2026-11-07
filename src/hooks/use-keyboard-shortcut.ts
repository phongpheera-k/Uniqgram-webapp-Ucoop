"use client";

import { useEffect } from "react";

/** Ctrl/Cmd + key global shortcut. */
export function useModShortcut(key: string, handler: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === key.toLowerCase()) handler(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, handler]);
}
