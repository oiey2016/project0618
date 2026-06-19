import type { Note } from '@/data/notes'
import { useGameStore } from '@/store/gameStore'
import { Lock, BookOpen, FileSearch } from 'lucide-react'

interface NoteEntryProps {
  note: Note
  isUnlocked: boolean
}

export default function NoteEntry({ note, isUnlocked }: NoteEntryProps) {
  const collectEvidence = useGameStore((s) => s.collectEvidence)
  const collectedEvidences = useGameStore((s) => s.evidences)

  const handleCollectEvidence = () => {
    if (note.evidenceId && !collectedEvidences[note.evidenceId]) {
      collectEvidence(note.evidenceId)
    }
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 ${
        isUnlocked
          ? 'border-amber-900/30 bg-[#1a1508]/80'
          : 'border-zinc-800/50 bg-zinc-900/20'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isUnlocked ? (
          <BookOpen size={13} className="text-[#D4A847]" />
        ) : (
          <Lock size={13} className="text-zinc-600" />
        )}
        <span className={`text-xs font-medium ${isUnlocked ? 'text-[#D4A847]' : 'text-zinc-600'}`}>
          {note.date}
        </span>
      </div>
      <h3 className={`text-sm font-medium mb-1.5 ${isUnlocked ? 'text-zinc-200' : 'text-zinc-600'}`}>
        {isUnlocked ? note.title : '???'}
      </h3>
      {isUnlocked && (
        <>
          <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">{note.content}</p>
          {note.evidenceId && !collectedEvidences[note.evidenceId] && (
            <button
              onClick={handleCollectEvidence}
              className="mt-3 flex items-center gap-1.5 rounded-lg border border-[#D4A847]/30 bg-[#D4A847]/10 px-3 py-1.5 text-xs text-[#D4A847] hover:bg-[#D4A847]/20 transition-colors"
            >
              <FileSearch size={12} />
              提取证据
            </button>
          )}
          {note.evidenceId && collectedEvidences[note.evidenceId] && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-green-500/70">
              <FileSearch size={12} />
              证据已收集
            </div>
          )}
        </>
      )}
      {!isUnlocked && (
        <p className="text-xs text-zinc-600 mt-2 italic">需要更多线索才能解锁</p>
      )}
    </div>
  )
}
