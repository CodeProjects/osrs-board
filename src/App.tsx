import { useState } from "react";
import type { BoardConfig, GameState } from "./types";
import { createInitialGameState } from "./lib/generateBoard";
import { advanceToken } from "./lib/gameplay";
import SetupPage from "./components/SetupPage";
import BoardPage from "./components/BoardPage";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [lastConfig, setLastConfig] = useState<BoardConfig | null>(null);

  const handleSetupSubmit = (config: BoardConfig) => {
    setLastConfig(config);
    setGameState(createInitialGameState(config));
  };
  function rollDie(): number {
    return 1 + Math.floor(Math.random() * 6);
  }

  const handleRoll = () => {
    setGameState((prev) => (prev ? advanceToken(prev, rollDie()) : prev));
  };

  return (
    <div className="app-shell">
      {gameState ?
        <BoardPage
          gameState={gameState}
          onRoll={handleRoll}
          onBack={() => setGameState(null)}
        />
      : <SetupPage initialConfig={lastConfig} onSubmit={handleSetupSubmit} />}
    </div>
  );
}

export default App;
