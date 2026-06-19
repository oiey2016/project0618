import { useGameStore } from '@/store/gameStore'
import { Eye, FileSearch } from 'lucide-react'

export default function ProgressBar() {
  const suspicionCount = useGameStore((s) => s.getDiscoveredSuspicionCount())
  const evidenceCount = useGameStore((s) => s.getCollectedEvidenceCount())

  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <Eye size={12} className="text-[#8B2252]" />
          <span className="text-[10px] text-zinc-500">疑点 {suspicionCount}/7</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-[#8B2252] transition-all duration-500"
            style={{ width: `${(suspicionCount / 7) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <FileSearch size={12} className="text-[#D4A847]" />
          <span className="text-[10px] text-zinc-500">证据 {evidenceCount}/5</span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-[#D4A847] transition-all duration-500"
            style={{ width: `${(evidenceCount / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
