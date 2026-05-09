import { serve } from "@hono/node-server";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3003);

serve({ fetch: app.fetch, port }, (info) => {
  const host = info.address === "::" ? "localhost" : info.address;
  console.log(`farcon-snap-poll listening on http://${host}:${info.port}`);
  console.log(`Create a poll: http://${host}:${info.port}/create`);
});
