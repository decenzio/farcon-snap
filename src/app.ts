import { Hono } from "hono";
import { registerSnapHandler } from "@farcaster/snap-hono";
import type { Event, SnapHandlerResult } from "./types.js";
import { getBaseUrl, generateId } from "./helpers.js";
import { createPage } from "./pages/create.js";
import { eventPage } from "./pages/event.js";
import { nominatePage } from "./pages/nominate.js";
import { createdPage } from "./pages/created.js";

const mem = new Map<string, unknown>();
const store = {
  get: async (key: string) => mem.get(key) ?? null,
  set: async (key: string, value: unknown) => { mem.set(key, value); },
};

const app = new Hono();

app.get("/health", (c) => c.text("ok"));

function errorPage(message: string): SnapHandlerResult {
  return {
    version: "2.0",
    theme: { accent: "red" },
    ui: {
      root: "page",
      elements: {
        page: { type: "stack", props: {}, children: ["msg"] },
        msg: { type: "text", props: { content: message, align: "center" } },
      },
    },
  };
}

registerSnapHandler(app, async (ctx) => {
  const url = new URL(ctx.request.url);
  const base = getBaseUrl(ctx.request);
  const action = url.searchParams.get("action");
  const eventId = url.searchParams.get("event");

  // GET — initial render
  if (ctx.action.type === "get") {
    if (eventId) {
      const event = (await store.get(`event:${eventId}`)) as Event | null;
      if (!event) return errorPage("Event not found.");
      return eventPage(event, null, base);
    }
    return createPage(base);
  }

  // POST — interactions
  // ctx.action is narrowed away from "get" here; cast to access POST fields
  const postAction = ctx.action as unknown as {
    user: { fid: number };
    fid?: number;
    inputs: Record<string, string>;
  };
  const fid = postAction.user?.fid ?? postAction.fid ?? 0;
  const inputs = postAction.inputs ?? {};

  if (action === "create") {
    const title = inputs.title?.trim();
    if (!title) return createPage(base, "Please enter a title.");

    const id = generateId();
    const event: Event = {
      id,
      title: title.slice(0, 100),
      description: (inputs.description ?? "").trim().slice(0, 160),
      category: (inputs.category ?? "other").toLowerCase(),
      creatorFid: fid,
      createdAt: Date.now(),
      attendees: [fid],
      nominations: [],
    };
    await store.set(`event:${id}`, event);
    return createdPage(event, base);
  }

  if (!eventId) return errorPage("Missing event ID.");
  const event = (await store.get(`event:${eventId}`)) as Event | null;
  if (!event) return errorPage("Event not found.");

  if (action === "join") {
    if (!event.attendees.includes(fid)) {
      event.attendees.push(fid);
      await store.set(`event:${eventId}`, event);
    }
    return eventPage(event, "joined", base);
  }

  if (action === "nominate-form") {
    return nominatePage(eventId, base);
  }

  if (action === "nominate") {
    const username = inputs.username?.trim();
    if (!username) return nominatePage(eventId, base, "Please enter a username.");
    const already = event.nominations.some(
      (n) => n.nominatorFid === fid && n.username === username
    );
    if (!already) {
      event.nominations.push({ nominatorFid: fid, username });
      await store.set(`event:${eventId}`, event);
    }
    return eventPage(event, "nominated", base);
  }

  if (action === "cancel") {
    return eventPage(event, null, base);
  }

  return errorPage("Unknown action.");
});

export default app;
