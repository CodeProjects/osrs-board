export type SpecialTileType = 'chute' | 'ladder'

export interface SpecialTile {
  type: SpecialTileType
  target: number
}

export interface GameState {
  width: number
  height: number
  specialTiles: Map<number, SpecialTile>
  tokenPosition: number
  lastRoll: number | null
}
