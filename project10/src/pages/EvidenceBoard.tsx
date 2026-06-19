import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'
import { suspicions } from '@/data/suspicions'
import { evidences } from '@/data/evidences'
import { characters } from '@/data/characters'
import PhoneFrame from '@/components/PhoneFrame'
import EvidenceCard from '@/components/EvidenceCard'
import { ArrowLeft, Eye, FileSearch, Brain } from 'lucide-react'

export default function EvidenceBoard() {
  const navigate = useNavigate()
  const discoveredSuspicions = useGameStore((s) => s.suspicions)
  const canDeduce = useGameStore((s) => s.canDeduce)
  const suspicionCount = useGameStore((s) => s.getDiscoveredSuspicionCount())
  const evidenceCount = useGameStore((s) => s.getCollectedEvidenceCount())

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-[#0a0a0a]">
        <div className="flex items-center gap-3 px-4 pt-8 pb-3 border-b border-zinc-800/50">
          <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-zinc-200">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-semibold text-zinc-200">证据板</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye size={14} className="text-[#8B2252]" />
              <span className="text-xs font-semibold text-[#8B2252]">疑点区域</span>
              <span className="text-[10px] text-zinc-600">{suspicionCount}/{suspicions.length}</span>
            </div>
            <div className="space-y-2">
              {suspicions.map((sus) => {
                const discovered = !!discoveredSuspicions[sus.id]
                const sourceChar = characters.find((c) => c.id === sus.sourceCharacterId)
                return (
                  <div
                    key={sus.id}
                    className={`rounded-lg border p-3 transition-all ${
                      discovered
                        ? 'border-[#8B2252]/30 bg-[#8B2252]/5'
                        : 'border-zinc-800/50 bg-zinc-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {sourceChar && (
                        <img src={sourceChar.avatar} alt="" className="h-5 w-5 rounded-full" />
                      )}
                      <span className={`text-xs font-medium ${discovered ? 'text-[#8B2252]' : 'text-zinc-600'}`}>
                        {sourceChar?.name}
                      </span>
                    </div>
                    <p className={`text-xs ${discovered ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {discovered ? sus.description : '???'}
                    </p>
                    {discovered && (
                      <p className="text-[11px] text-zinc-500 mt-1">{sus.detail}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileSearch size={14} className="text-[#D4A847]" />
              <span className="text-xs font-semibold text-[#D4A847]">证据区域</span>
              <span className="text-[10px] text-zinc-600">{evidenceCount}/{evidences.length}</span>
            </div>
            <div className="space-y-2">
              {evidences.map((ev) => (
                <EvidenceCard key={ev.id} evidence={ev} />
              ))}
            </div>
          </div>
        </div>

        {canDeduce() && (
          <div className="px-4 py-3 border-t border-zinc-800/50">
            <button
              onClick={() => navigate('/deduction')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#D4A847]/50 bg-[#D4A847]/10 py-3 text-sm text-[#D4A847] animate-pulse hover:bg-[#D4A847]/20 transition-colors"
            >
              <Brain size={16} />
              开始推理
            </button>
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}
