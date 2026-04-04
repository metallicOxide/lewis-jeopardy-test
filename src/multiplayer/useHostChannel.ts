import { useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useGameStore } from "../controller";
import { EVENTS, PlayerJoinPayload, type PlayerBuzzPayload } from "./types";
import { createChannel, destroyChannel } from "../supabase/channel";

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

// Module-level singleton — survives screen navigations
let hostChannel: RealtimeChannel | null = null;
let currentRoomCode: string | null = null;

/**
 * Call once (e.g. from StartScreen) to open the host channel.
 * Subsequent calls with the same roomCode are no-ops.
 */
export const connectHost = (roomCode: string) => {
  if (hostChannel && currentRoomCode === roomCode) return;

  // Tear down any stale channel first
  if (hostChannel) {
    destroyChannel(hostChannel);
  }

  const channel = createChannel(roomCode);
  hostChannel = channel;
  currentRoomCode = roomCode;

  channel
    .on("broadcast", { event: EVENTS.PLAYER_JOIN }, ({ payload }) => {
      const { id, name } = payload as PlayerJoinPayload;
      useGameStore.getState().addTeam({ id, name, score: 0 });
    })
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
};

/**
 * Tear down the host channel (e.g. on game reset).
 */
export const disconnectHost = () => {
  if (hostChannel) {
    destroyChannel(hostChannel);
    hostChannel = null;
    currentRoomCode = null;
  }
};

/**
 * Hook that returns helpers for the persistent host channel.
 * Does NOT create or destroy the channel — call connectHost / disconnectHost for that.
 */
export const useHostChannel = () => {
  const broadcast = useCallback(
    (event: string, payload: Record<string, unknown>) => {
      hostChannel?.send({ type: "broadcast", event, payload });
    },
    [],
  );

  const resetBuzzer = useCallback(() => {
    hostChannel?.send({
      type: "broadcast",
      event: EVENTS.BUZZ_RESET,
      payload: {},
    });
  }, []);

  const disableBuzzer = useCallback(() => {
    hostChannel?.send({
      type: "broadcast",
      event: EVENTS.BUZZ_DISABLE,
      payload: {},
    });
  }, []);

  return { broadcast, resetBuzzer, disableBuzzer };
};
