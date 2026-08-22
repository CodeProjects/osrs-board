import { useState } from "react";
import type { GameState } from "./types";
import { advanceToken } from "./lib/gameplay";
import BoardPage from "./components/BoardPage";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  function rollDie(): number {
    return 1 + Math.floor(Math.random() * 6);
  }

  const handleRoll = () => {
    setGameState((prev) => (prev ? advanceToken(prev, rollDie()) : prev));
  };

  return (
    <div className="app-shell">
      {gameState && (
        <BoardPage
          gameState={gameState}
          onRoll={handleRoll}
          onBack={() => setGameState(null)}
        />
      )}
    </div>
  );
}

export default App;
