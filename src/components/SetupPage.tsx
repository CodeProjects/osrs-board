import { useState, type SubmitEvent } from "react";
import type { BoardConfig, Difficulty } from "../types";
import { BOARD_LIMITS } from "../lib/generateBoard";
import "./SetupPage.css";

interface SetupPageProps {
  onSubmit: (config: BoardConfig) => void;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "heavy", label: "Heavy" },
];

function SetupPage({ onSubmit }: SetupPageProps) {
  const [name, setName] = useState("");
  const [width, setWidth] = useState(6);
  const [height, setHeight] = useState(6);
  const [difficulty, setDifficulty] = useState<Difficulty>("moderate");
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);

  const canAddPlayer = players.length < BOARD_LIMITS.maxPlayers;
  const canRemovePlayer = players.length > BOARD_LIMITS.minPlayers;

  const updatePlayerName = (index: number, value: string) => {
    setPlayers((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addPlayer = () => {
    if (canAddPlayer) setPlayers((prev) => [...prev, ""]);
  };

  const removePlayer = (index: number) => {
    if (canRemovePlayer)
      setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedPlayers = players.map((p) => p.trim());
    const { minDimension, maxDimension } = BOARD_LIMITS;

    if (!trimmedName) {
      setError("Give the board a name.");
      return;
    }
    if (
      width < minDimension ||
      width > maxDimension ||
      height < minDimension ||
      height > maxDimension
    ) {
      setError(
        `Width and height must be between ${minDimension} and ${maxDimension}.`,
      );
      return;
    }
    if (trimmedPlayers.some((p) => !p)) {
      setError("Every player needs a name.");
      return;
    }

    setError(null);
    onSubmit({
      name: trimmedName,
      width,
      height,
      difficulty,
      players: trimmedPlayers,
    });
  };

  return (
    <form className="setup-page" onSubmit={handleSubmit}>
      <h1>Set Up</h1>

      <label className="field">
        <span>Board name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Width</span>
          <input
            type="number"
            min={BOARD_LIMITS.minDimension}
            max={BOARD_LIMITS.maxDimension}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Height</span>
          <input
            type="number"
            min={BOARD_LIMITS.minDimension}
            max={BOARD_LIMITS.maxDimension}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
      </div>

      <fieldset className="field">
        <legend>Chutes & Ladders</legend>
        <div className="difficulty-options">
          {DIFFICULTY_OPTIONS.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="difficulty"
                value={option.value}
                checked={difficulty === option.value}
                onChange={() => setDifficulty(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>Players</legend>
        {players.map((player, index) => (
          <div className="player-row" key={index}>
            <input
              type="text"
              value={player}
              placeholder={`Player ${index + 1}`}
              maxLength={20}
              onChange={(e) => updatePlayerName(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removePlayer(index)}
              disabled={!canRemovePlayer}
              aria-label={`Remove player ${index + 1}`}
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-player"
          onClick={addPlayer}
          disabled={!canAddPlayer}
        >
          + Add player
        </button>
      </fieldset>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="start-button">
        Create Board
      </button>
    </form>
  );
}

export default SetupPage;
