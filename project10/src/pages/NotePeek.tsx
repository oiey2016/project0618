import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'
import { characters } from '@/data/characters'
import { notes } from '@/data/notes'
import PhoneFrame from '@/components/PhoneFrame'
import NoteEntry from '@/components/NoteEntry'
import { ArrowLeft } from 'lucide-react'

export default function NotePeek() {
  const { characterId } = useParams<{ characterId: string }>()
  const navigate = useNavigate()
  const character = characters.find((c) => c.id === characterId)
  const unlockedNotes = useGameStore((s) => s.unlockedNotes)
  const suspicions = useGameStore((s) => s.suspicions)
  const unlockNote = useGameStore((s) => s.unlockNote)

  const characterNotes = notes.filter((n) => n.characterId === characterId)

  useEffect(() => {
    characterNotes.forEach((note) => {
      if (
        note.unlockSuspicionId &&
        suspicions[note.unlockSuspicionId] &&
        !unlockedNotes[note.id]
      ) {
        unlockNote(note.id)
      }
    })
  }, [suspicions, unlockedNotes, characterNotes, unlockNote])

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 pt-8 pb-3 border-b border-zinc-800/50">
          <button onClick={() => navigate(`/chat/${characterId}`)} className="text-zinc-400 hover:text-zinc-200">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-semibold text-zinc-200">私人笔记</h1>
          {character && (
            <span className="text-xs text-zinc-500">— {character.name}</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
          <div className="space-y-3 relative z-10">
            {characterNotes.map((note) => (
              <NoteEntry
                key={note.id}
                note={note}
                isUnlocked={!!unlockedNotes[note.id]}
              />
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
