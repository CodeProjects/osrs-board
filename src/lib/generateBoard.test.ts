import { describe, expect, it } from "vitest";
import { generateSpecialTiles } from "./generateBoard";
import type { BoardConfig, Difficulty } from "../types";

function makeConfig(
  width: number,
  height: number,
  difficulty: Difficulty,
): BoardConfig {
  return { name: "Test Board", width, height, difficulty, players: ["Alice"] };
}

describe("generateSpecialTiles", () => {
  it("scales the number of special tiles with difficulty", () => {
    const config10x10: Record<Difficulty, number> = {
      light: 0,
      moderate: 0,
      heavy: 0,
    };
    for (const difficulty of Object.keys(config10x10) as Difficulty[]) {
      const config = makeConfig(10, 10, difficulty);
      const tiles = generateSpecialTiles(config);
      config10x10[difficulty] = tiles.size;
    }
    expect(config10x10.light).toBeLessThan(config10x10.moderate);
    expect(config10x10.moderate).toBeLessThan(config10x10.heavy);
    // 100 tiles: light ~8, moderate ~15, heavy ~25 (rounded from the configured percentages)
    expect(config10x10.light).toBe(8);
    expect(config10x10.moderate).toBe(15);
    expect(config10x10.heavy).toBe(25);
  });

  it("splits special tiles roughly evenly between ladders and chutes", () => {
    const config = makeConfig(10, 10, "heavy");
    const tiles = generateSpecialTiles(config);
    const ladders = [...tiles.values()].filter(
      (t) => t.type === "ladder",
    ).length;
    const chutes = [...tiles.values()].filter((t) => t.type === "chute").length;
    expect(ladders + chutes).toBe(tiles.size);
    expect(Math.abs(ladders - chutes)).toBeLessThanOrEqual(1);
  });

  it("never places a chute/ladder endpoint on the start or goal tile", () => {
    const config = makeConfig(10, 10, "heavy");
    const total = config.width * config.height;
    const tiles = generateSpecialTiles(config);
    for (const [start, { target }] of tiles) {
      expect(start).not.toBe(1);
      expect(start).not.toBe(total);
      expect(target).not.toBe(1);
      expect(target).not.toBe(total);
    }
  });

  it("always points ladders upward and chutes downward", () => {
    const config = makeConfig(12, 12, "heavy");
    const tiles = generateSpecialTiles(config);
    for (const [start, { type, target }] of tiles) {
      if (type === "ladder") {
        expect(target).toBeGreaterThan(start);
      } else {
        expect(target).toBeLessThan(start);
      }
    }
  });

  it("never reuses a tile as more than one start or target", () => {
    const config = makeConfig(10, 10, "heavy");
    const tiles = generateSpecialTiles(config);
    const starts = [...tiles.keys()];
    const targets = [...tiles.values()].map((t) => t.target);
    const allEndpoints = [...starts, ...targets];
    expect(new Set(allEndpoints).size).toBe(allEndpoints.length);
  });

  it("produces no special tiles when the board is too small for the percentage to round up", () => {
    const config = makeConfig(2, 2, "light");
    const tiles = generateSpecialTiles(config);
    expect(tiles.size).toBe(0);
  });

  it("does not throw when eligible tiles are scarce relative to the requested count", () => {
    const config = makeConfig(2, 2, "heavy");
    expect(() => generateSpecialTiles(config)).not.toThrow();
  });
});
