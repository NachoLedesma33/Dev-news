from datetime import datetime, timezone

from pydantic import BaseModel, field_validator


class NewsItem(BaseModel):
    id: int
    title: str
    points: int
    author: str
    published: str
    url: str | None = None
    text: str | None = None
    comments: int

    @field_validator("published", mode="before")
    @classmethod
    def _convert_timestamp(cls, v: int) -> str:
        return datetime.fromtimestamp(v, tz=timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
