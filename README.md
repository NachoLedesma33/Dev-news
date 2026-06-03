# Dev-News

A clean, modern Hacker News reader built with **Next.js 15** (App Router) and **Tailwind CSS v4**.

## Stack

| Layer       | Technology                        |
| ----------- | --------------------------------- |
| Frontend    | Next.js 15, React 19, Tailwind v4 |
| Backend     | Next.js API Route (local)         |
|             | Python / FastAPI (Vercel)         |
| Package mgr | pnpm                              |
| Deployment  | Vercel (Hobby/Pro)                |

## Features

- Real HN API data via `https://hacker-news.firebaseio.com/v0`
- Card layout with hero story, search, and bookmark filtering
- Clickable cards link directly to the article URL
- Mock data fallback when API is unavailable (amber warning banner)
- 120s server cache on the API route

## Getting Started

```bash
pnpm install
pnpm run dev
```

The app runs standalone at `http://localhost:3000` — no Python backend needed.

## Architecture

**Local development:** `src/app/api/news/route.ts` fetches from the HN Firebase API and returns 30 items. The frontend calls `/api/news` and falls back to mock data (`src/lib/mock-data.ts`) if the request fails.

**Vercel production:** `vercel.json` rewrites `/api/(.*)` to a Python serverless function in `api/index.py` (FastAPI app). The Next.js API route is ignored in favor of the Python backend.

## Project Structure

```
src/
├── app/
│   ├── api/news/route.ts   # HN API handler (local dev)
│   ├── globals.css         # Tailwind entry + custom styles
│   ├── layout.tsx          # Root layout + metadata
│   └── page.tsx            # Home page (Hero + grid)
├── components/
│   ├── news-card.tsx       # Story card
│   └── ui/                 # shadcn-style primitives
├── hooks/
│   ├── use-news.ts         # Fetch + fallback logic
│   └── use-bookmarks.ts    # LocalStorage bookmarks
├── lib/
│   ├── mock-data.ts        # Offline fallback (30 items)
│   └── news-api.ts         # Typed API client
├── types/
│   └── index.ts            # Shared types
api/                        # Python/FastAPI (Vercel only)
├── hn_app/
│   ├── main.py
│   └── ...
└── index.py                # Vercel serverless entry
vercel.json                 # Rewrites /api/* → Python
next.config.ts              # Clean (no rewrites)
```

## Commands

| Command             | Action                        |
| ------------------- | ----------------------------- |
| `pnpm run dev`      | Start dev server              |
| `pnpm run build`    | Production build              |
| `pnpm run start`    | Start production server       |
| `pnpm run lint`     | Run ESLint                    |

## Deployment

The app auto-deploys on Vercel on every push to the main branch.

- **Hobby plan:** `maxDuration: 10s` — HN API may time out under load.
- **Pro plan:** Increase `maxDuration` to `30s` in `vercel.json` for reliability.
