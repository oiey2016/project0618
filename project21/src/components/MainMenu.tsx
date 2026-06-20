import { useState, useEffect } from 'react'
import { Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Keyboard } from 'lucide-react'
import { useGameStore } from '../store/useGameStore'

export const MainMenu = () => {
  const startGame = useGameStore(state => state.startGame)
  const [isVisible, setIsVisible] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, #F4F1DE 0%, #F2CC8F 50%, #E07A5F 100%)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#E07A5F', '#81B29A', '#F2CC8F', '#F4F1DE', '#3D405B'][
                Math.floor(Math.random() * 5)
              ],
              opacity: 0.3,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center px-8">
        <div className="mb-8">
          <h1
            className={`text-7xl font-bold mb-4 transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{
              color: '#3D405B',
              textShadow: '4px 4px 0 #E07A5F, 8px 8px 0 rgba(0,0,0,0.1)',
              fontFamily: "'Segoe UI', Roboto, sans-serif",
              letterSpacing: '-2px',
            }}
          >
            粘土大冒险
          </h1>
          <p
            className={`text-2xl text-[#3D405B] transition-all duration-700 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}
          >
            滚粘土球 · 粘小怪 · 征服山顶
          </p>
        </div>

        <div
          className={`transition-all duration-700 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <button
            onClick={startGame}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            className="group relative px-16 py-6 rounded-full text-3xl font-bold text-white transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(145deg, #E07A5F 0%, #D66A4F 100%)',
              boxShadow: buttonHover
                ? '0 10px 40px rgba(224, 122, 95, 0.5), inset 0 2px 0 rgba(255,255,255,0.3)'
                : '0 6px 0 #B85A3F, 0 10px 20px rgba(0,0,0,0.2)',
              transform: buttonHover ? 'translateY(-4px) scale(1.05)' : 'translateY(0)',
            }}
          >
            <span className="flex items-center gap-3">
              <Play size={36} fill="white" />
              开始游戏
            </span>
          </button>
        </div>

        <div
          className={`mt-16 transition-all duration-700 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div
            className="inline-block p-8 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 className="text-2xl font-bold text-[#3D405B] mb-6 flex items-center justify-center gap-2">
              <Keyboard size={28} />
              操作说明
            </h3>
            <div className="grid grid-cols-2 gap-6 text-[#3D405B]">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <div className="w-12 h-12 rounded-xl bg-[#81B29A] flex items-center justify-center text-white font-bold shadow-lg">
                    <ArrowUp size={24} />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-12 h-12 rounded-xl bg-[#81B29A] flex items-center justify-center text-white font-bold shadow-lg">
                      <ArrowLeft size={24} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#81B29A] flex items-center justify-center text-white font-bold shadow-lg">
                      <ArrowDown size={24} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#81B29A] flex items-center justify-center text-white font-bold shadow-lg">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
                <span className="text-xl font-semibold">移动</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-12 rounded-xl bg-[#F2CC8F] flex items-center justify-center text-[#3D405B] font-bold shadow-lg">
                  Space
                </div>
                <span className="text-xl font-semibold">跳跃</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t-2 border-dashed border-[#3D405B]/20">
              <p className="text-lg text-[#3D405B]/80">
                💡 提示：球越大，爬得越高！粘满小怪去征服山顶吧！
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mt-8 text-[#3D405B]/60 transition-all duration-700 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-lg">WASD 或 方向键 也可以控制哦</p>
        </div>
      </div>
    </div>
  )
}
