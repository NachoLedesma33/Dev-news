"use client";

import { useState, useEffect } from "react";
import type { NewsItem } from "@/types/news";
import { fetchNews } from "@/services/news-api";
import { mockNews } from "@/lib/mock-data";

interface UseNewsResult {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
}

export function useNews(): UseNewsResult {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchNews();
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
          setItems(mockNews);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { items, loading, error };
}
