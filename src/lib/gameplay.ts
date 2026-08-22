import type { GameState } from "../types";

/** Advances the token by a roll, then resolves a chute/ladder if it lands on one. */
export function advanceToken(gameState: GameState, roll: number): GameState {
  const total = gameState.width * gameState.height;
  const moved = Math.min(gameState.tokenPosition + roll, total);
  const special = gameState.specialTiles.get(moved);
  const finalPosition = special ? special.target : moved;

  return {
    ...gameState,
    tokenPosition: finalPosition,
    lastRoll: roll,
  };
}

export function isGameWon(gameState: GameState): boolean {
  const total = gameState.width * gameState.height;
  return gameState.tokenPosition === total;
}
