from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from hn_app.routers.news import router as news_router

app = FastAPI(title="Dev-news-app API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news_router)
