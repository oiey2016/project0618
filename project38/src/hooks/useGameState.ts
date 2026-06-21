import { useState, useCallback } from 'react'

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover' | 'success'

export interface GameState {
  status: GameStatus
  level: number
  score: number
  time: number
  bestTime: number | null
}

const STORAGE_KEY = 'ballance_best_time'

export function useGameState() {
  const [state, setState] = useState<GameState>({
    status: 'menu',
    level: 1,
    score: 0,
    time: 0,
    bestTime: parseFloat(localStorage.getItem(STORAGE_KEY) || '0') || null,
  })

  const startGame = useCallback((level = 1) => {
    setState(prev => ({
      ...prev,
      status: 'playing',
      level,
      score: 0,
      time: 0,
    }))
  }, [])

  const pauseGame = useCallback(() => {
    setState(prev => ({ ...prev, status: 'paused' }))
  }, [])

  const resumeGame = useCallback(() => {
    setState(prev => ({ ...prev, status: 'playing' }))
  }, [])

  const gameOver = useCallback(() => {
    setState(prev => ({ ...prev, status: 'gameover' }))
  }, [])

  const success = useCallback(() => {
    setState(prev => {
      const newBestTime = prev.bestTime === null || prev.time < prev.bestTime ? prev.time : prev.bestTime
      if (newBestTime !== prev.bestTime) {
        localStorage.setItem(STORAGE_KEY, newBestTime.toString())
      }
      return {
        ...prev,
        status: 'success',
        score: Math.max(0, 10000 - prev.time * 10),
        bestTime: newBestTime,
      }
    })
  }, [])

  const updateTime = useCallback((time: number) => {
    setState(prev => ({ ...prev, time }))
  }, [])

  const goToMenu = useCallback(() => {
    setState(prev => ({ ...prev, status: 'menu' }))
  }, [])

  const nextLevel = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'playing',
      level: prev.level + 1,
      time: 0,
    }))
  }, [])

  return {
    state,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    success,
    updateTime,
    goToMenu,
    nextLevel,
  }
}
