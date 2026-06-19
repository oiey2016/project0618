import { useGameStore } from '@/store/gameStore'
import { AlertTriangle, X } from 'lucide-react'

export default function SuspicionPopup() {
  const popup = useGameStore((s) => s.showSuspicionPopup)
  const dismiss = useGameStore((s) => s.dismissSuspicionPopup)

  if (!popup) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-6 rounded-2xl border border-[#8B2252]/50 bg-[#0D0D0D]/95 p-5 shadow-xl shadow-[#8B2252]/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#8B2252]" />
            <span className="text-sm font-semibold text-[#8B2252]">疑点发现</span>
          </div>
          <button onClick={dismiss} className="text-zinc-500 hover:text-zinc-300">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{popup.message}</p>
        <button
          onClick={dismiss}
          className="mt-4 w-full rounded-lg bg-[#8B2252]/20 border border-[#8B2252]/30 py-2 text-sm text-[#8B2252] hover:bg-[#8B2252]/30 transition-colors"
        >
          记下了
        </button>
      </div>
    </div>
  )
}
