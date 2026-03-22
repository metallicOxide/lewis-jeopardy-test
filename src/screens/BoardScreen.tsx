import ScoreBar from "../components/ScoreBar";
import { useGameStore } from "../controller";

const getCellStyles = (rowCount: number) => {
  if (rowCount <= 3) return { padding: "p-8", fontSize: "text-3xl" };
  if (rowCount <= 6) return { padding: "p-4", fontSize: "text-2xl" };
  if (rowCount <= 10) return { padding: "p-2", fontSize: "text-xl" };
  return { padding: "p-1", fontSize: "text-lg" };
};

const BoardScreen = () => {
  const categories = useGameStore((s) => s.categories);
  const pointValues = useGameStore((s) => s.pointValues);
  const setSelectedTile = useGameStore((s) => s.setSelectedTile);
  const setGameState = useGameStore((s) => s.setGameState);

  const cellStyles = getCellStyles(pointValues.length);

  const handleTileClick = (catIndex: number, qIndex: number) => {
    setSelectedTile({ catIndex, qIndex });
    setGameState("question");
  };

  return (
    <div className="flex h-screen flex-col bg-blue-900 p-8">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-5xl font-bold text-white">JEOPARDY!</h1>
        <button
          onClick={() => setGameState("config")}
          className="rounded bg-yellow-500 px-6 py-3 font-bold text-blue-900 hover:bg-yellow-400"
        >
          Configure Game
        </button>
      </div>

      <div
        className="mb-2 grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
        }}
      >
        {categories.map((cat, i) => (
          <div key={i} className="bg-blue-700 p-4 text-center">
            <p className="text-sm font-bold text-white uppercase">{cat.name}</p>
          </div>
        ))}
      </div>

      <div
        className="mb-4 grid min-h-0 flex-1 gap-2 overflow-y-auto"
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
                } flex-1 rounded ${cellStyles.padding} ${cellStyles.fontSize} font-bold text-yellow-400 transition-colors`}
              >
                {pointValues[qIndex]}
              </button>
            ))}
          </div>
        ))}
      </div>

      <ScoreBar pointIncrement={pointValues[0]} className="rounded-lg p-6" />
    </div>
  );
};

export default BoardScreen;
