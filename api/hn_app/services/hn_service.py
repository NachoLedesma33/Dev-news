import asyncio
from datetime import datetime, timezone

import httpx
from httpx import HTTPError

BASE_URL = "https://hacker-news.firebaseio.com/v0"
STORY_CACHE: dict[int, dict] = {}
CACHE_TTL_SECONDS = 120
_cache_timestamp: float = 0.0


def _clear_expired_cache() -> None:
    global _cache_timestamp
    now = datetime.now(tz=timezone.utc).timestamp()
    if now - _cache_timestamp > CACHE_TTL_SECONDS:
        STORY_CACHE.clear()
        _cache_timestamp = now


async def fetch_top_story_ids(client: httpx.AsyncClient) -> list[int]:
    resp = await client.get(f"{BASE_URL}/topstories.json")
    resp.raise_for_status()
    return resp.json()


async def fetch_story(client: httpx.AsyncClient, story_id: int) -> dict | None:
    if story_id in STORY_CACHE:
        return STORY_CACHE[story_id]

    try:
        resp = await client.get(f"{BASE_URL}/item/{story_id}.json")
        resp.raise_for_status()
        data: dict | None = resp.json()
        if data and data.get("type") == "story" and data.get("title"):
            STORY_CACHE[story_id] = data
            return data
    except HTTPError:
        pass
    return None


async def get_top_stories(limit: int = 30) -> list[dict]:
    _clear_expired_cache()

    async with httpx.AsyncClient() as client:
        ids = await fetch_top_story_ids(client)

        tasks = [fetch_story(client, sid) for sid in ids[:limit]]
        results = await asyncio.gather(*tasks)

    items = [r for r in results if r is not None]

    items.sort(key=lambda x: x.get("time", 0), reverse=True)
    return items
