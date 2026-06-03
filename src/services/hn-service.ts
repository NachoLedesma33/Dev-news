import type { NewsItem } from "../schemas/news";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";
const CACHE_TTL_MS = 120_000;

interface HnItem {
  id: number;
  title?: string;
  score?: number;
  by?: string;
  time?: number;
  url?: string;
  text?: string;
  descendants?: number;
  type?: string;
}

const cache = new Map<number, HnItem>();
let cacheTimestamp = 0;

function isCacheExpired(): boolean {
  return Date.now() - cacheTimestamp > CACHE_TTL_MS;
}

function clearExpiredCache(): void {
  if (isCacheExpired()) {
    cache.clear();
    cacheTimestamp = Date.now();
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching ${url}`);
  return resp.json() as Promise<T>;
}

async function fetchStory(id: number): Promise<HnItem | null> {
  const cached = cache.get(id);
  if (cached) return cached;

  try {
    const item = await fetchJson<HnItem>(`${BASE_URL}/item/${id}.json`);
    if (item && item.type === "story" && item.title) {
      cache.set(id, item);
      return item;
    }
  } catch {
    /* skip failed items */
  }
  return null;
}

export async function getTopStories(limit = 30): Promise<NewsItem[]> {
  clearExpiredCache();

  const ids = await fetchJson<number[]>(`${BASE_URL}/topstories.json`);
  const items = await Promise.all(ids.slice(0, limit).map(fetchStory));

  const valid = items.filter(Boolean) as HnItem[];
  valid.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return valid.map((item) => ({
    id: item.id,
    title: item.title ?? "Untitled",
    points: item.score ?? 0,
    author: item.by ?? "unknown",
    published: new Date((item.time ?? 0) * 1000).toISOString().replace("T", " ").replace(/\.\d{3}Z/, " UTC"),
    url: item.url ?? null,
    text: item.text ?? null,
    comments: item.descendants ?? 0,
  }));
}
