import React, { useState, useEffect } from 'react';
import type { Category, GameStatus, Team } from '../types';
import ScoreBar from '../components/ScoreBar';

type QuestionScreenProps = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  numTeams: number;
  pointValues: number[];
  selectedTile: { catIndex: number; qIndex: number };
  setSelectedTile: (tile: { catIndex: number; qIndex: number } | null) => void;
  setGameState: (state: GameStatus) => void;
};

const QuestionScreen = ({
  categories,
  setCategories,
  teams,
  setTeams,
  numTeams,
  pointValues,
  selectedTile,
  setSelectedTile,
  setGameState,
}: QuestionScreenProps) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const { catIndex, qIndex } = selectedTile;
  const category = categories[catIndex];
  const question = category.questions[qIndex];

  const handleBack = () => {
    setSelectedTile(null);
    setShowAnswer(false);
    setGameState('board');
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    const newCategories = [...categories];
    newCategories[catIndex].questions[qIndex].revealed = true;
    setCategories(newCategories);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleRevealAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTile]);

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col">
      <div className="bg-blue-950 p-4 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-white text-lg hover:text-yellow-400"
        >
          Continue <span className="ml-2 px-3 py-1 bg-gray-700 rounded">ESC</span>
        </button>
        <h2 className="text-white text-2xl font-bold">
          {category.name} for {pointValues[qIndex]}
        </h2>
        <button
          onClick={handleRevealAnswer}
          className="text-white text-lg hover:text-yellow-400"
        >
          Reveal Correct Response <span className="ml-2 px-3 py-1 bg-gray-700 rounded">Spacebar</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-white text-6xl mb-8">{question.question}</p>
          {showAnswer && (
            <p className="text-yellow-400 text-5xl mt-8 animate-fadeIn">{question.answer}</p>
          )}
        </div>
      </div>

      <ScoreBar
        teams={teams}
        setTeams={setTeams}
        numTeams={numTeams}
        pointIncrement={pointValues[qIndex]}
        className="p-4"
      />
    </div>
  );
};

export default QuestionScreen;
