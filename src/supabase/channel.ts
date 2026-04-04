import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

// 30 chars — excludes visually ambiguous I/1/O/0
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 6;

/**
 * Generates a 6-character alphanumeric room code using crypto.getRandomValues.
 * ~30^6 ≈ 729 million possible codes.
 */
export const generateRoomCode = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(ROOM_CODE_LENGTH));
  return Array.from(bytes)
    .map((b) => ROOM_CODE_CHARS[b % ROOM_CODE_CHARS.length])
    .join("");
};

export const createChannel = (roomCode: string): RealtimeChannel =>
  supabase.channel(`room-${roomCode}`);

export const destroyChannel = (channel: RealtimeChannel): void => {
  channel.unsubscribe();
  supabase.removeChannel(channel);
};
