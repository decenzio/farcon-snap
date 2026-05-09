-- Run this in the Supabase SQL editor (or via MCP execute_sql).
--
-- STORAGE: create a public bucket named "poll-images" in the dashboard
-- (Storage → New bucket → poll-images → Public ON), or run:
--   insert into storage.buckets (id, name, public)
--   values ('poll-images', 'poll-images', true)
--   on conflict do nothing;

-- ── Tables ────────────────────────────────────────────────────────────────

create table if not exists polls (
  id              text        primary key,
  question        text        not null,
  image_url       text,
  options         jsonb       not null,
  created_by_fid  bigint,
  created_at      timestamptz not null default now()
);

create table if not exists votes (
  poll_id     text        not null references polls(id) on delete cascade,
  fid         bigint      not null,
  choice      text        not null,
  created_at  timestamptz not null default now(),
  primary key (poll_id, fid)
);

create index if not exists votes_poll_id_idx on votes(poll_id);

-- ── Row Level Security ────────────────────────────────────────────────────
-- Enable RLS on every table in the public schema (required by Supabase skill).
-- Our server uses the secret key which bypasses RLS, so these policies are
-- defense-in-depth — they prevent accidental direct anon/authenticated access
-- to the data via the auto-generated REST API.

alter table polls enable row level security;
alter table votes  enable row level security;

-- polls: anyone can read (needed for the public share URL to resolve in browsers)
create policy "polls_select_public"
  on polls for select
  using (true);

-- polls: no direct inserts/updates/deletes from anon or authenticated roles.
-- All writes go through the server-side secret key, which bypasses RLS.

-- votes: no direct access from anon or authenticated roles.
-- All reads/writes go through the server-side secret key.

-- ── Storage policies ──────────────────────────────────────────────────────
-- After creating the poll-images bucket, allow the server to upload:
--   (The secret key / service_role already has full storage access,
--    so no extra policy is needed for uploads.)
--
-- Allow public read of uploaded images (bucket is public, so this is automatic):
-- create policy "poll_images_public_read"
--   on storage.objects for select
--   using ( bucket_id = 'poll-images' );
