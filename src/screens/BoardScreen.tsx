import { Plus, Minus } from 'lucide-react';
import type { Category, GameStatus, Team } from '../types';

type BoardScreenProps = {
  categories: Category[];
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  numTeams: number;
  pointValues: number[];
  setSelectedTile: (tile: { catIndex: number; qIndex: number }) => void;
  setGameState: (state: GameStatus) => void;
};

const BoardScreen = ({
  categories,
  teams,
  setTeams,
  numTeams,
  pointValues,
  setSelectedTile,
  setGameState,
}: BoardScreenProps) => {
  const handleTileClick = (catIndex: number, qIndex: number) => {
    setSelectedTile({ catIndex, qIndex });
    setGameState('question');
  };

  const updateTeamScore = (teamIndex: number, change: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].score += change * pointValues[0];
    setTeams(newTeams);
  };

  const updateTeamScoreDirect = (teamIndex: number, value: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].score = parseInt(value) || 0;
    setTeams(newTeams);
  };

  return (
    <div className="min-h-screen bg-blue-900 p-8">
      <div className="max-w-none mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white">JEOPARDY!</h1>
          <button
            onClick={() => setGameState('config')}
            className="bg-yellow-500 text-blue-900 px-6 py-3 rounded font-bold hover:bg-yellow-400"
          >
            Configure Game
          </button>
        </div>

        <div className="grid gap-2 mb-8" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
          {categories.map((cat, i) => (
            <div key={i} className="bg-blue-700 p-4 text-center">
              <p className="text-white font-bold text-sm uppercase">{cat.name}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-2 mb-8" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
          {categories.map((cat, catIndex) => (
            <div key={catIndex} className="flex flex-col gap-2">
              {cat.questions.map((question, qIndex) => (
                <button
                  key={qIndex}
                  onClick={() => handleTileClick(catIndex, qIndex)}
                  className={`${question.revealed ? 'bg-blue-950' : 'bg-blue-600 hover:bg-blue-500'
                    } p-8 rounded text-yellow-400 text-3xl font-bold transition-colors`}
                >
                  {pointValues[qIndex]}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-blue-950 p-6 rounded-lg">
          <div className="grid gap-4 max-w-7xl mx-auto" style={{ gridTemplateColumns: `repeat(${numTeams}, minmax(0, 1fr))` }}>
            {teams.slice(0, numTeams).map((team, i) => (
              <div key={i} className="text-center">
                <div className="bg-white px-4 py-2 rounded mb-2">
                  <p className="font-bold text-2xl">{team.name}</p>
                  <input
                    type="number"
                    value={team.score}
                    onChange={(e) => updateTeamScoreDirect(i, e.target.value)}
                    className="text-2xl text-blue-900 font-bold w-full text-center border-2 border-blue-200 rounded px-2"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => updateTeamScore(i, 1)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => updateTeamScore(i, -1)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    <Minus size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardScreen;
