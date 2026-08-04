import './DiceRoller.css'

interface DiceRollerProps {
  lastRoll: number | null
  isWon: boolean
  onRoll: () => void
}

function DiceRoller({ lastRoll, isWon, onRoll }: DiceRollerProps) {
  if (isWon) {
    return (
      <div className="dice-roller">
        <p className="win-message">Board complete!</p>
      </div>
    )
  }

  return (
    <div className="dice-roller">
      {lastRoll !== null && <p className="last-roll">Rolled a {lastRoll}</p>}
      <button type="button" className="roll-button" onClick={onRoll}>
        Complete Goal
      </button>
    </div>
  )
}

export default DiceRoller
