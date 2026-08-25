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

export type TurnArrowDirection = "up" | "left" | "right";

export function getTurnArrow(
  tileNumber: number,
  width: number,
  totalTiles: number,
): TurnArrowDirection | undefined {
  if (tileNumber > 0 && tileNumber % width === 0 && tileNumber !== totalTiles) {
    return "up";
  }
  if (tileNumber > 1 && tileNumber % width === 1) {
    const rowFromBottom = Math.floor((tileNumber - 1) / width);
    return rowFromBottom % 2 === 0 ? "right" : "left";
  }
  return undefined;
}
