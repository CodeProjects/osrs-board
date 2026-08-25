import type { GameState } from "../types";
import type { BoardTile } from "../lib/board";
import { tileToGridPosition } from "../lib/generateBoard";
import { isGameWon } from "../lib/gameplay";
import Tile from "./Tile";
import BoardLines from "./BoardLines";
import DiceRoller from "./DiceRoller";
import "./BoardPage.css";

interface BoardPageProps {
  gameState: GameState;
  onRoll: () => void;
  onRefresh: () => void;
  onReset: () => void;
  boardTiles: BoardTile[];
}

function BoardPage({ gameState, onRoll, onRefresh, onReset, boardTiles }: BoardPageProps) {
  const { width, height, specialTiles, tokenPosition, lastRoll } = gameState;
  const total = width * height;
  const startTile = 0;
  const goalTile = total + 1;
  return (
    <div className="board-page">
      <div className="board-row">
        <div className="board-column">
          <h1>OSRS Chutes and Ladders</h1>
          <div className="board-frame">
            <div className="board-corners">
              <Tile
                tile={{ tileNumber: goalTile, cleanTask: "Finish" }}
                hasToken={tokenPosition === goalTile}
              />
              <Tile
                tile={{ tileNumber: startTile, cleanTask: "Start" }}
                hasToken={tokenPosition === startTile}
              />
            </div>
            <div className="board-grid-wrapper">
              <div
                className="board-grid"
                style={{
                  gridTemplateColumns: `repeat(${width}, var(--tile-size))`,
                  gridTemplateRows: `repeat(${height}, var(--tile-size))`,
                }}
              >
                {boardTiles.map((tile) => {
                  const { row, col } = tileToGridPosition(
                    tile.tileNumber,
                    width,
                    height,
                  );
                  return (
                    <Tile
                      key={tile.tileNumber}
                      tile={tile}
                      hasToken={tile.tileNumber === tokenPosition}
                      row={row}
                      col={col}
                      width={width}
                      totalTiles={total}
                    />
                  );
                })}
              </div>
              <BoardLines
                specialTiles={specialTiles}
                width={width}
                height={height}
              />
            </div>
          </div>
          <DiceRoller
            lastRoll={lastRoll}
            isWon={isGameWon(gameState)}
            onRoll={onRoll}
            onRefresh={onRefresh}
            onReset={onReset}
          />
        </div>
      </div>
    </div>
  );
}

export default BoardPage;
