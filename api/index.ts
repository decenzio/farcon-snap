import app from "../src/app.js";
import { handle } from "hono/vercel";

export const config = { runtime: "nodejs" };

export default handle(app);
