export type Difficulty = 'light' | 'moderate' | 'heavy'

export interface BoardConfig {
  name: string
  width: number
  height: number
  difficulty: Difficulty
  players: string[]
}

export type SpecialTileType = 'chute' | 'ladder'

export interface SpecialTile {
  type: SpecialTileType
  target: number
}

export interface GameState {
  config: BoardConfig
  specialTiles: Map<number, SpecialTile>
  tokenPosition: number
  lastRoll: number | null
}
