import ScoreBar from "../components/ScoreBar";
import { useGameStore } from "../controller";

const BoardScreen = () => {
  const categories = useGameStore((s) => s.categories);
  const pointValues = useGameStore((s) => s.pointValues);
  const setSelectedTile = useGameStore((s) => s.setSelectedTile);
  const setGameState = useGameStore((s) => s.setGameState);

  const handleTileClick = (catIndex: number, qIndex: number) => {
    setSelectedTile({ catIndex, qIndex });
    setGameState("question");
  };

  return (
    <div className="min-h-screen bg-blue-900 p-8">
      <div className="mx-auto max-w-none">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-5xl font-bold text-white">JEOPARDY!</h1>
          <button
            onClick={() => setGameState("config")}
            className="rounded bg-yellow-500 px-6 py-3 font-bold text-blue-900 hover:bg-yellow-400"
          >
            Configure Game
          </button>
        </div>

        <div
          className="mb-8 grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
          }}
        >
          {categories.map((cat, i) => (
            <div key={i} className="bg-blue-700 p-4 text-center">
              <p className="text-sm font-bold text-white uppercase">
                {cat.name}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mb-8 grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
          }}
        >
          {categories.map((cat, catIndex) => (
            <div key={catIndex} className="flex flex-col gap-2">
              {cat.questions.map((question, qIndex) => (
                <button
                  key={qIndex}
                  onClick={() => handleTileClick(catIndex, qIndex)}
                  className={`${
                    question.revealed
                      ? "bg-blue-950"
                      : "bg-blue-600 hover:bg-blue-500"
                  } rounded p-8 text-3xl font-bold text-yellow-400 transition-colors`}
                >
                  {pointValues[qIndex]}
                </button>
              ))}
            </div>
          ))}
        </div>

        <ScoreBar
          pointIncrement={pointValues[0]}
          className="rounded-lg p-6"
        />
      </div>
    </div>
  );
};

export default BoardScreen;
