import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'
import { characters } from '@/data/characters'
import PhoneFrame from '@/components/PhoneFrame'
import ProgressBar from '@/components/ProgressBar'
import CharacterCard from '@/components/CharacterCard'
import { FileSearch, Brain, ScrollText } from 'lucide-react'

export default function ChatHall() {
  const navigate = useNavigate()
  const canDeduce = useGameStore((s) => s.canDeduce)
  const gameCompleted = useGameStore((s) => s.gameCompleted)

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full">
        <div className="px-4 pt-8 pb-2">
          <div className="flex items-center gap-2">
            <ScrollText size={18} className="text-[#D4A847]" />
            <h1 className="text-lg font-serif font-bold text-[#D4A847]">深夜告别</h1>
          </div>
          <p className="text-[10px] text-zinc-600 mt-0.5 ml-7">侦探聊天室</p>
        </div>

        <div className="mx-4 rounded-xl border border-[#D4A847]/20 bg-gradient-to-b from-[#D4A847]/8 to-transparent p-4">
          <h2 className="text-sm font-serif font-semibold text-[#D4A847] mb-2">案件档案</h2>
          <div className="space-y-1.5">
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-500">死者：</span>林远舟，58岁，知名画家
            </p>
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-500">死因：</span>氰化物中毒
            </p>
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-500">现场：</span>画室门从内侧反锁，窗户半开
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-800/50">
            <p className="text-[11px] text-zinc-500 italic">
              案发当晚，五名嫌疑人各有心事。与她们逐一聊天，发现疑点，揭开真相。
            </p>
          </div>
        </div>

        <div className="px-4 pt-3 pb-1">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider">嫌疑人</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2 scrollbar-hide">
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} />
          ))}
        </div>

        <div className="px-4 py-2 space-y-2 border-t border-zinc-800/50 bg-[#0D0D0D]/90">
          <ProgressBar />

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/evidence')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/50 py-2.5 text-xs text-zinc-300 hover:border-[#D4A847]/30 hover:text-[#D4A847] transition-colors"
            >
              <FileSearch size={14} />
              证据板
            </button>

            {canDeduce() && !gameCompleted && (
              <button
                onClick={() => navigate('/deduction')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#D4A847]/50 bg-[#D4A847]/10 py-2.5 text-xs text-[#D4A847] animate-pulse-glow hover:bg-[#D4A847]/20 transition-colors"
              >
                <Brain size={14} />
                开始推理
              </button>
            )}

            {gameCompleted && (
              <button
                onClick={() => navigate('/deduction')}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/50 py-2.5 text-xs text-zinc-400 transition-colors"
              >
                <Brain size={14} />
                查看结局
              </button>
            )}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
