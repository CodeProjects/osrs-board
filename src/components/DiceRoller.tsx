import "./DiceRoller.css";

interface DiceRollerProps {
  lastRoll: number | null;
  isWon: boolean;
  isAnimating?: boolean;
  onRoll: () => void;
  onRefresh: () => void;
  onReset: () => void;
}

function DiceRoller({
  lastRoll,
  isWon,
  isAnimating,
  onRoll,
  onRefresh,
  onReset,
}: DiceRollerProps) {
  if (isWon) {
    return (
      <div className="dice-roller">
        <p className="win-message">Board complete!</p>
        <button type="button" className="roll-button" onClick={onReset}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="dice-roller">
      {lastRoll !== null && <p className="last-roll">Rolled a {lastRoll}</p>}
      <button
        type="button"
        className="roll-button"
        onClick={onRoll}
        disabled={isAnimating}
      >
        {lastRoll ? "Complete Goal" : "Start Game"}
      </button>
      <button
        type="button"
        className="refresh-button"
        onClick={onRefresh}
        disabled={isAnimating}
      >
        Refresh
      </button>
    </div>
  );
}

export default DiceRoller;
