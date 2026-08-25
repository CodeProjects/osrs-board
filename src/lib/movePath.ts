import type { SpecialTile } from "../types";

export type PathSegment = "walk" | "chute" | "ladder";

export interface PathStep {
  tileNumber: number;
  /** How the token arrives at this step: one tile at a time, or sliding down/up a special tile. */
  segment: PathSegment;
}

/**
 * Builds the tile-by-tile route the token travels for a single roll, mirroring the
 * server's advanceToken() resolution (osrs-board-server/src/gameplay.js) so the
 * animation always lands where the server says it should.
 *
 * The returned path always starts with `from` (the token's resting tile, not animated)
 * followed by one "walk" step per tile crossed, and — if the roll lands on a chute or
 * ladder — a final step for the tile it deposits the token on.
 */
export function buildMovePath({
  from,
  roll,
  specialTiles,
  goal,
}: {
  from: number;
  roll: number;
  specialTiles: Map<number, SpecialTile>;
  goal: number;
}): PathStep[] {
  const landed = Math.min(from + roll, goal);
  const path: PathStep[] = [{ tileNumber: from, segment: "walk" }];

  for (let tile = from + 1; tile <= landed; tile++) {
    path.push({ tileNumber: tile, segment: "walk" });
  }

  const special = specialTiles.get(landed);
  if (special) {
    path.push({ tileNumber: special.target, segment: special.type });
  }

  return path;
}
