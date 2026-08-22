import { useState } from "react";
import type { GameState } from "./types";
import { boardWidth, boardHeight, specialTiles } from "./lib/board";
import { advanceToken } from "./lib/gameplay";
import BoardPage from "./components/BoardPage";
import "./App.css";

function createInitialGameState(): GameState {
  return {
    width: boardWidth,
    height: boardHeight,
    specialTiles,
    tokenPosition: 1,
    lastRoll: null,
  };
}

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  function rollDie(): number {
    return 1 + Math.floor(Math.random() * 6);
  }

  const handleRoll = () => {
    setGameState((prev) => advanceToken(prev, rollDie()));
  };

  return (
    <div className="app-shell">
      <BoardPage gameState={gameState} onRoll={handleRoll} />
    </div>
  );
}

export default App;
