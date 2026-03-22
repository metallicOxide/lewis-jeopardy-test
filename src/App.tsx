import { useGameStore } from "./controller";
import StartScreen from "./screens/StartScreen";
import ConfigScreen from "./screens/ConfigScreen";
import QuestionScreen from "./screens/QuestionScreen";
import BoardScreen from "./screens/BoardScreen";

const JeopardyGame = () => {
  const gameState = useGameStore((s) => s.gameState);
  const selectedTile = useGameStore((s) => s.selectedTile);

  if (gameState === "start") return <StartScreen />;
  if (gameState === "config") return <ConfigScreen />;
  if (gameState === "question" && selectedTile) return <QuestionScreen />;
  return <BoardScreen />;
};

export default JeopardyGame;
