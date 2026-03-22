import type { Category, GameStatus, Team } from '../types';
import ScoreBar from '../components/ScoreBar';

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

        <ScoreBar
          teams={teams}
          setTeams={setTeams}
          numTeams={numTeams}
          pointIncrement={pointValues[0]}
          className="p-6 rounded-lg"
        />
      </div>
    </div>
  );
};

export default BoardScreen;
