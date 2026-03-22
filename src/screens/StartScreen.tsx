import React from 'react';
import type { GameStatus, Team } from '../types';

type StartScreenProps = {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  numTeams: number;
  setNumTeams: (n: number) => void;
  setGameState: (state: GameStatus) => void;
};

const StartScreen = ({ teams, setTeams, numTeams, setNumTeams, setGameState }: StartScreenProps) => {
  const handleNumTeamsChange = (num: number) => {
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

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  };

  const startGame = () => {
    setGameState('board');
  };

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
};

export default StartScreen;
