import { useState, useEffect } from "react";
import { usePlayerChannel } from "../multiplayer/usePlayerChannel";
import { useGameStore } from "../controller";

const PlayerGameScreen = () => {
  const playerInfo = useGameStore((s) => s.playerInformation);
  const setGameState = useGameStore((s) => s.setGameState);

  if (!playerInfo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-blue-900">
        <p className="text-xl text-white">Session expired. Please go back</p>
        <button
          onClick={() => {
            useGameStore.getState().setRole(null);
            setGameState("role-select");
          }}
          className="mt-4 w-full text-center text-sm text-blue-300 hover:text-white"
        >
          Back
        </button>
      </div>
    );
  }

  return <PlayerGameInner {...playerInfo} />;
};

const PlayerGameInner = ({
  id,
  name,
  roomCode,
}: {
  id: string;
  name: string;
  roomCode: string;
}) => {
  const { connected, isBuzzerEnabled, buzzOrder, sendBuzz } = usePlayerChannel({
    roomCode,
    playerId: id,
    playerName: name,
  });

  const [hasBuzzed, setHasBuzzed] = useState(false);

  // Reset hasBuzzed when buzzer gets re-enabled (new question)
  useEffect(() => {
    if (isBuzzerEnabled) {
      setHasBuzzed(false);
    }
  }, [isBuzzerEnabled]);

  const handleBuzz = () => {
    if (!isBuzzerEnabled || hasBuzzed) return;
    sendBuzz();
    setHasBuzzed(true);
  };

  const myBuzzPosition = buzzOrder.findIndex((b) => b.playerId === id) + 1;

  const getStatusText = () => {
    if (!connected) return "Connecting...";
    if (isBuzzerEnabled && !hasBuzzed) return "Buzz now!";
    if (hasBuzzed && myBuzzPosition > 0) return `You buzzed #${myBuzzPosition}`;
    if (hasBuzzed) return "Buzzed!";
    return "Waiting for host...";
  };

  const buzzerActive = isBuzzerEnabled && !hasBuzzed;

  return (
    <div className="flex min-h-screen flex-col bg-blue-900">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-950 p-4">
        <div className="flex items-center gap-3">
          <span className="rounded bg-yellow-500 px-3 py-1 font-mono text-sm font-bold text-blue-900">
            {roomCode}
          </span>
          <span className="text-lg font-bold text-white">{name}</span>
        </div>
        {connected ? (
          <span className="text-sm text-green-400">Connected</span>
        ) : (
          <span className="text-sm text-yellow-400">Connecting...</span>
        )}
      </div>

      {/* Buzzer Area */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <p className="mb-8 text-2xl font-bold text-white">{getStatusText()}</p>

        <button
          onClick={handleBuzz}
          disabled={!buzzerActive}
          className={`h-48 w-48 rounded-full border-8 text-3xl font-bold shadow-lg transition-all ${
            buzzerActive
              ? "border-red-400 bg-red-600 text-white hover:bg-red-500 active:scale-95"
              : "cursor-not-allowed border-gray-600 bg-gray-700 text-gray-500"
          }`}
        >
          {hasBuzzed ? "BUZZED" : "BUZZ"}
        </button>

        {myBuzzPosition > 0 && (
          <p className="mt-6 text-xl font-bold text-yellow-400">
            #{myBuzzPosition}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlayerGameScreen;
