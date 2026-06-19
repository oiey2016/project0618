import { useState, useEffect } from 'react'
import type { ChatMessage } from '@/data/dialogues'

interface ChatBubbleProps {
  message: ChatMessage
  isPlayer?: boolean
  playerText?: string
  shouldAnimate?: boolean
  onAnimationComplete?: () => void
}

export default function ChatBubble({ message, isPlayer, playerText, shouldAnimate, onAnimationComplete }: ChatBubbleProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isPlayer || !shouldAnimate) {
      setDisplayedText(isPlayer ? (playerText || '') : message.content)
      return
    }

    setIsAnimating(true)
    setDisplayedText('')
    let index = 0
    const text = message.content
    const interval = setInterval(() => {
      index++
      setDisplayedText(text.slice(0, index))
      if (index >= text.length) {
        clearInterval(interval)
        setIsAnimating(false)
        onAnimationComplete?.()
      }
    }, 40)

    return () => clearInterval(interval)
  }, [message.content, isPlayer, playerText, shouldAnimate, onAnimationComplete])

  if (isPlayer) {
    return (
      <div className="flex justify-end mb-3 px-3 animate-fade-in-up">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-[#D4A847]/20 border border-[#D4A847]/30 px-3.5 py-2.5">
          <p className="text-sm text-[#D4A847] leading-relaxed">{playerText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-3 px-3 animate-fade-in-up">
      <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-zinc-800/80 border border-zinc-700/50 px-3.5 py-2.5 relative">
        <p className="text-sm text-zinc-200 leading-relaxed">
          {shouldAnimate ? displayedText : message.content}
          {isAnimating && (
            <span className="inline-block w-0.5 h-4 bg-[#D4A847] ml-0.5 animate-pulse align-text-bottom" />
          )}
        </p>
        {message.suspicionId && !isAnimating && (
          <div className="absolute -right-1 -top-1 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B2252] animate-suspicion-pulse" />
          </div>
        )}
      </div>
      {message.suspicionId && !isAnimating && (
        <div className="absolute -top-5 right-0">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#8B2252]/20 text-[#8B2252] border border-[#8B2252]/30">
            疑点
          </span>
        </div>
      )}
    </div>
  )
}
