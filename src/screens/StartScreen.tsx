import { useGameStore } from "../controller";

const StartScreen = () => {
  const teams = useGameStore((s) => s.teams);
  const setTeams = useGameStore((s) => s.setTeams);
  const setGameState = useGameStore((s) => s.setGameState);

  const handleNumTeamsChange = (num: number) => {
    const newNum = Math.max(1, Math.min(8, num));
    const newTeams = Array(newNum)
      .fill(null)
      .map((_, i) => {
        if (i < teams.length) {
          return teams[i];
        }
        return { name: `Team ${i + 1}`, score: 0 };
      });
    setTeams(newTeams);
  };

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
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
                key={i}
                type="text"
                value={team.name}
                onChange={(e) => updateTeamName(i, e.target.value)}
                className="rounded border-2 border-blue-600 bg-blue-700 p-3 text-white"
                placeholder={`Team ${i + 1}`}
              />
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default StartScreen;
