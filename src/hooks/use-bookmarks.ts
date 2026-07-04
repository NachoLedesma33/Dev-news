"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "devnews-bookmarks";

function loadBookmarks(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set<number>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveBookmarks(ids: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    console.warn("Failed to save bookmarks to localStorage");
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<number>>(loadBookmarks);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveBookmarks(next);
      return next;
    });
  }, []);

  return { bookmarks, toggleBookmark };
}
