import { useState } from 'react'
import type { BoardConfig, GameState } from './types'
import { createInitialGameState } from './lib/generateBoard'
import SetupPage from './components/SetupPage'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null)

  const handleSetupSubmit = (config: BoardConfig) => {
    setGameState(createInitialGameState(config))
  }

  return (
    <div className="app-shell">
      {gameState ? (
        <div>
          <h1>{gameState.config.name}</h1>
          <p>
            {gameState.config.width}x{gameState.config.height} board,{' '}
            {gameState.config.difficulty} difficulty
          </p>
          <p>Players: {gameState.config.players.join(', ')}</p>
          <p>Board rendering arrives in the next step.</p>
          <button type="button" onClick={() => setGameState(null)}>
            Back to setup
          </button>
        </div>
      ) : (
        <SetupPage onSubmit={handleSetupSubmit} />
      )}
    </div>
  )
}

export default App
