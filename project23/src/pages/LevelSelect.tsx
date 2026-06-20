import { useNavigate } from 'react-router-dom'
import { Star, ArrowLeft } from 'lucide-react'
import { LEVELS } from '@/levels/levelData'
import { useGameStore } from '@/store/gameStore'

export default function LevelSelect() {
  const navigate = useNavigate()
  const completedLevels = useGameStore((s) => s.completedLevels)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-amber-50 to-orange-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="btn-paper p-2 rounded-xl bg-white/80 hover:bg-white transition-colors"
          >
            <ArrowLeft size={24} className="text-[#3D2B1F]" />
          </button>
          <h1 className="font-fredoka text-4xl text-[#FF8C42]">选择关卡</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEVELS.map((level) => {
            const completed = completedLevels[level.id]
            return (
              <button
                key={level.id}
                onClick={() => navigate(`/game/${level.id}`)}
                className="btn-paper bg-[#FFF8F0] rounded-2xl p-5 border-2 border-amber-200 hover:border-[#FF8C42] transition-colors text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-fredoka text-3xl text-[#FF8C42]">{level.id}</span>
                  <span className="font-nunito text-lg font-bold text-[#3D2B1F]">{level.name}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        completed && i <= completed.stars
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }
                    />
                  ))}
                </div>
                {completed && (
                  <p className="font-nunito text-xs text-gray-400 mt-1">已通关</p>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
