import type { SpecialTile } from '../types'
import helmetIcon from '../assets/helmet icon.png'
import './Tile.css'

interface TileProps {
  number: number
  label?: string
  special?: SpecialTile
  hasToken?: boolean
  row?: number
  col?: number
}

function Tile({ number, label, special, hasToken, row, col }: TileProps) {
  const specialClass = special ? `tile--${special.type}` : ''
  const shadeClass = number % 2 === 0 ? 'tile--light' : 'tile--dark'
  const gridStyle =
    row !== undefined && col !== undefined
      ? { gridRow: row + 1, gridColumn: col + 1 }
      : undefined
  const displayText = special ? undefined : (label ?? number)

  return (
    <div className={`tile ${shadeClass} ${specialClass}`} style={gridStyle}>
      {displayText !== undefined && <span className="tile-label">{displayText}</span>}
      {hasToken && <img className="token" src={helmetIcon} alt="Team token" />}
    </div>
  )
}

export default Tile
