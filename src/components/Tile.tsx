import type { SpecialTile } from '../types'
import './Tile.css'

interface TileProps {
  number: number
  special?: SpecialTile
  row: number
  col: number
}

function Tile({ number, special, row, col }: TileProps) {
  const specialClass = special ? `tile--${special.type}` : ''

  return (
    <div
      className={`tile ${specialClass}`}
      style={{ gridRow: row + 1, gridColumn: col + 1 }}
    >
      <span className="tile-number">{number}</span>
      {special && (
        <span className="tile-special">
          {special.type === 'ladder' ? '▲' : '▼'} {special.target}
        </span>
      )}
    </div>
  )
}

export default Tile
