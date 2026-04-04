import { useLayoutEffect } from "react";
import { useGameStore } from "../store";
import { connectHost, disconnectHost } from "../../multiplayer/useHostChannel";

export const HostSideEffect = () => {
  const role = useGameStore((s) => s.role);
  const gameCode = useGameStore((s) => s.roomCode);

  useLayoutEffect(() => {
    if (role !== "host") {
      return;
    }

    if (gameCode) {
      connectHost(gameCode);
    }

    if (!gameCode) {
      disconnectHost();
    }

    return () => {
      disconnectHost();
    };
  }, [role, gameCode]);

  return null;
};
