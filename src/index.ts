import { Hono } from "hono";
import { news } from "./routes/news";

const app = new Hono();

app.route("/", news);

console.log("Server running on http://localhost:3000");
export default { fetch: app.fetch, port: 3000 };
