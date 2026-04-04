import { useEffect, useRef, useState, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  EVENTS,
  type PlayerRemovedPayload,
  type BuzzOrderUpdatePayload,
} from "./types";
import { createChannel, destroyChannel } from "../supabase/channel";
import type { BuzzEntry, Team } from "../types";

type UsePlayerChannelOptions = {
  roomCode: string;
  playerId: string;
  playerName: string;
};

export const usePlayerChannel = ({
  roomCode,
  playerId,
  playerName,
}: UsePlayerChannelOptions) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [connected, setConnected] = useState(false);
  const [isBuzzerEnabled, setIsBuzzerEnabled] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [buzzOrder, setBuzzOrder] = useState<BuzzEntry[]>([]);

  const sendBuzz = useCallback(() => {
    channelRef.current?.send({
      type: "broadcast",
      event: EVENTS.PLAYER_BUZZ,
      payload: { id: playerId },
    });
  }, [playerId]);

  useEffect(() => {
    const channel = createChannel(roomCode);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: EVENTS.PLAYER_REMOVED }, ({ payload }) => {
        const data = payload as PlayerRemovedPayload;
        setTeams(data.teams);
      })
      .on("broadcast", { event: EVENTS.BUZZ_ORDER_UPDATE }, ({ payload }) => {
        const data = payload as BuzzOrderUpdatePayload;
        setBuzzOrder(data.buzzOrder);
      })
      .on("broadcast", { event: EVENTS.BUZZ_RESET }, () => {
        setIsBuzzerEnabled(true);
        setBuzzOrder([]);
      })
      .on("broadcast", { event: EVENTS.BUZZ_DISABLE }, () => {
        setIsBuzzerEnabled(false);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnected(true);
          channel.send({
            type: "broadcast",
            event: EVENTS.PLAYER_JOIN,
            payload: { id: playerId, name: playerName },
          });
        }
      });

    return () => {
      channelRef.current = null;
      setConnected(false);
      destroyChannel(channel);
    };
  }, [roomCode, playerId, playerName]);

  return { connected, isBuzzerEnabled, teams, buzzOrder, sendBuzz };
};
