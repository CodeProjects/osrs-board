import type { SpecialTile } from '../types'
import { tileToGridPosition } from '../lib/generateBoard'
import './BoardLines.css'

interface BoardLinesProps {
  specialTiles: Map<number, SpecialTile>
  width: number
  height: number
}

function BoardLines({ specialTiles, width, height }: BoardLinesProps) {
  const connectors = [...specialTiles.entries()].map(([start, { type, target }]) => {
    const from = tileToGridPosition(start, width, height)
    const to = tileToGridPosition(target, width, height)
    return {
      type,
      x1: from.col + 0.5,
      y1: from.row + 0.5,
      x2: to.col + 0.5,
      y2: to.row + 0.5,
    }
  })

  return (
    <svg className="board-lines" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <marker
          id="arrow-ladder"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth={0.3}
          markerHeight={0.3}
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path className="arrowhead arrowhead--ladder" d="M0,0 L10,5 L0,10 Z" />
        </marker>
        <marker
          id="arrow-chute"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth={0.3}
          markerHeight={0.3}
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path className="arrowhead arrowhead--chute" d="M0,0 L10,5 L0,10 Z" />
        </marker>
      </defs>
      {connectors.map((connector, index) => (
        <g key={index} className={`board-line board-line--${connector.type}`}>
          <line
            x1={connector.x1}
            y1={connector.y1}
            x2={connector.x2}
            y2={connector.y2}
            markerEnd={`url(#arrow-${connector.type})`}
          />
          <circle cx={connector.x1} cy={connector.y1} r={0.06} />
        </g>
      ))}
    </svg>
  )
}

export default BoardLines
