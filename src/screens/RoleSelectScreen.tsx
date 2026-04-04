import { useGameStore } from "../controller";

const RoleSelectScreen = () => {
  const setRole = useGameStore((s) => s.setRole);
  const setGameState = useGameStore((s) => s.setGameState);

  const selectRole = (role: "host" | "player") => {
    setRole(role);
    setGameState("start");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-900 p-8">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-16 text-7xl font-bold text-yellow-400">JEOPARDY!</h1>
        <div className="flex gap-6">
          <button
            onClick={() => selectRole("host")}
            className="flex-1 rounded-lg bg-yellow-500 px-8 py-8 text-2xl font-bold text-blue-900 hover:bg-yellow-400"
          >
            Host a Game
          </button>
          <button
            onClick={() => selectRole("player")}
            className="flex-1 rounded-lg bg-green-600 px-8 py-8 text-2xl font-bold text-white hover:bg-green-500"
          >
            Join a Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectScreen;
