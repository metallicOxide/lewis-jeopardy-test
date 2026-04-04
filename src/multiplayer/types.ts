import { BuzzEntry, Team } from "../types";

// Broadcast event names
export const EVENTS = {
  PLAYER_JOIN: "player-join",
  PLAYER_BUZZ: "player-buzz",
  PLAYER_REMOVED: "player-removed",
  BUZZ_ORDER_UPDATE: "buzz-order-update",
  BUZZ_RESET: "buzz_reset",
  BUZZ_DISABLE: "buzz_disable",
} as const;

// Broadcast payload types
export type PlayerJoinPayload = { id: string; name: string };
export type PlayerBuzzPayload = { id: string };
export type PlayerRemovedPayload = { id: string; teams: Team[] };
export type BuzzOrderUpdatePayload = { buzzOrder: BuzzEntry[] };
