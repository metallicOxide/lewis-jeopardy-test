import { useState, useEffect } from "react";
import ScoreBar from "../components/ScoreBar";
import MediaDisplay from "../components/MediaDisplay";
import { useGameStore } from "../controller";

const QuestionScreen = () => {
  const categories = useGameStore((s) => s.categories);
  const setCategories = useGameStore((s) => s.setCategories);
  const pointValues = useGameStore((s) => s.pointValues);
  const selectedTile = useGameStore((s) => s.selectedTile);
  const setSelectedTile = useGameStore((s) => s.setSelectedTile);
  const setGameState = useGameStore((s) => s.setGameState);

  const [showAnswer, setShowAnswer] = useState(false);

  const { catIndex, qIndex } = selectedTile!;
  const category = categories[catIndex];
  const question = category.questions[qIndex];

  const handleBack = () => {
    setSelectedTile(null);
    setShowAnswer(false);
    setGameState("board");
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    const newCategories = [...categories];
    newCategories[catIndex].questions[qIndex].revealed = true;
    setCategories(newCategories);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleBack();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        handleRevealAnswer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTile]);

  return (
    <div className="flex min-h-screen flex-col bg-blue-900">
      <div className="flex items-center justify-between bg-blue-950 p-4">
        <button
          onClick={handleBack}
          className="text-lg text-white hover:text-yellow-400"
        >
          Continue{" "}
          <span className="ml-2 rounded bg-gray-700 px-3 py-1">ESC</span>
        </button>
        <h2 className="text-2xl font-bold text-white">
          {category.name} for {pointValues[qIndex]}
        </h2>
        <button
          onClick={handleRevealAnswer}
          className="text-lg text-white hover:text-yellow-400"
        >
          Reveal Correct Response{" "}
          <span className="ml-2 rounded bg-gray-700 px-3 py-1">Spacebar</span>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          {question.question.text && (
            <p className="mb-8 text-6xl text-white">{question.question.text}</p>
          )}
          {question.question.media && (
            <MediaDisplay
              media={question.question.media}
              enlargeable
              className="mx-auto mb-6 flex justify-center"
            />
          )}
          {showAnswer && (
            <div className="animate-fadeIn mt-8">
              {question.answer.text && (
                <p className="mb-8 text-5xl text-yellow-400">
                  {question.answer.text}
                </p>
              )}
              {question.answer.media && (
                <MediaDisplay
                  media={question.answer.media}
                  enlargeable
                  className="mx-auto mb-4"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <ScoreBar pointIncrement={pointValues[qIndex]} className="p-4" />
    </div>
  );
};

export default QuestionScreen;
