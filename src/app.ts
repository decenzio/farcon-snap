import { Hono } from "hono";
import { registerSnapHandler } from "@farcaster/snap-hono";
import {
  ALLOWED_IMAGE_TYPES,
  addVote,
  createPoll,
  getPoll,
  getResults,
  uploadPollImage,
} from "./supabase.js";
import {
  errorSnap,
  homePageSnap,
  pollSnap,
  resultsSnap,
} from "./snap-pages.js";
import { createPageHtml } from "./create-page.js";

function originFromRequest(req: Request): string {
  const fromEnv = process.env.SNAP_PUBLIC_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const xfHost = req.headers.get("x-forwarded-host");
  const host = (xfHost ?? req.headers.get("host"))?.split(",")[0].trim();
  const isLoopback =
    !!host && /^(localhost|127\.0\.0\.1|\[::1\]|::1)(:\d+)?$/.test(host);
  const xfProto = req.headers.get("x-forwarded-proto");
  const proto = xfProto
    ? xfProto.split(",")[0].trim().toLowerCase()
    : isLoopback
      ? "http"
      : "https";
  if (host) return `${proto}://${host}`;
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export const app = new Hono();

// HTML form for creating polls
app.get("/create", (c) => c.html(createPageHtml));

// Image upload — accepts multipart/form-data with a single "image" file field.
// Stores in Supabase Storage bucket "poll-images" (must be public).
app.post("/api/upload-image", async (c) => {
  let formData: FormData;
  try {
    formData = await c.req.formData();
  } catch {
    return c.json({ error: "Could not parse form data." }, 400);
  }

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return c.json({ error: "No image field in request." }, 400);
  }

  const mimeType = file.type.toLowerCase();
  if (!ALLOWED_IMAGE_TYPES[mimeType]) {
    return c.json(
      { error: "Only JPEG, PNG, WEBP and GIF are accepted." },
      400,
    );
  }

  const MAX_BYTES = 4 * 1024 * 1024; // 4 MB — Vercel Serverless body limit
  if (file.size > MAX_BYTES) {
    return c.json({ error: "Image must be smaller than 8 MB." }, 400);
  }

  const buffer = await file.arrayBuffer();
  const url = await uploadPollImage(buffer, mimeType);
  return c.json({ url });
});

// JSON API: create a poll
app.post("/api/polls", async (c) => {
  let body: Record<string, unknown>;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const question =
    typeof body.question === "string" ? body.question.trim() : "";
  if (question.length < 1 || question.length > 320) {
    return c.json({ error: "Question must be 1-320 characters." }, 400);
  }

  const rawOptions = Array.isArray(body.options) ? body.options : [];
  const options = rawOptions
    .map((o) => (typeof o === "string" ? o.trim() : ""))
    .filter((o) => o.length > 0);
  if (options.length < 2 || options.length > 6) {
    return c.json({ error: "Provide between 2 and 6 options." }, 400);
  }
  if (options.some((o) => o.length > 30)) {
    return c.json({ error: "Each option must be 30 characters or fewer." }, 400);
  }
  if (new Set(options).size !== options.length) {
    return c.json({ error: "Options must be unique." }, 400);
  }

  let image_url: string | null = null;
  if (typeof body.image_url === "string" && body.image_url.trim()) {
    const u = body.image_url.trim();
    if (!/^https:\/\//i.test(u)) {
      return c.json({ error: "Image URL must start with https://" }, 400);
    }
    image_url = u;
  }

  const id = await createPoll({
    question,
    image_url,
    options,
    created_by_fid: null,
  });

  const origin = originFromRequest(c.req.raw);
  return c.json({ id, url: `${origin}/?id=${id}` });
});

// Snap handler at "/" — handles content negotiation, JFS verification,
// and both GET (render) and POST (vote).
registerSnapHandler(
  app,
  async (ctx) => {
    const url = new URL(ctx.request.url);
    const id = url.searchParams.get("id");
    const view = url.searchParams.get("view");
    const origin = originFromRequest(ctx.request);

    if (!id) {
      return homePageSnap(origin);
    }

    const poll = await getPoll(id);
    if (!poll) {
      return errorSnap("This poll doesn't exist or has been removed.");
    }

    // GET: render the poll
    if (ctx.action.type === "get") {
      return pollSnap(poll, origin);
    }

    // POST with view=poll → "Change my vote" flow → re-render the poll page
    if (view === "poll") {
      return pollSnap(poll, origin);
    }

    // POST: register a vote
    const choice = ctx.action.inputs?.choice;
    if (typeof choice !== "string" || !poll.options.includes(choice)) {
      // No selection — gently send the user back to the poll
      return pollSnap(poll, origin);
    }

    const fid = ctx.action.user?.fid ?? ctx.action.fid;
    if (typeof fid !== "number" || !Number.isFinite(fid)) {
      return errorSnap("Could not identify the voter.");
    }

    await addVote(id, fid, choice);
    const counts = await getResults(id);
    return resultsSnap(poll, counts, origin, choice);
  },
  {
    skipJFSVerification: process.env.SKIP_JFS_VERIFICATION === "1",
  },
);

export default app;
