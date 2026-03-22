import { Plus, Minus } from "lucide-react";
import type { Team } from "../types";

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
    <div className={`bg-blue-950 ${className ?? ""}`}>
      <div
        className="mx-auto grid max-w-7xl gap-4"
        style={{ gridTemplateColumns: `repeat(${numTeams}, minmax(0, 1fr))` }}
      >
        {teams.slice(0, numTeams).map((team, i) => (
          <div key={i} className="text-center">
            <div className="mb-2 rounded bg-white px-4 py-2">
              <p className="text-2xl font-bold">{team.name}</p>
              <input
                type="number"
                value={team.score}
                onChange={(e) => updateTeamScoreDirect(i, e.target.value)}
                className="w-full rounded border-2 border-blue-200 px-2 text-center text-2xl font-bold text-blue-900"
              />
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => updateTeamScore(i, 1)}
                className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-500"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => updateTeamScore(i, -1)}
                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-500"
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
