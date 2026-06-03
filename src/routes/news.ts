import { Hono } from "hono";
import { cors } from "hono/cors";
import { getTopStories } from "../services/hn-service";

const news = new Hono();

news.use("/api/*", cors());

news.get("/api/news", async (c) => {
  const stories = await getTopStories(30);
  return c.json(stories);
});

export { news };
