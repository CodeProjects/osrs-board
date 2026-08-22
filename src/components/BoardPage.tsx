import type { GameState } from '../types'
import { tileToGridPosition } from '../lib/generateBoard'
import { isGameWon } from '../lib/gameplay'
import Tile from './Tile'
import BoardLines from './BoardLines'
import DiceRoller from './DiceRoller'
import './BoardPage.css'

interface BoardPageProps {
  gameState: GameState
  onRoll: () => void
}

function BoardPage({ gameState, onRoll }: BoardPageProps) {
  const { width, height, specialTiles, tokenPosition, lastRoll } = gameState
  const total = width * height
  const startTile = 0
  const goalTile = total + 1
  const tileNumbers = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="board-page">
      <div className="board-row">
        <div className="board-column">
          <h1>OSRS Chutes and Ladders</h1>
          <div className="board-frame">
            <div className="board-corners">
              <Tile number={goalTile} hasToken={tokenPosition === goalTile} />
              <Tile number={startTile} hasToken={tokenPosition === startTile} />
            </div>
            <div className="board-grid-wrapper">
              <div
                className="board-grid"
                style={{
                  gridTemplateColumns: `repeat(${width}, var(--tile-size))`,
                  gridTemplateRows: `repeat(${height}, var(--tile-size))`,
                }}
              >
                {tileNumbers.map((number) => {
                  const { row, col } = tileToGridPosition(number, width, height)
                  return (
                    <Tile
                      key={number}
                      number={number}
                      special={specialTiles.get(number)}
                      hasToken={number === tokenPosition}
                      row={row}
                      col={col}
                    />
                  )
                })}
              </div>
              <BoardLines specialTiles={specialTiles} width={width} height={height} />
            </div>
          </div>
          <DiceRoller lastRoll={lastRoll} isWon={isGameWon(gameState)} onRoll={onRoll} />
        </div>
      </div>
    </div>
  )
}

export default BoardPage
