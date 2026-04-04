import { useEffect } from "react";
import { useGameStore } from "./controller";
import RoleSelectScreen from "./screens/RoleSelectScreen";
import StartScreen from "./screens/StartScreen";
import ConfigScreen from "./screens/ConfigScreen";
import QuestionScreen from "./screens/QuestionScreen";
import BoardScreen from "./screens/BoardScreen";
import PlayerJoinScreen from "./screens/PlayerJoinScreen";
import PlayerGameScreen from "./screens/PlayerGameScreen";
import { SideEffects } from "./controller/side-effects";

const JeopardyGame = () => {
  const gameState = useGameStore((s) => s.gameState);
  const role = useGameStore((s) => s.role);

  const selectedTile = useGameStore((s) => s.selectedTile);

  if (gameState === "role-select") return <RoleSelectScreen />;

  // Player flow
  if (role === "player") {
    if (gameState === "start") return <PlayerJoinScreen />;
    return <PlayerGameScreen />;
  }

  // Host flow
  if (gameState === "start") return <StartScreen />;
  if (gameState === "config") return <ConfigScreen />;
  if (gameState === "question" && selectedTile) return <QuestionScreen />;
  return <BoardScreen />;
};

export const App = () => {
  return (
    <>
      <SideEffects />
      <JeopardyGame />
    </>
  );
};
