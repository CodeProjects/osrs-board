import { useCallback, useRef } from "react";
import type { GameState } from "../types";
import type { BoardTile } from "../lib/board";
import type { PathStep } from "../lib/movePath";
import { tileToGridPosition } from "../lib/generateBoard";
import { isGameWon } from "../lib/gameplay";
import Tile from "./Tile";
import BoardLines from "./BoardLines";
import DiceRoller from "./DiceRoller";
import StatsPanel from "./StatsPanel";
import TokenMarker from "./TokenMarker";
import "./BoardPage.css";

interface BoardPageProps {
  gameState: GameState;
  movePath: PathStep[] | null;
  moveId: number;
  onRoll: () => void;
  onRefresh: () => void;
  onReset: () => void;
  onTokenSettle: () => void;
  boardTiles: BoardTile[];
}

function BoardPage({
  gameState,
  movePath,
  moveId,
  onRoll,
  onRefresh,
  onReset,
  onTokenSettle,
  boardTiles,
}: BoardPageProps) {
  const { width, height, specialTiles, tokenPosition, lastRoll } = gameState;
  const total = width * height;
  const startTile = 0;
  const goalTile = total + 1;
  const currentTile: BoardTile | undefined =
    tokenPosition === startTile ? { tileNumber: startTile, cleanTask: "Start" }
    : tokenPosition === goalTile ? { tileNumber: goalTile, cleanTask: "Finish" }
    : boardTiles.find((tile) => tile.tileNumber === tokenPosition);
  const isAnimating = movePath !== null;

  const boardFrameRef = useRef<HTMLDivElement>(null);
  const tileElsRef = useRef(new Map<number, HTMLDivElement>());
  const registerTileRef = useCallback(
    (tileNumber: number, el: HTMLDivElement | null) => {
      if (el) tileElsRef.current.set(tileNumber, el);
      else tileElsRef.current.delete(tileNumber);
    },
    [],
  );
  const getTileEl = useCallback(
    (tileNumber: number) => tileElsRef.current.get(tileNumber) ?? null,
    [],
  );

  return (
    <div className="board-page">
      <div className="board-row">
        <div className="board-column">
          <h1>OSRS Chutes and Ladders</h1>
          <div className="board-frame" ref={boardFrameRef}>
            <div className="board-corners">
              <Tile
                tile={{ tileNumber: goalTile, cleanTask: "Finish" }}
                registerRef={registerTileRef}
              />
              <Tile
                tile={{ tileNumber: startTile, cleanTask: "Start" }}
                registerRef={registerTileRef}
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
                      row={row}
                      col={col}
                      width={width}
                      totalTiles={total}
                      registerRef={registerTileRef}
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
            <TokenMarker
              key={moveId}
              path={movePath}
              restingTile={tokenPosition}
              getTileEl={getTileEl}
              containerRef={boardFrameRef}
              onSettle={onTokenSettle}
            />
            <StatsPanel currentTile={currentTile} lastRoll={lastRoll} />
          </div>
          <DiceRoller
            lastRoll={lastRoll}
            isWon={isGameWon(gameState) && !isAnimating}
            isAnimating={isAnimating}
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
