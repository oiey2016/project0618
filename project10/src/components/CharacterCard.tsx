import type { Character } from '@/data/characters'
import { useNavigate } from 'react-router-dom'

interface CharacterCardProps {
  character: Character
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/chat/${character.id}`)}
      className="flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 hover:border-[#D4A847]/30 hover:bg-zinc-800/50 transition-all duration-200"
    >
      <img
        src={character.avatar}
        alt={character.name}
        className="h-11 w-11 rounded-full border border-zinc-700 object-cover"
      />
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">{character.name}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        </div>
        <p className="text-[11px] text-zinc-500 truncate">{character.title}</p>
      </div>
      <p className="text-[11px] text-zinc-600 max-w-[120px] truncate">{character.lastMessage}</p>
    </button>
  )
}
