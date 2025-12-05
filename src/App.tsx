import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { STATE_KEY, useLocalState } from './controller';

const JeopardyGame = () => {
  const [gameState, setGameState] = useLocalState(STATE_KEY.GAME_MODE)('start'); // 'start', 'config', 'board', 'question'

  const [numTeams, setNumTeams] = useState(8);
  const [categories, setCategories] = useLocalState(STATE_KEY.CATEGORY)([
    'Category 1'
  ]);

  const [pointValues] = useState([100, 200, 300, 400, 500]);

  const [questions, setQuestions] = useLocalState(STATE_KEY.QUESTIONS)(
    Array(1).fill(null).map((_, catIndex) =>
      Array(5).fill(null).map((_, qIndex) => ({
        question: `Question for Category ${catIndex + 1} - ${pointValues[qIndex]}`,
        answer: `Answer for Category ${catIndex + 1} - ${pointValues[qIndex]}`,
        revealed: false
      }))
    )
  );

  const [teams, setTeams] = useLocalState(STATE_KEY.TEAMS)(
    Array(8).fill(null).map((_, i) => ({
      name: `Team ${i + 1}`,
      score: 0
    }))
  );

  const [selectedTile, setSelectedTile] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleTileClick = (catIndex, qIndex) => {
    setSelectedTile({ catIndex, qIndex });
    setShowAnswer(false);
    setGameState('question');
  };

  const handleBack = () => {
    setSelectedTile(null);
    setShowAnswer(false);
    setGameState('board');
  };

  const handleRevealAnswer = () => {
    if (selectedTile) {
      setShowAnswer(true);
      const newQuestions = [...questions];
      newQuestions[selectedTile.catIndex][selectedTile.qIndex].revealed = true;
      setQuestions(newQuestions);
    }
  };

  const resetGame = () => {
    setGameState('start')
    // nuke points on teams
    if (questions) {
      questions.forEach(qSet => qSet.forEach(question => question.revealed = false));
      setQuestions(questions);
    }
    // nuke revealed state
    if (teams) {
      setTeams(teams.map(old => ({
        ...old,
        score: 0
      })));
    }
  }

  const updateTeamScore = (teamIndex, change, defaultPoints = 100) => {
    const newTeams = [...teams];
    let points = defaultPoints
    if (selectedTile) {
      points = pointValues[selectedTile.qIndex];
    }
    newTeams[teamIndex].score += change * points;
    setTeams(newTeams);
  };

  const updateTeamScoreDirect = (teamIndex, value) => {
    const newTeams = [...teams];
    newTeams[teamIndex].score = parseInt(value);
    setTeams(newTeams);
  };

  const updateCategoryName = (index, name) => {
    const newCategories = [...categories];
    newCategories[index] = name;
    setCategories(newCategories);
  };

  const addCategory = () => {
    const newCategories = [...categories, `Category ${categories.length + 1}`];
    setCategories(newCategories); ``

    const newQuestions = [...questions];
    newQuestions.push(
      Array(5).fill(null).map((_, qIndex) => ({
        question: `Question for Category ${newCategories.length} - ${pointValues[qIndex]}`,
        answer: `Answer for Category ${newCategories.length} - ${pointValues[qIndex]}`,
        revealed: false
      }))
    );
    setQuestions(newQuestions);
  };

  const removeCategory = (index) => {
    if (categories.length > 1) {
      const newCategories = categories.filter((_, i) => i !== index);
      setCategories(newCategories);

      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const updateQuestion = (catIndex, qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[catIndex][qIndex][field] = value;
    setQuestions(newQuestions);
  };

  const updateTeamName = (index, name) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const handleNumTeamsChange = (num) => {
    const newNum = Math.max(1, Math.min(8, num));
    setNumTeams(newNum);

    const newTeams = Array(8).fill(null).map((_, i) => {
      if (i < teams.length) {
        return teams[i];
      }
      return { name: `Team ${i + 1}`, score: 0 };
    });
    setTeams(newTeams);
  };

  const startGame = () => {
    setGameState('board');
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'question' && selectedTile) {
        if (e.key === 'Escape') {
          handleBack();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          handleRevealAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedTile]);

  // Start Screen
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full bg-blue-800 rounded-lg p-8 shadow-2xl">
          <h1 className="text-6xl font-bold text-yellow-400 text-center mb-12">JEOPARDY!</h1>

          <div className="mb-8">
            <label className="text-white text-xl font-bold mb-4 block">Number of Teams (1-8)</label>
            <input
              type="number"
              min="1"
              max="8"
              value={numTeams}
              onChange={(e) => handleNumTeamsChange(parseInt(e.target.value))}
              className="w-full p-4 rounded bg-blue-700 text-white text-2xl border-2 border-blue-600 text-center font-bold"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-white text-xl font-bold mb-4">Team Names</h2>
            <div className="grid grid-cols-2 gap-4">
              {teams.slice(0, numTeams).map((team, i) => (
                <input
                  key={i}
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeamName(i, e.target.value)}
                  className="p-3 rounded bg-blue-700 text-white border-2 border-blue-600"
                  placeholder={`Team ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setGameState('config')}
              className="flex-1 bg-yellow-500 text-blue-900 px-8 py-4 rounded-lg font-bold text-xl hover:bg-yellow-400"
            >
              Configure Questions
            </button>
            <button
              onClick={startGame}
              className="flex-1 bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-green-500"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Config Screen
  if (gameState === 'config') {
    return (
      <div className="min-h-screen bg-blue-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Configure Game</h1>
            <div className="flex gap-4">
              <button
                onClick={() => resetGame()}
                className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-500"
              >
                Reset game
              </button>
              <button
                onClick={startGame}
                className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-500"
              >
                Start or Resume Game
              </button>
            </div>
          </div>

          <div className="bg-blue-800 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Categories ({categories.length})</h2>
              <button
                onClick={addCategory}
                className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-500 flex items-center gap-2"
              >
                <Plus size={20} /> Add Category
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={cat}
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
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{cat}</h3>
                {pointValues.map((points, qIndex) => (
                  <div key={qIndex} className="mb-4 bg-blue-700 p-4 rounded">
                    <p className="text-white font-bold mb-2">{points} Points</p>
                    <input
                      type="text"
                      value={questions[catIndex][qIndex].question}
                      onChange={(e) => updateQuestion(catIndex, qIndex, 'question', e.target.value)}
                      className="w-full p-2 mb-2 rounded bg-blue-600 text-white border border-blue-500"
                      placeholder="Question"
                    />
                    <input
                      type="text"
                      value={questions[catIndex][qIndex].answer}
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
  }

  // Question Screen
  if (gameState === 'question' && selectedTile !== null) {
    const { catIndex, qIndex } = selectedTile;
    const tile = questions[catIndex][qIndex];

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
            {categories[catIndex]} for {pointValues[qIndex]}
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
            <p className="text-white text-6xl mb-8">{tile.question}</p>
            {showAnswer && (
              <p className="text-yellow-400 text-5xl mt-8 animate-fadeIn">{tile.answer}</p>
            )}
          </div>
        </div>

        <div className="bg-blue-950 p-4">
          <div className="grid gap-4 max-w-7xl mx-auto" style={{ gridTemplateColumns: `repeat(${numTeams}, minmax(0, 1fr))` }}>
            {teams.slice(0, numTeams).map((team, i) => (
              <div key={i} className="text-center">
                <div className="bg-white px-4 py-2 rounded mb-2">
                  <p className="font-bold text-2xl">{team.name}</p>
                  <input
                    type="number"
                    value={team.score}
                    onChange={(e) => updateTeamScoreDirect(i, e.target.value)}
                    className="text-2xl text-blue-900 font-bold w-full text-center border-2 border-blue-200 rounded px-2"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => updateTeamScore(i, 1)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => updateTeamScore(i, -1)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    <Minus size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Board Screen
  return (
    <div className="min-h-screen bg-blue-900 p-8">
      <div className="max-w-none mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white">JEOPARDY!</h1>
          <button
            onClick={() => setGameState('config')}
            className="bg-yellow-500 text-blue-900 px-6 py-3 rounded font-bold hover:bg-yellow-400"
          >
            Configure Game
          </button>
        </div>

        <div className="grid gap-2 mb-8" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
          {categories.map((cat, i) => (
            <div key={i} className="bg-blue-700 p-4 text-center">
              <p className="text-white font-bold text-sm uppercase">{cat}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-2 mb-8" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
          {categories.map((cat, catIndex) => (
            <div key={catIndex} className="flex flex-col gap-2">
              {pointValues.map((points, qIndex) => {
                const tile = questions[catIndex][qIndex];
                return (
                  <button
                    key={qIndex}
                    onClick={() => handleTileClick(catIndex, qIndex)}
                    className={`${tile.revealed ? 'bg-blue-950' : 'bg-blue-600 hover:bg-blue-500'
                      } p-8 rounded text-yellow-400 text-3xl font-bold transition-colors`}
                  >
                    {points}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="bg-blue-950 p-6 rounded-lg">
          <div className="grid gap-4 max-w-7xl mx-auto" style={{ gridTemplateColumns: `repeat(${numTeams}, minmax(0, 1fr))` }}>
            {teams.slice(0, numTeams).map((team, i) => (
              <div key={i} className="text-center">
                <div className="bg-white px-4 py-2 rounded mb-2">
                  <p className="font-bold text-2xl">{team.name}</p>
                  <input
                    type="number"
                    value={team.score}
                    onChange={(e) => updateTeamScoreDirect(i, e.target.value)}
                    className="text-2xl text-blue-900 font-bold w-full text-center border-2 border-blue-200 rounded px-2"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => updateTeamScore(i, 1)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => updateTeamScore(i, -1)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    <Minus size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JeopardyGame;