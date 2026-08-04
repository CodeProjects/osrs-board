import type { BoardConfig, Difficulty, GameState, SpecialTile } from "../types";

export const BOARD_LIMITS = {
  minDimension: 2,
  maxDimension: 15,
  minPlayers: 1,
  maxPlayers: 5,
} as const;

const DIFFICULTY_PERCENT: Record<Difficulty, number> = {
  light: 0.1,
  moderate: 0.175,
  heavy: 0.25,
};

/** Maps a serpentine tile number (1 = bottom-left) to a top-down CSS grid position. */
export function tileToGridPosition(
  tileNumber: number,
  width: number,
  height: number,
): { row: number; col: number } {
  const rowFromBottom = Math.floor((tileNumber - 1) / width);
  const positionInRow = (tileNumber - 1) % width;
  const row = height - 1 - rowFromBottom;
  const col =
    rowFromBottom % 2 === 0 ? positionInRow : width - 1 - positionInRow;
  return { row, col };
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Randomly places chutes and ladders on the board, scaled by difficulty. */
export function generateSpecialTiles(
  config: Pick<BoardConfig, "width" | "height" | "difficulty">,
): Map<number, SpecialTile> {
  const totalTiles = config.width * config.height;
  const specialCount = Math.round(
    totalTiles * DIFFICULTY_PERCENT[config.difficulty],
  );
  const ladderCount = Math.floor(specialCount / 2);
  const chuteCount = ladderCount;

  // Start (1) and goal (totalTiles) are never a chute/ladder endpoint.
  const used = new Set<number>([1, totalTiles]);
  const specialTiles = new Map<number, SpecialTile>();

  const tryPlace = (type: SpecialTile["type"]): void => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const start = randomInt(2, totalTiles - 1);
      if (used.has(start)) continue;
      const target =
        type === "ladder" ?
          randomInt(start + 1, totalTiles)
        : randomInt(1, start - 1);
      if (used.has(target)) continue;

      used.add(start);
      used.add(target);
      specialTiles.set(start, { type, target });
      return;
    }
  };

  for (let i = 0; i < ladderCount; i++) tryPlace("ladder");
  for (let i = 0; i < chuteCount; i++) tryPlace("chute");

  return specialTiles;
}

export function createInitialGameState(config: BoardConfig): GameState {
  return {
    config,
    specialTiles: generateSpecialTiles(config),
    tokenPosition: 1,
    lastRoll: null,
  };
}
