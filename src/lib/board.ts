import type { SpecialTile, SpecialTileType } from "../types";

export type TileType = "normal" | "ladder" | "chute";

export interface BoardTile {
  tileNumber: number;
  task?: string;
  cleanTask?: string;
  description?: string;
  type?: TileType;
  target?: number | null;
}

/** Shape of a tile as served by GET /api/game (data/board.json on the server). */
export interface RawBoardTile {
  tile_number: number;
  task?: string;
  clean_task?: string;
  description?: string;
  type?: TileType;
  target?: number | null;
}

export interface DerivedBoard {
  boardTiles: BoardTile[];
  boardWidth: number;
  boardHeight: number;
  specialTiles: Map<number, SpecialTile>;
}

function isSpecialTile(
  tile: BoardTile,
): tile is BoardTile & { type: SpecialTileType; target: number } {
  return (
    (tile.type === "ladder" || tile.type === "chute") && tile.target !== null
  );
}

/** Derives the board shapes the app needs from the raw tile array fetched from the server. */
export function deriveBoard(rawTiles: RawBoardTile[]): DerivedBoard {
  const boardTiles: BoardTile[] = rawTiles.map((tile) => ({
    tileNumber: tile.tile_number,
    task: tile.task,
    cleanTask: tile.clean_task,
    description: tile.description,
    type: tile.type,
    target: tile.target,
  }));

  const boardWidth = Math.sqrt(boardTiles.length);
  const boardHeight = boardWidth;

  const specialTiles: Map<number, SpecialTile> = new Map(
    boardTiles
      .filter(isSpecialTile)
      .map((tile) => [tile.tileNumber, { type: tile.type, target: tile.target }]),
  );

  return { boardTiles, boardWidth, boardHeight, specialTiles };
}
