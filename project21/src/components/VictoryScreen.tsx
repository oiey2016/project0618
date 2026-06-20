import { useState, useEffect } from 'react'
import { Trophy, RotateCcw, Home, Clock, Zap, Circle } from 'lucide-react'
import { useGameStore } from '../store/useGameStore'
import { GAME_CONFIG } from '../types/game'

export const VictoryScreen = () => {
  const restartGame = useGameStore(state => state.restartGame)
  const startGame = useGameStore(state => state.startGame)
  const critterCount = useGameStore(state => state.critterCount)
  const elapsedTime = useGameStore(state => state.elapsedTime)
  const ballSize = useGameStore(state => state.ballSize)

  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [displayTime, setDisplayTime] = useState(0)
  const [displayCount, setDisplayCount] = useState(0)
  const [displaySize, setDisplaySize] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showContent) return

    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 4)

      setDisplayTime(Math.round(elapsedTime * eased))
      setDisplayCount(Math.round(critterCount * eased))
      setDisplaySize(ballSize * eased)

      if (t < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }, [showContent, elapsedTime, critterCount, ballSize])

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getStars = (): number => {
    if (critterCount >= 30) return 3
    if (critterCount >= 20) return 2
    return 1
  }

  const stars = getStars()

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(244, 241, 222, 0.95) 0%, rgba(242, 204, 143, 0.95) 50%, rgba(224, 122, 95, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce"
            style={{
              width: `${15 + Math.random() * 30}px`,
              height: `${15 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#E07A5F', '#81B29A', '#F2CC8F', '#FFE66D', '#3D405B', '#C7CEEA'][
                Math.floor(Math.random() * 6)
              ],
              opacity: 0.6,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative text-center px-8 transition-all duration-1000 ${
          showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'
        }`}
      >
        <div className="mb-6">
          <div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
            style={{
              background: 'linear-gradient(145deg, #FFE66D, #FFB347)',
              boxShadow: '0 10px 40px rgba(255, 230, 109, 0.5)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <Trophy size={64} color="#3D405B" />
          </div>
        </div>

        <h1
          className="text-6xl font-bold mb-4"
          style={{
            color: '#3D405B',
            textShadow: '4px 4px 0 #E07A5F, 8px 8px 0 rgba(0,0,0,0.1)',
          }}
        >
          恭喜通关！
        </h1>

        <p className="text-2xl text-[#3D405B] mb-8">
          你成功吃掉了山顶的目标！
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                i <= stars ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
              }`}
              style={{
                transitionDelay: `${i * 200}ms`,
              }}
            >
              <svg
                width={56}
                height={56}
                viewBox="0 0 24 24"
                fill={i <= stars ? '#FFE66D' : '#ccc'}
                style={{
                  filter: i <= stars ? 'drop-shadow(0 4px 8px rgba(255, 230, 109, 0.5))' : 'none',
                }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          ))}
        </div>

        <div
          className="inline-block p-8 rounded-3xl mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 rounded-xl inline-block mb-2" style={{ background: '#F2CC8F' }}>
                <Clock size={32} color="#3D405B" />
              </div>
              <p className="text-sm text-[#3D405B]/70 font-semibold mb-1">用时</p>
              <p className="text-3xl font-bold text-[#3D405B] font-mono">
                {formatTime(displayTime)}
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-xl inline-block mb-2" style={{ background: '#81B29A' }}>
                <Zap size={32} fill="white" color="white" />
              </div>
              <p className="text-sm text-[#3D405B]/70 font-semibold mb-1">粘附小怪</p>
              <p className="text-3xl font-bold text-[#3D405B]">
                {displayCount} <span className="text-lg">/ {GAME_CONFIG.CRITTER_COUNT}</span>
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-xl inline-block mb-2" style={{ background: '#E07A5F' }}>
                <Circle size={32} fill="white" color="white" />
              </div>
              <p className="text-sm text-[#3D405B]/70 font-semibold mb-1">最终大小</p>
              <p className="text-3xl font-bold text-[#3D405B]">
                {displaySize.toFixed(1)} <span className="text-lg">/ {GAME_CONFIG.MAX_BALL_SIZE}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 justify-center">
          <button
            onClick={startGame}
            className="group flex items-center gap-3 px-10 py-5 rounded-full text-2xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(145deg, #81B29A 0%, #6BA189 100%)',
              boxShadow: '0 6px 0 #5A8A75, 0 10px 20px rgba(0,0,0,0.2)',
            }}
          >
            <RotateCcw size={28} />
            再玩一次
          </button>
          <button
            onClick={restartGame}
            className="group flex items-center gap-3 px-10 py-5 rounded-full text-2xl font-bold text-[#3D405B] transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(145deg, #F4F1DE 0%, #E8E4D0 100%)',
              boxShadow: '0 6px 0 #D4D0BC, 0 10px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Home size={28} />
            返回主菜单
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
