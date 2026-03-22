import { useState } from 'react';
import {
  STATE_KEY,
  type Category,
  type GameStatus,
  type Team,
} from './types'
import { useLocalState } from './controller'
import StartScreen from './screens/StartScreen';
import ConfigScreen from './screens/ConfigScreen';
import QuestionScreen from './screens/QuestionScreen';
import BoardScreen from './screens/BoardScreen';

const JeopardyGame = () => {
  const pointValues = [100, 200, 300, 400, 500];
  const [gameState, setGameState] = useLocalState(STATE_KEY.GAME_STATUS)<GameStatus>('start');
  const [numTeams, setNumTeams] = useState(8);
  const [categories, setCategories] = useLocalState(STATE_KEY.CATEGORY)<Category[]>([
    {
      name: 'Category 1',
      questions: pointValues.map(points => ({
        question: `Question for Category 1 - ${points}`,
        answer: `Answer for Category 1 - ${points}`,
        revealed: false
      }))
    }
  ]);

  const [teams, setTeams] = useLocalState(STATE_KEY.TEAMS)<Team[]>(
    Array(8).fill(null).map((_, i) => ({
      name: `Team ${i + 1}`,
      score: 0
    }))
  );

  const [selectedTile, setSelectedTile] = useState<{ catIndex: number, qIndex: number } | null>(null);

  if (gameState === 'start') {
    return <StartScreen teams={teams} setTeams={setTeams} numTeams={numTeams} setNumTeams={setNumTeams} setGameState={setGameState} />;
  }
  if (gameState === 'config') {
    return <ConfigScreen categories={categories} setCategories={setCategories} teams={teams} setTeams={setTeams} setGameState={setGameState} pointValues={pointValues} />;
  }
  if (gameState === 'question' && selectedTile) {
    return <QuestionScreen categories={categories} setCategories={setCategories} teams={teams} setTeams={setTeams} numTeams={numTeams} pointValues={pointValues} selectedTile={selectedTile} setSelectedTile={setSelectedTile} setGameState={setGameState} />;
  }
  return <BoardScreen categories={categories} teams={teams} setTeams={setTeams} numTeams={numTeams} pointValues={pointValues} setSelectedTile={setSelectedTile} setGameState={setGameState} />;
};

export default JeopardyGame;
