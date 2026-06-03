import type { NewsItem } from "@/types/news";

export async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch("/api/news");
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
