import { useState } from 'react'
import type { BoardConfig, GameState } from './types'
import { createInitialGameState } from './lib/generateBoard'
import SetupPage from './components/SetupPage'
import BoardPage from './components/BoardPage'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [lastConfig, setLastConfig] = useState<BoardConfig | null>(null)

  const handleSetupSubmit = (config: BoardConfig) => {
    setLastConfig(config)
    setGameState(createInitialGameState(config))
  }

  return (
    <div className="app-shell">
      {gameState ? (
        <div>
          <BoardPage gameState={gameState} />
          <button type="button" onClick={() => setGameState(null)}>
            Back to setup
          </button>
        </div>
      ) : (
        <SetupPage initialConfig={lastConfig} onSubmit={handleSetupSubmit} />
      )}
    </div>
  )
}

export default App
