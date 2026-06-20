import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

interface InputBoxProps {
  onSpawn: (text: string) => void
  allowedItems: string[]
  disabled: boolean
}

export default function InputBox({ onSpawn, allowedItems, disabled }: InputBoxProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(false), 600)
      return () => clearTimeout(t)
    }
  }, [error])

  useEffect(() => {
    if (text.length > 0) {
      setGlowing(true)
    } else {
      setGlowing(false)
    }
  }, [text])

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    if (!allowedItems.includes(trimmed)) {
      setError(true)
      return
    }
    onSpawn(trimmed)
    setText('')
    setGlowing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
      <div
        className={`
          relative flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-amber-400 px-4 py-3
          ${glowing ? 'input-glow' : ''}
          ${error ? 'input-shake' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="输入物品名称，召唤神奇物体..."
          className="flex-1 bg-transparent outline-none font-nunito text-lg text-[#3D2B1F] placeholder:text-amber-300/70 disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !text.trim()}
          className="btn-paper p-2 rounded-xl bg-orange-400 text-white hover:bg-orange-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
      {error && (
        <p className="text-red-500 font-nunito text-center mt-2 text-sm font-bold animate-bounce">
          没有这种物品哦
        </p>
      )}
    </div>
  )
}
