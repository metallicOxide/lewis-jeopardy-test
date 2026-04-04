import { useEffect } from "react";
import { useGameStore } from "./controller";
import StartScreen from "./screens/StartScreen";
import ConfigScreen from "./screens/ConfigScreen";
import QuestionScreen from "./screens/QuestionScreen";
import BoardScreen from "./screens/BoardScreen";
import { cleanupExpiredImages } from "./supabase/imageUpload";

const JeopardyGame = () => {
  const gameState = useGameStore((s) => s.gameState);

  // HACK - THIS IS GOD_MODE delete used to delete all images > 30 days old for cost saving
  // Should ideally be done on a backend function but I don't want to spend money
  // on a server
  useEffect(() => {
    cleanupExpiredImages();
  }, []);
  const selectedTile = useGameStore((s) => s.selectedTile);

  if (gameState === "start") return <StartScreen />;
  if (gameState === "config") return <ConfigScreen />;
  if (gameState === "question" && selectedTile) return <QuestionScreen />;
  return <BoardScreen />;
};

export default JeopardyGame;
