import asyncio
import json
import threading
from datetime import datetime, timezone

import httpx
from httpx import HTTPError

BASE_URL = "https://hacker-news.firebaseio.com/v0"
STORY_CACHE: dict[int, dict] = {}
CACHE_TTL_SECONDS = 120
_cache_timestamp: float = 0.0
_cache_lock = threading.Lock()
CONCURRENCY_LIMIT = 10


def _clear_expired_cache() -> None:
    global _cache_timestamp
    with _cache_lock:
        now = datetime.now(tz=timezone.utc).timestamp()
        if now - _cache_timestamp > CACHE_TTL_SECONDS:
            STORY_CACHE.clear()
            _cache_timestamp = now


async def fetch_top_story_ids(client: httpx.AsyncClient) -> list[int]:
    resp = await client.get(f"{BASE_URL}/topstories.json")
    resp.raise_for_status()
    try:
        return resp.json()
    except (json.JSONDecodeError, ValueError):
        return []


async def fetch_story(client: httpx.AsyncClient, story_id: int, sem: asyncio.Semaphore) -> dict | None:
    async with sem:
        if story_id in STORY_CACHE:
            return STORY_CACHE[story_id]

        try:
            resp = await client.get(f"{BASE_URL}/item/{story_id}.json")
            resp.raise_for_status()
            try:
                data: dict | None = resp.json()
            except (json.JSONDecodeError, ValueError):
                return None
            if data and data.get("type") == "story" and data.get("title"):
                STORY_CACHE[story_id] = data
                return data
        except HTTPError:
            pass
        return None


async def get_top_stories(limit: int = 30) -> list[dict]:
    _clear_expired_cache()

    sem = asyncio.Semaphore(CONCURRENCY_LIMIT)

    async with httpx.AsyncClient() as client:
        ids = await fetch_top_story_ids(client)

        tasks = [fetch_story(client, sid, sem) for sid in ids[:limit]]
        results = await asyncio.gather(*tasks)

    items = [r for r in results if r is not None]

    items.sort(key=lambda x: x.get("time", 0), reverse=True)
    return items
