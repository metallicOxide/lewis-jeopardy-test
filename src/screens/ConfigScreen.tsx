import React from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { type Category, type GameStatus, type Team } from "../types";
import { importQuestionsFromCSV } from "../importer";

type ConfigScreenProps = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  setGameState: (state: GameStatus) => void;
  pointValues: number[];
};

const ConfigScreen = ({
  categories,
  setCategories,
  teams,
  setTeams,
  setGameState,
  pointValues,
}: ConfigScreenProps) => {
  const updateCategoryName = (index: number, name: string) => {
    const newCategories = [...categories];
    newCategories[index].name = name;
    setCategories(newCategories);
  };

  const addCategory = () => {
    const newCategory: Category = {
      name: `Category ${categories.length + 1}`,
      questions: pointValues.map((points) => ({
        question: `Question for Category ${categories.length + 1} - ${points}`,
        answer: `Answer for Category ${categories.length + 1} - ${points}`,
        revealed: false,
      })),
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      const newCategories = categories.filter((_, i) => i !== index);
      setCategories(newCategories);
    }
  };

  const updateQuestion = (
    catIndex: number,
    qIndex: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const newCategories = [...categories];
    newCategories[catIndex].questions[qIndex][field] = value;
    setCategories(newCategories);
  };

  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedCategories = await importQuestionsFromCSV(
        file,
        pointValues,
      );
      setCategories(importedCategories);
    } catch (error) {
      console.error("Error importing CSV:", error);
      alert(
        `Error importing CSV: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const resetGame = () => {
    setGameState("start");
    const newCategories = categories.map((cat) => ({
      ...cat,
      questions: cat.questions.map((q) => ({ ...q, revealed: false })),
    }));
    setCategories(newCategories);

    const newTeams = teams.map((team) => ({ ...team, score: 0 }));
    setTeams(newTeams);
  };

  return (
    <div className="min-h-screen bg-blue-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Configure Game</h1>
          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="rounded bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500"
            >
              Reset game
            </button>
            <button
              onClick={() => setGameState("board")}
              className="rounded bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-500"
            >
              Start or Resume Game
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-blue-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Categories ({categories.length})
            </h2>
            <div className="flex gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-500">
                <Upload size={20} /> Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={addCategory}
                className="flex items-center gap-2 rounded bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-500"
              >
                <Plus size={20} /> Add Category
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategoryName(i, e.target.value)}
                  className="flex-1 rounded border-2 border-blue-600 bg-blue-700 p-3 text-white"
                  placeholder={`Category ${i + 1}`}
                />
                {categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(i)}
                    className="rounded bg-gray-600 px-3 text-white hover:bg-gray-500"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-blue-800 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Questions & Answers
          </h2>
          {categories.map((cat, catIndex) => (
            <div key={catIndex} className="mb-6">
              <h3 className="mb-3 text-xl font-bold text-yellow-400">
                {cat.name}
              </h3>
              {cat.questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-4 rounded bg-blue-700 p-4">
                  <p className="mb-2 font-bold text-white">
                    {pointValues[qIndex]} Points
                  </p>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(
                        catIndex,
                        qIndex,
                        "question",
                        e.target.value,
                      )
                    }
                    className="mb-2 w-full rounded border border-blue-500 bg-blue-600 p-2 text-white"
                    placeholder="Question"
                  />
                  <input
                    type="text"
                    value={question.answer}
                    onChange={(e) =>
                      updateQuestion(catIndex, qIndex, "answer", e.target.value)
                    }
                    className="w-full rounded border border-blue-500 bg-blue-600 p-2 text-white"
                    placeholder="Answer"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
