import type { BoardTile } from "../lib/board";
import "./StatsPanel.css";

interface StatsPanelProps {
  currentTile?: BoardTile;
  lastRoll: number | null;
}

function StatsPanel({ currentTile, lastRoll }: StatsPanelProps) {
  const goalLabel = currentTile?.cleanTask ?? currentTile?.task ?? "—";

  return (
    <div className="stats-panel">
      <h2>Game Stats</h2>
      <dl className="stats-list">
        <div className="stats-row">
          <dt>Current Goal</dt>
          <dd>{goalLabel}</dd>
        </div>
        <div className="stats-row">
          <dt>Last Roll</dt>
          <dd>{lastRoll ?? "—"}</dd>
        </div>
      </dl>
    </div>
  );
}

export default StatsPanel;
