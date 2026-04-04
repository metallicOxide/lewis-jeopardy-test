import { useState } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useGameStore } from "../controller";
import ConfirmModal from "./ConfirmModal";
import type { BuzzEntry } from "../types";

type ScoreBarProps = {
  pointIncrement: number;
  className?: string;
  buzzOrder?: BuzzEntry[];
  onRemoveTeam?: (id: string) => void;
};

const ScoreBar = ({
  pointIncrement,
  className,
  buzzOrder = [],
  onRemoveTeam,
}: ScoreBarProps) => {
  const teams = useGameStore((s) => s.teams);
  const setTeams = useGameStore((s) => s.setTeams);
  const [confirmRemove, setConfirmRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
        style={{
          gridTemplateColumns: `repeat(${teams.length}, minmax(0, 1fr))`,
        }}
      >
        {teams.map((team, i) => {
          const buzzPos =
            buzzOrder.findIndex((b) => b.playerId === team.id) + 1;
          return (
            <div key={team.id} className="text-center">
              <div className="mb-2 rounded bg-white px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold">{team.name}</p>
                  {buzzPos > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                      #{buzzPos}
                    </span>
                  )}
                  {onRemoveTeam && (
                    <button
                      onClick={() =>
                        setConfirmRemove({ id: team.id, name: team.name })
                      }
                      className="ml-auto rounded p-1 text-red-500 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
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
          );
        })}
      </div>

      {confirmRemove && (
        <ConfirmModal
          title="Remove Player"
          message={`Are you sure you want to remove "${confirmRemove.name}" from the game?`}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          onConfirm={() => {
            onRemoveTeam?.(confirmRemove.id);
            setConfirmRemove(null);
          }}
          onCancel={() => setConfirmRemove(null)}
        />
      )}
    </div>
  );
};

export default ScoreBar;
