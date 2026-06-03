from fastapi import APIRouter

from api.schemas.news import NewsItem
from api.services.hn_service import get_top_stories

router = APIRouter(prefix="/api", tags=["news"])


@router.get("/news", response_model=list[NewsItem])
async def list_news():
    raw = await get_top_stories(limit=30)
    return [
        NewsItem(
            id=item["id"],
            title=item["title"],
            points=item.get("score", 0),
            author=item.get("by", "unknown"),
            published=item.get("time", 0),
            url=item.get("url"),
            text=item.get("text"),
            comments=item.get("descendants", 0),
        )
        for item in raw
    ]
