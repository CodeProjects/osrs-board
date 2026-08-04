import type { GameState } from '../types'
import { tileToGridPosition } from '../lib/generateBoard'
import Tile from './Tile'
import BoardLines from './BoardLines'
import './BoardPage.css'

interface BoardPageProps {
  gameState: GameState
}

function BoardPage({ gameState }: BoardPageProps) {
  const { config, specialTiles } = gameState
  const { width, height, players } = config
  const total = width * height
  const tileNumbers = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="board-page">
      <h1>{config.name}</h1>
      <div className="board-layout">
        <div className="board-grid-wrapper">
          <div
            className="board-grid"
            style={{
              gridTemplateColumns: `repeat(${width}, 1fr)`,
              gridTemplateRows: `repeat(${height}, 1fr)`,
            }}
          >
            {tileNumbers.map((number) => {
              const { row, col } = tileToGridPosition(number, width, height)
              return (
                <Tile
                  key={number}
                  number={number}
                  special={specialTiles.get(number)}
                  row={row}
                  col={col}
                />
              )
            })}
          </div>
          <BoardLines specialTiles={specialTiles} width={width} height={height} />
        </div>
        <aside className="roster">
          <h2>Players</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}

export default BoardPage
