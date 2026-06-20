import { useState, useEffect } from 'react'
import { Circle, Target, Clock, Zap } from 'lucide-react'
import { useGameStore } from '../store/useGameStore'
import { GAME_CONFIG } from '../types/game'

export const HUD = () => {
  const ballSize = useGameStore(state => state.ballSize)
  const critterCount = useGameStore(state => state.critterCount)
  const progress = useGameStore(state => state.progress)
  const elapsedTime = useGameStore(state => state.elapsedTime)
  const lastAttachEffect = useGameStore(state => state.lastAttachEffect)

  const [countPulse, setCountPulse] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    if (critterCount > displayCount) {
      setCountPulse(true)
      const timer = setTimeout(() => setCountPulse(false), 300)
      
      const startCount = displayCount
      const endCount = critterCount
      const duration = 300
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const t = Math.min(1, elapsed / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplayCount(Math.round(startCount + (endCount - startCount) * eased))
        if (t < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()

      return () => clearTimeout(timer)
    }
  }, [critterCount, displayCount])

  const sizePercentage = ((ballSize - GAME_CONFIG.INITIAL_BALL_SIZE) / (GAME_CONFIG.MAX_BALL_SIZE - GAME_CONFIG.INITIAL_BALL_SIZE)) * 100

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed top-0 left-0 right-0 p-6 pointer-events-none z-40">
      <div className="flex justify-between items-start max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div
            className="p-5 rounded-2xl pointer-events-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl" style={{ background: '#E07A5F' }}>
                <Circle size={24} fill="white" color="white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#3D405B]/70">球体大小</p>
                <p className="text-2xl font-bold text-[#3D405B]">
                  {ballSize.toFixed(1)} <span className="text-lg">/ {GAME_CONFIG.MAX_BALL_SIZE}</span>
                </p>
              </div>
            </div>
            <div className="w-48 h-4 rounded-full overflow-hidden" style={{ background: '#F4F1DE' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${sizePercentage}%`,
                  background: 'linear-gradient(90deg, #E07A5F, #F2CC8F)',
                }}
              />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl pointer-events-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl transition-transform duration-300 ${
                  countPulse ? 'scale-125' : 'scale-100'
                }`}
                style={{ background: '#81B29A' }}
              >
                <Zap size={24} fill="white" color="white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#3D405B]/70">已粘附小怪</p>
                <p
                  className={`text-3xl font-bold transition-all duration-300 ${
                    countPulse ? 'scale-125 text-[#E07A5F]' : 'text-[#3D405B]'
                  }`}
                >
                  {displayCount} <span className="text-lg">/ {GAME_CONFIG.CRITTER_COUNT}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-end">
          <div
            className="p-5 rounded-2xl pointer-events-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl" style={{ background: '#3D405B' }}>
                <Target size={24} fill="white" color="white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#3D405B]/70">进度</p>
                <p className="text-2xl font-bold text-[#3D405B]">{Math.round(progress)}%</p>
              </div>
            </div>
            <div className="w-48 h-4 rounded-full overflow-hidden" style={{ background: '#F4F1DE' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #81B29A, #3D405B)',
                }}
              />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl pointer-events-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: '#F2CC8F' }}>
                <Clock size={24} color="#3D405B" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#3D405B]/70">用时</p>
                <p className="text-2xl font-bold text-[#3D405B] font-mono">
                  {formatTime(elapsedTime)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div
          className="px-6 py-3 rounded-full"
          style={{
            background: 'rgba(61, 64, 91, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p className="text-white text-sm font-medium">
            WASD / 方向键 移动 · 空格 跳跃
          </p>
        </div>
      </div>
    </div>
  )
}
