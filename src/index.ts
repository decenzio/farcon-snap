import { serve } from "@hono/node-server";
import app from "./app.js";

const port = parseInt(process.env.PORT ?? "3003");

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Who's In snap running at http://localhost:${info.port}`);
  console.log(`Test at: https://farcaster.xyz/~/developers/snaps`);
});
