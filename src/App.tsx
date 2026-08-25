import { useEffect, useState } from "react";
import type { GameState } from "./types";
import type { BoardTile } from "./lib/board";
import { deriveBoard } from "./lib/board";
import type { PathStep } from "./lib/movePath";
import { buildMovePath } from "./lib/movePath";
import { fetchGameState, resetToken, rollToken } from "./lib/api";
import BoardPage from "./components/BoardPage";
import "./App.css";

type Status = "loading" | "ready" | "error";

function App() {
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [movePath, setMovePath] = useState<PathStep[] | null>(null);
  const [moveId, setMoveId] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchGameState()
      .then(({ tiles, tokenPosition, lastRoll }) => {
        if (cancelled) return;
        const derived = deriveBoard(tiles);
        setBoardTiles(derived.boardTiles);
        setGameState({
          width: derived.boardWidth,
          height: derived.boardHeight,
          specialTiles: derived.specialTiles,
          tokenPosition,
          lastRoll,
        });
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load game state:", err);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRoll = async () => {
    if (!gameState || movePath) return;
    const from = gameState.tokenPosition;
    try {
      const { tokenPosition, lastRoll } = await rollToken();
      if (lastRoll !== null) {
        const goal = gameState.width * gameState.height + 1;
        setMovePath(
          buildMovePath({
            from,
            roll: lastRoll,
            specialTiles: gameState.specialTiles,
            goal,
          }),
        );
        setMoveId((id) => id + 1);
      }
      setGameState((prev) => prev && { ...prev, tokenPosition, lastRoll });
    } catch (err) {
      console.error("Failed to roll:", err);
    }
  };

  const handleTokenSettle = () => setMovePath(null);

  const handleRefresh = async () => {
    try {
      const { tokenPosition, lastRoll } = await fetchGameState();
      setMovePath(null);
      setGameState((prev) => prev && { ...prev, tokenPosition, lastRoll });
    } catch (err) {
      console.error("Failed to refresh game state:", err);
    }
  };

  const handleReset = async () => {
    try {
      const { tokenPosition, lastRoll } = await resetToken();
      setMovePath(null);
      setGameState((prev) => prev && { ...prev, tokenPosition, lastRoll });
    } catch (err) {
      console.error("Failed to reset game state:", err);
    }
  };

  return (
    <div className="app-shell">
      {status === "loading" && <p className="status-message">Loading board…</p>}
      {status === "error" && (
        <p className="status-message status-message--error">
          Couldn't reach the game server. Is osrs-board-server running?
        </p>
      )}
      {status === "ready" && gameState && (
        <BoardPage
          gameState={gameState}
          movePath={movePath}
          moveId={moveId}
          onRoll={handleRoll}
          onRefresh={handleRefresh}
          onReset={handleReset}
          onTokenSettle={handleTokenSettle}
          boardTiles={boardTiles}
        />
      )}
    </div>
  );
}

export default App;
