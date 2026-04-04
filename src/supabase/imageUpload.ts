import { v4 as uuidv4 } from "uuid";
import { supabase } from "./client";

const BUCKET = "jeopardy-images";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function uploadImage(file: Blob): Promise<string> {
  const path = `${uuidv4()}.jpg`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: "image/jpeg",
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const path = url.split(`/${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function cleanupExpiredImages(): Promise<void> {
  const { data, error } = await supabase.storage.from(BUCKET).list();
  if (error || !data) return;

  const cutoff = Date.now() - TTL_MS;
  const expired = data
    .filter((f) => f.created_at && new Date(f.created_at).getTime() < cutoff)
    .map((f) => f.name);

  if (expired.length > 0) {
    await supabase.storage.from(BUCKET).remove(expired);
  }
}
