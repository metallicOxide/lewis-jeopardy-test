import { useEffect, useRef, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useGameStore } from "../controller";
import { EVENTS, type PlayerBuzzPayload } from "./types";

import { createChannel, destroyChannel } from "../supabase/channel";

export const useHostChannel = () => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const roomCode = useGameStore((s) => s.roomCode);

  const broadcast = useCallback(
    (event: string, payload: Record<string, unknown>) => {
      channelRef.current?.send({ type: "broadcast", event, payload });
    },
    [],
  );

  const resetBuzzer = useCallback(() => {
    channelRef.current?.send({
      type: "broadcast",
      event: EVENTS.BUZZ_RESET,
    });
  }, []);

  useEffect(() => {
    if (!roomCode) return;

    const channel = createChannel(roomCode);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: EVENTS.PLAYER_BUZZ }, ({ payload }) => {
        const { id } = payload as PlayerBuzzPayload;
        const store = useGameStore.getState();

        const entry = { playerId: id, receivedAt: Date.now() };
        store.addBuzz(entry);

        channel.send({
          type: "broadcast",
          event: EVENTS.BUZZ_ORDER_UPDATE,
          payload: { buzzOrder: useGameStore.getState().buzzOrder },
        });
      })
      .subscribe();

    return () => {
      channelRef.current = null;
      destroyChannel(channel);
    };
  }, [roomCode]);

  return { broadcast, resetBuzzer };
};
