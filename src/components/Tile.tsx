import type { BoardTile } from "../lib/board";
import { getTurnArrow } from "../lib/generateBoard";
import helmetIcon from "../assets/helmet icon.png";
import "./Tile.css";

interface TileProps {
  tile: BoardTile;
  hasToken?: boolean;
  row?: number;
  col?: number;
  width?: number;
  totalTiles?: number;
}

const ARROW_GLYPH = { up: "↑", left: "←", right: "→" };

function Tile({ tile, hasToken, row, col, width, totalTiles }: TileProps) {
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
    <div className={`tile ${shadeClass} ${specialClass}`} style={gridStyle}>
      {displayText !== undefined && (
        <span className="tile-label">{displayText}</span>
      )}
      {turnArrow && (
        <span className={`tile-arrow tile-arrow--${turnArrow}`}>
          {ARROW_GLYPH[turnArrow]}
        </span>
      )}
      {hasToken && <img className="token" src={helmetIcon} alt="Team token" />}
    </div>
  );
}

export default Tile;
