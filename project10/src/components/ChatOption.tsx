import type { ChatOption as ChatOptionType } from '@/data/dialogues'

interface ChatOptionProps {
  option: ChatOptionType
  onSelect: (option: ChatOptionType) => void
}

export default function ChatOption({ option, onSelect }: ChatOptionProps) {
  return (
    <button
      onClick={() => onSelect(option)}
      className="w-full text-left rounded-xl border border-[#D4A847]/30 bg-[#D4A847]/5 px-4 py-3 text-sm text-[#D4A847] hover:bg-[#D4A847]/15 hover:border-[#D4A847]/50 transition-all duration-200 active:scale-[0.98]"
    >
      {option.text}
    </button>
  )
}
