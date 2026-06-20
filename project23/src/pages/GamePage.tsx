import { useRef, useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GameEngine } from '@/engine/GameEngine'
import { useGameStore } from '@/store/gameStore'
import { getLevelById } from '@/levels/levelData'
import { getItemByKeyword, ITEMS } from '@/data/items'
import HUD from '@/components/HUD'
import InputBox from '@/components/InputBox'
import ItemBar from '@/components/ItemBar'
import ResultPanel from '@/components/ResultPanel'

export default function GamePage() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)

  const { gamePhase, timeElapsed, spawnedItems, actions } = useGameStore()
  const [stars, setStars] = useState(0)

  const levelNum = Number(levelId) || 1
  const levelDef = getLevelById(levelNum)

  const allowedItemNames = levelDef
    ? ITEMS.filter((item) => levelDef.allowedItems.includes(item.id)).map((i) => i.name)
    : []

  const allowedItemIds = levelDef?.allowedItems ?? []

  useEffect(() => {
    if (!canvasRef.current || !levelDef) return

    actions.setCurrentLevel(levelNum)

    const engine = new GameEngine()
    engineRef.current = engine

    engine.init(canvasRef.current)
    engine.loadLevel(levelDef)

    engine.onEvent((event) => {
      if (event === 'win') {
        const count = useGameStore.getState().spawnedItems.length
        const thresholds = levelDef.starThresholds
        let s = 1
        if (count <= thresholds.three) s = 3
        else if (count <= thresholds.two) s = 2
        setStars(s)
        actions.completeLevel(levelNum, s, useGameStore.getState().timeElapsed)
        engine.stop()
      } else if (event === 'lose') {
        actions.setPhase('lost')
        engine.stop()
      }
    })

    engine.start()

    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [levelNum])

  useEffect(() => {
    if (gamePhase !== 'playing') return
    const timer = setInterval(() => {
      actions.setTime(useGameStore.getState().timeElapsed + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [gamePhase])

  useEffect(() => {
    const keys = new Set<string>()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      const engine = engineRef.current
      if (!engine) return

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
      }

      keys.add(e.key)

      if (e.key === ' ') {
        engine.jump()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key)
    }

    const gameLoop = () => {
      const engine = engineRef.current
      if (!engine || useGameStore.getState().gamePhase !== 'playing') {
        requestAnimationFrame(gameLoop)
        return
      }

      let vx = 0
      if (keys.has('ArrowLeft')) vx -= 4
      if (keys.has('ArrowRight')) vx += 4

      if (vx !== 0) {
        engine.setPlayerVelocity(vx, 0)
      }

      requestAnimationFrame(gameLoop)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    const rafId = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const handleSpawn = useCallback(
    (text: string) => {
      const engine = engineRef.current
      if (!engine || !levelDef) return

      const item = getItemByKeyword(text)
      if (!item) return
      if (!allowedItemIds.includes(item.id)) return
      if (spawnedItems.length >= levelDef.maxItems) return

      const canvas = canvasRef.current
      const spawnX = canvas ? canvas.width / 2 : 400
      const spawnY = canvas ? canvas.height / 3 : 200

      engine.spawnItem(item, spawnX, spawnY)

      actions.spawnItem({
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        x: spawnX,
        y: spawnY,
      })
    },
    [allowedItemIds, levelDef, spawnedItems.length]
  )

  const handleSelectItem = useCallback(
    (name: string) => {
      handleSpawn(name)
    },
    [handleSpawn]
  )

  const handleReset = useCallback(() => {
    actions.resetLevel()
    setStars(0)
    const engine = engineRef.current
    if (engine && levelDef) {
      engine.reset()
      engine.start()
    }
  }, [levelDef])

  const handlePause = useCallback(() => {
    const engine = engineRef.current
    if (engine) {
      engine.stop()
      actions.setPhase('paused')
    }
  }, [])

  const handleReplay = useCallback(() => {
    handleReset()
  }, [handleReset])

  const handleNext = useCallback(() => {
    const nextId = levelNum + 1
    if (nextId <= 5) {
      navigate(`/game/${nextId}`)
    } else {
      navigate('/levels')
    }
  }, [levelNum, navigate])

  const handleBack = useCallback(() => {
    navigate('/levels')
  }, [navigate])

  if (!levelDef) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <p className="font-nunito text-2xl text-[#3D2B1F]">关卡不存在</p>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {gamePhase === 'playing' && (
        <>
          <HUD
            levelName={levelDef.name}
            timeElapsed={timeElapsed}
            onReset={handleReset}
            onPause={handlePause}
          />
          <InputBox
            onSpawn={handleSpawn}
            allowedItems={allowedItemNames}
            disabled={gamePhase !== 'playing'}
          />
          <ItemBar
            allowedItems={levelDef.allowedItems}
            usedCount={spawnedItems.length}
            maxItems={levelDef.maxItems}
            onSelectItem={handleSelectItem}
          />
        </>
      )}

      {gamePhase === 'paused' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FFF8F0] rounded-3xl p-8 flex flex-col items-center gap-4">
            <h2 className="font-fredoka text-3xl text-[#FF8C42]">暂停</h2>
            <button
              onClick={() => {
                engineRef.current?.start()
                actions.setPhase('playing')
              }}
              className="btn-paper px-8 py-3 rounded-2xl bg-[#7BC67E] text-white font-nunito font-bold text-lg"
            >
              继续
            </button>
          </div>
        </div>
      )}

      {gamePhase === 'won' && (
        <ResultPanel
          levelName={levelDef.name}
          stars={stars}
          timeElapsed={timeElapsed}
          itemCount={spawnedItems.length}
          onReplay={handleReplay}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {gamePhase === 'lost' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#FFF8F0] rounded-3xl p-8 flex flex-col items-center gap-4 border-2 border-red-200">
            <h2 className="font-fredoka text-3xl text-red-500">挑战失败</h2>
            <button
              onClick={handleReplay}
              className="btn-paper px-8 py-3 rounded-2xl bg-[#FF8C42] text-white font-nunito font-bold text-lg"
            >
              重新挑战
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
