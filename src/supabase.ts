import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
// New key format: sb_secret_… (replaces the legacy service_role key).
// Find it in Supabase dashboard → Project Settings → API → Secret key.
const key =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY; // legacy fallback

if (!url || !key) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables.",
  );
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export type Poll = {
  id: string;
  question: string;
  image_url: string | null;
  options: string[];
  created_by_fid: number | null;
};

type PollRow = Omit<Poll, "options"> & { options: unknown };

function rowToPoll(row: PollRow): Poll {
  const options = Array.isArray(row.options) ? row.options.map(String) : [];
  return { ...row, options };
}

export async function getPoll(id: string): Promise<Poll | null> {
  const { data, error } = await supabase
    .from("polls")
    .select("id, question, image_url, options, created_by_fid")
    .eq("id", id)
    .maybeSingle<PollRow>();
  if (error) throw error;
  return data ? rowToPoll(data) : null;
}

export async function createPoll(input: {
  question: string;
  image_url: string | null;
  options: string[];
  created_by_fid: number | null;
}): Promise<string> {
  const id = generatePollId();
  const { error } = await supabase.from("polls").insert({
    id,
    question: input.question,
    image_url: input.image_url,
    options: input.options,
    created_by_fid: input.created_by_fid,
  });
  if (error) throw error;
  return id;
}

export async function addVote(
  pollId: string,
  fid: number,
  choice: string,
): Promise<void> {
  const { error } = await supabase
    .from("votes")
    .upsert(
      { poll_id: pollId, fid, choice },
      { onConflict: "poll_id,fid" },
    );
  if (error) throw error;
}

export async function getResults(
  pollId: string,
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("votes")
    .select("choice")
    .eq("poll_id", pollId);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const choice = String((row as { choice: unknown }).choice);
    counts[choice] = (counts[choice] ?? 0) + 1;
  }
  return counts;
}

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadPollImage(
  buffer: ArrayBuffer,
  mimeType: string,
): Promise<string> {
  const ext = ALLOWED_IMAGE_TYPES[mimeType];
  if (!ext) throw new Error("Unsupported image type");

  const filename = `${generatePollId()}.${ext}`;
  const { error } = await supabase.storage
    .from("poll-images")
    .upload(filename, buffer, {
      contentType: mimeType,
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw error;

  const { data } = supabase.storage
    .from("poll-images")
    .getPublicUrl(filename);
  return data.publicUrl;
}

export { ALLOWED_IMAGE_TYPES };

const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
function generatePollId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += ID_ALPHABET[b % ID_ALPHABET.length];
  return out;
}
