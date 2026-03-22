import { Plus, Minus } from 'lucide-react';
import type { Team } from '../types';

type ScoreBarProps = {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  numTeams: number;
  pointIncrement: number;
  className?: string;
};

const ScoreBar = ({
  teams,
  setTeams,
  numTeams,
  pointIncrement,
  className,
}: ScoreBarProps) => {
  const updateTeamScore = (teamIndex: number, change: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex].score += change * pointIncrement;
    setTeams(newTeams);
  };

  const updateTeamScoreDirect = (teamIndex: number, value: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].score = parseInt(value) || 0;
    setTeams(newTeams);
  };

  return (
    <div className={`bg-blue-950 ${className ?? ''}`}>
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
  );
};

export default ScoreBar;
