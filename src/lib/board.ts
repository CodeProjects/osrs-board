import rawTiles from '../assets/osrs_chutes_and_ladders.json'
import type { SpecialTile, SpecialTileType } from '../types'

export type TileType = 'normal' | 'ladder' | 'chute'

export interface BoardTile {
  tileNumber: number
  task: string
  cleanTask: string
  description: string
  type: TileType
  target: number | null
}

export const boardTiles: BoardTile[] = rawTiles.map((tile) => ({
  tileNumber: tile.tile_number,
  task: tile.task,
  cleanTask: tile.clean_task,
  description: tile.description,
  type: tile.type as TileType,
  target: tile.target,
}))

export const boardWidth = Math.sqrt(boardTiles.length)
export const boardHeight = boardWidth

function isSpecialTile(
  tile: BoardTile,
): tile is BoardTile & { type: SpecialTileType; target: number } {
  return (tile.type === 'ladder' || tile.type === 'chute') && tile.target !== null
}

export const specialTiles: Map<number, SpecialTile> = new Map(
  boardTiles
    .filter(isSpecialTile)
    .map((tile) => [tile.tileNumber, { type: tile.type, target: tile.target }]),
)
