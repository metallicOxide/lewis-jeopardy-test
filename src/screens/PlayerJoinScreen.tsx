import { useState } from "react";
import { useGameStore } from "../controller";

const ROOM_CODE_REGEX = /^[A-Z0-9]*$/;

const PlayerJoinScreen = () => {
  const setGameState = useGameStore((s) => s.setGameState);
  const setPlayerInformtion = useGameStore((s) => s.setPlayerInformtion);
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  const handleRoomCodeChange = (value: string) => {
    const upper = value.toUpperCase().slice(0, 6);
    if (ROOM_CODE_REGEX.test(upper)) {
      setRoomCode(upper);
    }
  };

  const handleJoin = () => {
    if (roomCode.length !== 6 || !playerName.trim()) return;
    setPlayerInformtion(playerName.trim(), roomCode);
    setGameState("board");
  };

  const canJoin = roomCode.length === 6 && playerName.trim().length > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-900 p-8">
      <div className="w-full max-w-md rounded-lg bg-blue-800 p-8 shadow-2xl">
        <h1 className="mb-8 text-center text-5xl font-bold text-yellow-400">
          JEOPARDY!
        </h1>
        <h2 className="mb-6 text-center text-xl font-bold text-white">
          Join a Game
        </h2>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-blue-200">
            Room Code
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => handleRoomCodeChange(e.target.value)}
            placeholder="e.g. K7XM3R"
            className="w-full rounded border-2 border-blue-600 bg-blue-700 p-4 text-center text-3xl font-bold tracking-widest text-white placeholder-blue-400"
            maxLength={6}
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-sm font-bold text-blue-200">
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded border-2 border-blue-600 bg-blue-700 p-3 text-white placeholder-blue-400"
            onKeyDown={(e) => e.key === "Enter" && canJoin && handleJoin()}
          />
        </div>

        <button
          onClick={handleJoin}
          disabled={!canJoin}
          className="w-full rounded-lg bg-green-600 px-8 py-4 text-xl font-bold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Join Game
        </button>

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
    </div>
  );
};

export default PlayerJoinScreen;
