import type { NewsItem } from "@/types/news";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";
const CACHE_TTL = 120_000;

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

let cache: { data: NewsItem[]; timestamp: number } | null = null;

function isExpired() {
  return !cache || Date.now() - cache.timestamp > CACHE_TTL;
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toISOString().replace("T", " ").replace(/\.\d{3}Z/, " UTC");
}

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isExpired()) {
    return Response.json(cache!.data);
  }

  try {
    const ids: number[] = await fetch(`${HN_BASE}/topstories.json`).then((r) => {
      if (!r.ok) throw new Error(`HN API ${r.status}`);
      return r.json();
    });

    const items: (HnItem | null)[] = await Promise.all(
      ids.slice(0, 30).map((id) =>
        fetch(`${HN_BASE}/item/${id}.json`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );

    const stories: NewsItem[] = items
      .filter((item): item is HnItem => item !== null && item.type === "story" && !!item.title)
      .sort((a, b) => (b.time ?? 0) - (a.time ?? 0))
      .map((item) => ({
        id: item.id,
        title: item.title!,
        points: item.score ?? 0,
        author: item.by ?? "unknown",
        published: formatTime(item.time ?? 0),
        url: item.url ?? null,
        text: item.text ?? null,
        comments: item.descendants ?? 0,
      }));

    cache = { data: stories, timestamp: Date.now() };
    return Response.json(stories);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
