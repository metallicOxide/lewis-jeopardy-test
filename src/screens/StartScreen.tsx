import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useGameStore } from "../controller";
import { generateRoomCode } from "../multiplayer/useHostChannel";

const StartScreen = () => {
  const teams = useGameStore((s) => s.teams);
  const setTeams = useGameStore((s) => s.setTeams);
  const setGameState = useGameStore((s) => s.setGameState);
  const role = useGameStore((s) => s.role);
  const roomCode = useGameStore((s) => s.roomCode);
  const setRoomCode = useGameStore((s) => s.setRoomCode);
  const removeTeam = useGameStore((s) => s.removeTeam);

  const isHost = role === "host";

  // Generate room code and connect channel on mount for host
  useEffect(() => {
    if (isHost && !roomCode) {
      const code = generateRoomCode();
      setRoomCode(code);
    }
  }, [isHost, roomCode, setRoomCode]);

  const handleNumTeamsChange = (num: number) => {
    const newNum = Math.max(1, Math.min(8, num));
    const newTeams = Array(newNum)
      .fill(null)
      .map((_, i) => {
        if (i < teams.length) {
          return teams[i];
        }
        return { id: crypto.randomUUID(), name: `Team ${i + 1}`, score: 0 };
      });
    setTeams(newTeams);
  };

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], name };
    setTeams(newTeams);
  };

  const startGame = () => {
    setGameState("board");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-900 p-8">
      <div className="w-full max-w-4xl rounded-lg bg-blue-800 p-8 shadow-2xl">
        <h1 className="mb-12 text-center text-6xl font-bold text-yellow-400">
          JEOPARDY!
        </h1>

        {isHost && roomCode ? (
          <>
            {/* Host lobby mode */}
            <div className="mb-8 text-center">
              <p className="mb-2 text-lg text-blue-200">Room Code</p>
              <p className="font-mono text-5xl font-bold tracking-widest text-white">
                {roomCode}
              </p>
              <p className="mt-2 text-sm text-blue-300">
                Share this code with players to join
              </p>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-white">
                Players ({teams.length})
              </h2>
              {teams.length === 0 ? (
                <p className="text-center text-blue-300">
                  Waiting for players to join...
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between rounded bg-blue-700 p-3"
                    >
                      <span className="font-bold text-white">{team.name}</span>
                      <button
                        onClick={() => removeTeam(team.id)}
                        className="rounded p-1 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Local/offline mode */}
            <div className="mb-8">
              <label className="mb-4 block text-xl font-bold text-white">
                Number of Teams (1-8)
              </label>
              <input
                placeholder={teams.length.toString()}
                onChange={(e) => handleNumTeamsChange(parseInt(e.target.value))}
                className="w-full rounded border-2 border-blue-600 bg-blue-700 p-4 text-center text-2xl font-bold text-white"
              />
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-white">Team Names</h2>
              <div className="grid grid-cols-2 gap-4">
                {teams.map((team, i) => (
                  <input
                    key={team.id}
                    type="text"
                    value={team.name}
                    onChange={(e) => updateTeamName(i, e.target.value)}
                    className="rounded border-2 border-blue-600 bg-blue-700 p-3 text-white"
                    placeholder={`Team ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => setGameState("config")}
            className="flex-1 rounded-lg bg-yellow-500 px-8 py-4 text-xl font-bold text-blue-900 hover:bg-yellow-400"
          >
            Configure Questions
          </button>
          <button
            onClick={startGame}
            className="flex-1 rounded-lg bg-green-600 px-8 py-4 text-xl font-bold text-white hover:bg-green-500"
          >
            Start Game
          </button>
        </div>

        <button
          onClick={() => {
            useGameStore.getState().setRole(null);
            setGameState("role-select");
          }}
          className="mt-4 w-full text-center text-xl text-blue-300 hover:text-white"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
