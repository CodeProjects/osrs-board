import type { RawBoardTile } from "./board";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export interface TokenState {
  tokenPosition: number;
  lastRoll: number | null;
}

export interface GameBootstrap extends TokenState {
  tiles: RawBoardTile[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

/** Bootstrap fetch for page load: raw board tiles + current token state. */
export function fetchGameState(): Promise<GameBootstrap> {
  return request<GameBootstrap>("/api/game");
}

/** Asks the server to roll the die, resolve chutes/ladders, and persist the result. */
export function rollToken(): Promise<TokenState> {
  return request<TokenState>("/api/game/roll", { method: "POST" });
}

export function resetToken(): Promise<TokenState> {
  return request<TokenState>("/api/game/reset", { method: "POST" });
}
