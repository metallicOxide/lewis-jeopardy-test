import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { type Category, type GameStatus, type Team } from '../types';
import { importQuestionsFromCSV } from '../importer';

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
      questions: pointValues.map(points => ({
        question: `Question for Category ${categories.length + 1} - ${points}`,
        answer: `Answer for Category ${categories.length + 1} - ${points}`,
        revealed: false
      }))
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      const newCategories = categories.filter((_, i) => i !== index);
      setCategories(newCategories);
    }
  };

  const updateQuestion = (catIndex: number, qIndex: number, field: 'question' | 'answer', value: string) => {
    const newCategories = [...categories];
    newCategories[catIndex].questions[qIndex][field] = value;
    setCategories(newCategories);
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedCategories = await importQuestionsFromCSV(file, pointValues);
      setCategories(importedCategories);
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert(`Error importing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const resetGame = () => {
    setGameState('start');
    const newCategories = categories.map(cat => ({
      ...cat,
      questions: cat.questions.map(q => ({ ...q, revealed: false }))
    }));
    setCategories(newCategories);

    const newTeams = teams.map(team => ({ ...team, score: 0 }));
    setTeams(newTeams);
  };

  return (
    <div className="min-h-screen bg-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Configure Game</h1>
          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-500"
            >
              Reset game
            </button>
            <button
              onClick={() => setGameState('board')}
              className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-500"
            >
              Start or Resume Game
            </button>
          </div>
        </div>

        <div className="bg-blue-800 p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Categories ({categories.length})</h2>
            <div className="flex gap-2">
              <label className="bg-orange-600 text-white px-4 py-2 rounded font-bold hover:bg-orange-500 flex items-center gap-2 cursor-pointer">
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
                className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-500 flex items-center gap-2"
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
                  className="flex-1 p-3 rounded bg-blue-700 text-white border-2 border-blue-600"
                  placeholder={`Category ${i + 1}`}
                />
                {categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(i)}
                    className="bg-gray-600 text-white px-3 rounded hover:bg-gray-500"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Questions & Answers</h2>
          {categories.map((cat, catIndex) => (
            <div key={catIndex} className="mb-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">{cat.name}</h3>
              {cat.questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-4 bg-blue-700 p-4 rounded">
                  <p className="text-white font-bold mb-2">{pointValues[qIndex]} Points</p>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => updateQuestion(catIndex, qIndex, 'question', e.target.value)}
                    className="w-full p-2 mb-2 rounded bg-blue-600 text-white border border-blue-500"
                    placeholder="Question"
                  />
                  <input
                    type="text"
                    value={question.answer}
                    onChange={(e) => updateQuestion(catIndex, qIndex, 'answer', e.target.value)}
                    className="w-full p-2 rounded bg-blue-600 text-white border border-blue-500"
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
