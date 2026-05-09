# Farcaster Snap Poll

Interactive poll snaps for Farcaster. Create a question, attach a photo, add up to 6 options — share the URL in a cast and watch votes roll in.

## How it works

- **`/create`** — web form to build a poll (question + optional image + 2–6 options)
- **`/?id=<pollId>`** — the snap URL you share in Farcaster casts
- Farcaster clients render the poll inline; users pick an option and tap **Vote**
- After voting, a bar chart with results appears (confetti included)
- Votes are per FID and can be changed; last vote wins

## Stack

| Layer | Choice |
|---|---|
| Server | [Hono](https://hono.dev) on Vercel Node.js |
| Snap protocol | `@farcaster/snap` + `@farcaster/snap-hono` |
| Database | Supabase (Postgres) |
| Image storage | Supabase Storage |
| Deploy | Vercel |

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd farcon-snap
pnpm install
```

> **pnpm only.** The project uses a pnpm lockfile. Running `npm install` will fail.

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `schema.sql` in the **SQL editor**:
   - Creates `polls` and `votes` tables
3. Create a **Storage bucket**:
   - Storage → New bucket → name: `poll-images` → **Public: ON**

### 3. Environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co

# New secret key (sb_secret_…) — Supabase dashboard → Project Settings → API → Secret key.
# The legacy SUPABASE_SERVICE_ROLE_KEY is also accepted as a fallback.
SUPABASE_SECRET_KEY=sb_secret_your_key_here

# Your deployed URL (no trailing slash). Required for button targets in production.
SNAP_PUBLIC_BASE_URL=https://your-snap.vercel.app

# Skip JFS signature verification in local dev (set automatically by `pnpm dev`)
SKIP_JFS_VERIFICATION=0
```

`SUPABASE_SECRET_KEY` is the new **secret key** (`sb_secret_…`) found in Supabase dashboard → Project Settings → API. It replaces the legacy `service_role` key — both formats are accepted.

### 4. Run locally

```bash
pnpm dev
```

Opens at `http://localhost:3003`. Go to `/create` to make a poll, then paste the URL into the [Snap emulator](https://farcaster.xyz/~/developers/snaps) to test it.

JFS signature verification is automatically skipped in dev (`SKIP_JFS_VERIFICATION=1` is set by the `dev` script).

---

## Deploy to Vercel

```bash
# First time
npx vercel

# Subsequent deploys
npx vercel --prod
```

Set these environment variables in the Vercel dashboard (or via `vercel env add`):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SNAP_PUBLIC_BASE_URL` ← your `https://your-snap.vercel.app` URL

The `vercel.json` rewrite sends all requests to `api/index.ts`.

---

## Project structure

```
api/
  index.ts          Vercel serverless entry — wraps the Hono app
src/
  app.ts            Route definitions (create, upload, polls API, snap handler)
  snap-pages.ts     Snap response builders (poll, results, error, home)
  supabase.ts       DB + Storage helpers
  create-page.ts    HTML for the /create form
  server.ts         Local dev server
schema.sql          Postgres schema + storage bucket instructions
vercel.json         Catch-all rewrite to api/index
.env.example        Required environment variables
```

---

## Database schema

```sql
polls   id, question, image_url, options (jsonb), created_by_fid, created_at
votes   poll_id, fid, choice, created_at   ← primary key (poll_id, fid)
```

Votes are upserted so each Farcaster user can change their vote; the latest choice wins.

---

## Constraints

Per the Farcaster Snap v2.0 spec:

- Options: **2–6**, max **30 chars** each
- Question: max **320 chars**
- Image: **HTTPS** URL only, max **4 MB** upload
- Structural: all snap UI trees stay well within the 64-element / 5-depth limits

---

## Local development tips

```bash
# Type-check without building
pnpm typecheck

# Test snap content negotiation manually
curl -sS -H 'Accept: application/vnd.farcaster.snap+json' \
  'http://localhost:3003/?id=<pollId>' | jq .
```

For end-to-end testing (real signed POST requests), use the [Snap emulator](https://farcaster.xyz/~/developers/snaps) — it signs messages automatically so you don't need to bypass JFS locally.
