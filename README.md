# Who's In — Farcaster Snap

A Farcaster Snap for finding friends to join you at events. Cast it, friends tap **I'm In**, or **Nominate** a friend who should come.

Built with [Hono](https://hono.dev) and [`@farcaster/snap-hono`](https://github.com/farcasterxyz/snap).

## Flow

1. **Create** — Open the snap, fill in event title, description, and category. Hit "Create & Share".
2. **Share** — The snap returns a confetti page with a "Share as Cast" button that pre-fills a cast embedding the event URL.
3. **Respond** — Anyone who sees the cast can tap:
   - **I'm In** → joins the event (adds their FID to attendees)
   - **Nominate** → enters a friend's @username to recommend them

State is keyed by `event:<id>` in the data store.

## Local Development

```bash
pnpm install
pnpm dev          # http://localhost:3003
```

Then open the [Snap Emulator](https://farcaster.xyz/~/developers/snaps) and enter `http://localhost:3003` (use a tunnel like `cloudflared` or `ngrok` if the emulator can't reach loopback).

`pnpm dev` sets `SKIP_JFS_VERIFICATION=1` so the local server accepts unsigned POSTs. **Never set this in production.**

## Environment

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description |
| --- | --- | --- |
| `SNAP_PUBLIC_BASE_URL` | prod | Public origin of your deployment, no trailing slash. Used to build button target URLs. |
| `PORT` | no | Local dev port (default `3003`). |
| `TURSO_DATABASE_URL` | prod | Turso DB URL for persistent state. Without this, store is in-memory and resets on restart. |
| `TURSO_AUTH_TOKEN` | prod | Turso auth token. |

## Deployment

The app is a plain Node server (`src/index.ts` → `@hono/node-server`), so it runs on anything that hosts Node:

### Render / Railway / Fly / Any Node host

1. Push this repo.
2. Build command: `pnpm install`
3. Start command: `pnpm start`
4. Set `SNAP_PUBLIC_BASE_URL` to the deployed origin.
5. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` (create a free DB at [turso.tech](https://turso.tech)).

### Vercel

Vercel needs a small adapter — replace `src/index.ts`'s `serve(...)` with `hono/vercel` and move the entry to `api/index.ts`:

```ts
// api/index.ts
import app from "../src/app.js";
import { handle } from "hono/vercel";
export const config = { runtime: "nodejs" };
export default handle(app);
```

Add a `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }] }
```

### Verify deployment

```bash
curl -sS -H 'Accept: application/vnd.farcaster.snap+json' https://your-snap-url/
```

You should get JSON with `Content-Type: application/vnd.farcaster.snap+json`.

## Project Layout

```
src/
  index.ts          Node server entry
  app.ts            Hono app + snap handler (route dispatch)
  helpers.ts        Base URL resolution, ID generation, theming
  types.ts          Event / Nomination types
  pages/
    create.ts       Form for creating a new event
    created.ts      Success page with "Share as Cast" button
    event.ts        Event card with I'm In / Nominate buttons
    nominate.ts     Form for nominating a friend by username
```

## Spec

Built against [Farcaster Snap v2.0](https://docs.farcaster.xyz/snap/). The full spec is also vendored in `llms.txt` for offline reference.
