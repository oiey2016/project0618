import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameState } from './hooks/useGameState'
import { levels } from './utils/levels'
import { GameCanvas } from './components/GameCanvas'
import { Menu } from './components/Menu'
import { HUD } from './components/HUD'
import { PauseMenu } from './components/PauseMenu'
import { GameOver } from './components/GameOver'
import { Success } from './components/Success'

export default function App() {
  const { state, startGame, pauseGame, resumeGame, gameOver, success, updateTime, goToMenu, nextLevel } = useGameState()
  const [ballPosition, setBallPosition] = useState<[number, number, number]>([0, 2, 0])
  const keysPressed = useRef<Set<string>>(new Set())
  const gameLoopRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const currentTimeRef = useRef<number>(0)

  const currentLevel = levels.find(l => l.id === state.level) || levels[0]

  const handleStartGame = useCallback((level: number) => {
    const levelData = levels.find(l => l.id === level) || levels[0]
    setBallPosition([...levelData.startPosition])
    startTimeRef.current = performance.now()
    currentTimeRef.current = 0
    startGame(level)
  }, [startGame])

  const handleRestart = useCallback(() => {
    handleStartGame(state.level)
  }, [state.level, handleStartGame])

  const handleNextLevel = useCallback(() => {
    const nextLevelData = levels.find(l => l.id === state.level + 1) || levels[0]
    setBallPosition([...nextLevelData.startPosition])
    startTimeRef.current = performance.now()
    currentTimeRef.current = 0
    nextLevel()
  }, [state.level, nextLevel])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase())
      
      if (e.key === ' ' && state.status === 'playing') {
        e.preventDefault()
        setBallPosition([...currentLevel.startPosition])
        startTimeRef.current = performance.now()
        currentTimeRef.current = 0
      }
      
      if (e.key === 'Escape') {
        if (state.status === 'playing') {
          pauseGame()
        } else if (state.status === 'paused') {
          resumeGame()
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [state.status, pauseGame, resumeGame, currentLevel.startPosition])

  useEffect(() => {
    if (state.status !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    const gameLoop = () => {
      const now = performance.now()
      currentTimeRef.current = (now - startTimeRef.current) / 1000
      updateTime(currentTimeRef.current)

      const speed = 0.08
      let dx = 0
      let dz = 0

      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        dz += speed
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        dz -= speed
      }
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        dx -= speed
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        dx += speed
      }

      setBallPosition(prev => [prev[0] + dx, prev[1], prev[2] + dz])

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [state.status, updateTime])

  const handleBallMove = useCallback((position: [number, number, number]) => {
    setBallPosition(position)
  }, [])

  const handleGameOver = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
      gameLoopRef.current = null
    }
    gameOver()
  }, [gameOver])

  const handleSuccess = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
      gameLoopRef.current = null
    }
    success()
  }, [success])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {state.status === 'menu' && (
        <Menu onStartGame={handleStartGame} bestTime={state.bestTime} />
      )}

      {(state.status === 'playing' || state.status === 'paused') && (
        <>
          <GameCanvas
            segments={currentLevel.track}
            startPosition={currentLevel.startPosition}
            endPosition={currentLevel.endPosition}
            ballPosition={ballPosition}
            onBallMove={handleBallMove}
            onGameOver={handleGameOver}
            onSuccess={handleSuccess}
          />
          <HUD time={state.time} level={state.level} onPause={pauseGame} />
        </>
      )}

      {state.status === 'paused' && (
        <PauseMenu
          onResume={resumeGame}
          onRestart={handleRestart}
          onMenu={goToMenu}
        />
      )}

      {state.status === 'gameover' && (
        <GameOver time={state.time} onRestart={handleRestart} onMenu={goToMenu} />
      )}

      {state.status === 'success' && (
        <Success
          level={state.level}
          time={state.time}
          score={state.score}
          bestTime={state.bestTime}
          onNextLevel={handleNextLevel}
          onRestart={handleRestart}
          onMenu={goToMenu}
        />
      )}
    </div>
  )
}
