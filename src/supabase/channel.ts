import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

export const createChannel = (roomCode: string): RealtimeChannel => {
  return supabase.channel(`room:${roomCode}`);
};

export const destroyChannel = (channel: RealtimeChannel): void => {
  channel.unsubscribe();
  supabase.removeChannel(channel);
};
