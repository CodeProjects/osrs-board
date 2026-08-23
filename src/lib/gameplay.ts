import type { GameState } from "../types";

// Rolling the die and resolving chutes/ladders now happens server-side
// (osrs-board-server) so every client sees the same authoritative result.
// See src/lib/api.ts's rollToken().

export function isGameWon(gameState: GameState): boolean {
  const goal = gameState.width * gameState.height + 1;
  return gameState.tokenPosition === goal;
}
