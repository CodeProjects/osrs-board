import type { GameState } from "../types";

/** Advances the token by a roll, then resolves a chute/ladder if it lands on one. */
export function advanceToken(gameState: GameState, roll: number): GameState {
  const goal = gameState.width * gameState.height + 1;
  const moved = Math.min(gameState.tokenPosition + roll, goal);
  const special = gameState.specialTiles.get(moved);
  const finalPosition = special ? special.target : moved;

  return {
    ...gameState,
    tokenPosition: finalPosition,
    lastRoll: roll,
  };
}

export function isGameWon(gameState: GameState): boolean {
  const goal = gameState.width * gameState.height + 1;
  return gameState.tokenPosition === goal;
}
