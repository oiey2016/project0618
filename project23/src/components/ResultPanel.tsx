import { Star, RotateCcw, ChevronRight, Home } from 'lucide-react'

interface ResultPanelProps {
  levelName: string
  stars: number
  timeElapsed: number
  itemCount: number
  onReplay: () => void
  onNext: () => void
  onBack: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function ResultPanel({
  levelName,
  stars,
  timeElapsed,
  itemCount,
  onReplay,
  onNext,
  onBack,
}: ResultPanelProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FFF8F0] rounded-3xl p-8 w-full max-w-sm shadow-2xl border-2 border-amber-200 flex flex-col items-center gap-5">
        <h2 className="font-fredoka text-3xl text-[#FF8C42]">{levelName}</h2>

        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              size={48}
              className={`star-reveal transition-colors duration-300 ${
                i <= stars
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>

        <div className="flex gap-8 text-[#3D2B1F] font-nunito">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">通关时间</span>
            <span className="text-xl font-bold">{formatTime(timeElapsed)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">使用物品</span>
            <span className="text-xl font-bold">{itemCount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onReplay}
            className="btn-paper w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FF8C42] text-white font-nunito font-bold text-lg hover:bg-orange-500 transition-colors"
          >
            <RotateCcw size={20} />
            重玩
          </button>
          <button
            onClick={onNext}
            className="btn-paper w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#7BC67E] text-white font-nunito font-bold text-lg hover:bg-green-500 transition-colors"
          >
            <ChevronRight size={20} />
            下一关
          </button>
          <button
            onClick={onBack}
            className="btn-paper w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#5CC8FF] text-white font-nunito font-bold text-lg hover:bg-blue-400 transition-colors"
          >
            <Home size={20} />
            返回关卡选择
          </button>
        </div>
      </div>
    </div>
  )
}
