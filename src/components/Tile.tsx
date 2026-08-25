import type { BoardTile } from "../lib/board";
import { getTurnArrow } from "../lib/generateBoard";
import "./Tile.css";

interface TileProps {
  tile: BoardTile;
  row?: number;
  col?: number;
  width?: number;
  totalTiles?: number;
  /** Registers this tile's DOM node so TokenMarker can align to it during animation. */
  registerRef?: (tileNumber: number, el: HTMLDivElement | null) => void;
}

const ARROW_GLYPH = { up: "↑", left: "←", right: "→" };

function Tile({ tile, row, col, width, totalTiles, registerRef }: TileProps) {
  const tileType = tile.type;
  const isSpecial = tileType === "ladder" || tileType === "chute";
  const specialClass = isSpecial ? `tile--${tileType}` : "";
  const shadeClass = tile.tileNumber % 2 === 0 ? "tile--light" : "tile--dark";
  const gridStyle =
    row !== undefined && col !== undefined ?
      { gridRow: row + 1, gridColumn: col + 1 }
    : undefined;
  const displayText =
    isSpecial ? undefined : (tile.cleanTask ?? tile.tileNumber);
  const turnArrow =
    width !== undefined && totalTiles !== undefined ?
      getTurnArrow(tile.tileNumber, width, totalTiles)
    : undefined;

  return (
    <div
      className={`tile ${shadeClass} ${specialClass}`}
      style={gridStyle}
      ref={(el) => registerRef?.(tile.tileNumber, el)}
    >
      {displayText !== undefined && (
        <span className="tile-label">{displayText}</span>
      )}
      {turnArrow && (
        <span className={`tile-arrow tile-arrow--${turnArrow}`}>
          {ARROW_GLYPH[turnArrow]}
        </span>
      )}
    </div>
  );
}

export default Tile;
