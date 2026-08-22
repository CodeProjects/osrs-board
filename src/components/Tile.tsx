import type { SpecialTile } from '../types'
import helmetIcon from '../assets/helmet icon.png'
import './Tile.css'

interface TileProps {
  number: number
  special?: SpecialTile
  hasToken?: boolean
  row: number
  col: number
}

function Tile({ number, special, hasToken, row, col }: TileProps) {
  const specialClass = special ? `tile--${special.type}` : ''
  const shadeClass = number % 2 === 0 ? 'tile--light' : 'tile--dark'

  return (
    <div
      className={`tile ${shadeClass} ${specialClass}`}
      style={{ gridRow: row + 1, gridColumn: col + 1 }}
    >
      <span className="tile-number">{number}</span>
      {hasToken && <img className="token" src={helmetIcon} alt="Team token" />}
    </div>
  )
}

export default Tile
