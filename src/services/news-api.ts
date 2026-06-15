import type { NewsItem } from "@/types/news";

const TIMEOUT_MS = 15_000;

export async function fetchNews(): Promise<NewsItem[]> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("/api/news", { signal: controller.signal });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(id);
  }
}
