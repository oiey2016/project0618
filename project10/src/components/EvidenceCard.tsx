import type { Evidence } from '@/data/evidences'
import { useGameStore } from '@/store/gameStore'
import { Lock, Unlock } from 'lucide-react'

interface EvidenceCardProps {
  evidence: Evidence
}

export default function EvidenceCard({ evidence }: EvidenceCardProps) {
  const collected = useGameStore((s) => s.evidences[evidence.id])
  const collectEvidence = useGameStore((s) => s.collectEvidence)

  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-300 ${
        collected
          ? 'border-[#D4A847]/40 bg-[#D4A847]/5'
          : 'border-zinc-800 bg-zinc-900/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium ${collected ? 'text-[#D4A847]' : 'text-zinc-500'}`}>
            {evidence.description}
          </p>
          {collected && (
            <p className="mt-1.5 text-[11px] text-zinc-400 leading-relaxed">{evidence.detail}</p>
          )}
        </div>
        {collected ? (
          <Unlock size={14} className="text-[#D4A847] shrink-0 mt-0.5" />
        ) : (
          <Lock size={14} className="text-zinc-600 shrink-0 mt-0.5" />
        )}
      </div>
      {!collected && (
        <button
          onClick={() => collectEvidence(evidence.id)}
          className="mt-2 w-full rounded-lg border border-[#D4A847]/20 bg-[#D4A847]/5 py-1.5 text-xs text-[#D4A847] hover:bg-[#D4A847]/15 transition-colors"
        >
          收集证据
        </button>
      )}
    </div>
  )
}
