import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'
import { characters } from '@/data/characters'
import { dialogueGroups } from '@/data/dialogues'
import type { ChatMessage, ChatOption as ChatOptionType } from '@/data/dialogues'
import PhoneFrame from '@/components/PhoneFrame'
import ChatBubble from '@/components/ChatBubble'
import ChatOption from '@/components/ChatOption'
import SuspicionPopup from '@/components/SuspicionPopup'
import { ArrowLeft, Notebook } from 'lucide-react'

export default function ChatRoom() {
  const { characterId } = useParams<{ characterId: string }>()
  const navigate = useNavigate()
  const character = characters.find((c) => c.id === characterId)

  const chatProgress = useGameStore((s) => s.chatProgress)
  const advanceChat = useGameStore((s) => s.advanceChat)
  const discoverSuspicion = useGameStore((s) => s.discoverSuspicion)
  const unlockNote = useGameStore((s) => s.unlockNote)
  const showSuspicionPopup = useGameStore((s) => s.showSuspicionPopup)

  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentGroupId, setCurrentGroupId] = useState('')
  const [playerMessage, setPlayerMessage] = useState<string | null>(null)
  const [currentAnimIndex, setCurrentAnimIndex] = useState(-1)
  const [animCompleted, setAnimCompleted] = useState<Set<number>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  const getFirstGroupId = useCallback(() => {
    const group = dialogueGroups.find((g) => g.characterId === characterId)
    return group?.id ?? ''
  }, [characterId])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      const initialGroupId = chatProgress[characterId!] || getFirstGroupId()
      setCurrentGroupId(initialGroupId)
    }
  }, [characterId, chatProgress, getFirstGroupId])

  useEffect(() => {
    if (!currentGroupId) return
    setDisplayedMessages([])
    setPlayerMessage(null)
    setIsTyping(true)
    setCurrentAnimIndex(0)
    setAnimCompleted(new Set())
  }, [currentGroupId])

  const handleAnimationComplete = useCallback((index: number) => {
    setAnimCompleted((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  const currentGroup = dialogueGroups.find((g) => g.id === currentGroupId)
  const sortedMessages = currentGroup
    ? [...currentGroup.messages].sort((a, b) => a.order - b.order)
    : []

  useEffect(() => {
    if (sortedMessages.length === 0) return
    if (animCompleted.size >= sortedMessages.length) {
      setIsTyping(false)
    }
  }, [animCompleted, sortedMessages.length])

  useEffect(() => {
    if (currentAnimIndex < 0 || currentAnimIndex >= sortedMessages.length) return
    
    const message = sortedMessages[currentAnimIndex]
    const messageLength = message.content.length
    const baseDelay = 2000
    const readTime = messageLength * 200
    const delay = currentAnimIndex === 0 ? baseDelay : Math.max(baseDelay, readTime)
    
    const timer = setTimeout(() => {
      setDisplayedMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) return prev
        return [...prev, message]
      })
      setCurrentAnimIndex((prev) => prev + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [currentAnimIndex, sortedMessages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [displayedMessages, playerMessage, animCompleted])

  const SUSPICION_MESSAGES: Record<string, string> = {
    'sus-1': '赵明辉声称没去过画室，但笔记中有画室窗户尺寸',
    'sus-2': '苏婉清回国时间与遗嘱修改时间巧合',
    'sus-3': '陈默能精准描述遗作画面',
    'sus-4': '林小雨对遗嘱变更知情',
    'sus-5': '赵明辉回避拍卖款细节',
    'sus-6': '画室茶杯有两人指纹',
    'sus-7': '赵明辉手机定位有空白',
  }

  const handleOptionSelect = (option: ChatOptionType) => {
    setPlayerMessage(option.text)
    if (option.triggerSuspicionId) {
      const msg = SUSPICION_MESSAGES[option.triggerSuspicionId] || '发现了新的疑点'
      discoverSuspicion(option.triggerSuspicionId, msg)
    }
    if (option.unlockNoteId) {
      unlockNote(option.unlockNoteId)
    }
    advanceChat(characterId!, option.nextGroupId)

    setTimeout(() => {
      setCurrentGroupId(option.nextGroupId)
    }, 800)
  }

  const showOptions = !isTyping && currentGroup && animCompleted.size >= sortedMessages.length && !playerMessage

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full relative">
        <div className="flex items-center gap-3 px-4 pt-8 pb-3 border-b border-zinc-800/50 bg-[#0D0D0D]/90 backdrop-blur-sm z-10">
          <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-zinc-200 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <img src={character?.avatar} alt="" className="h-9 w-9 rounded-full border border-zinc-700 object-cover" />
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-200">{character?.name}</p>
            <p className="text-[10px] text-zinc-500">{character?.title}</p>
          </div>
          <button onClick={() => navigate(`/notes/${characterId}`)} className="text-zinc-500 hover:text-[#D4A847] transition-colors" title="偷看笔记">
            <Notebook size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 scrollbar-hide">
          {displayedMessages.map((msg, i) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              shouldAnimate={true}
              onAnimationComplete={() => handleAnimationComplete(i)}
            />
          ))}
          {playerMessage && (
            <ChatBubble message={sortedMessages[0]} isPlayer playerText={playerMessage} />
          )}
          {isTyping && currentAnimIndex >= sortedMessages.length && (
            <div className="flex justify-start mb-3 px-3">
              <div className="rounded-2xl rounded-bl-sm bg-zinc-800/80 border border-zinc-700/50 px-3.5 py-2.5">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {showOptions && (
          <div className="px-4 py-3 space-y-2 border-t border-zinc-800/50 bg-[#0D0D0D]/90 backdrop-blur-sm">
            {currentGroup.options.map((opt) => (
              <ChatOption key={opt.id} option={opt} onSelect={handleOptionSelect} />
            ))}
          </div>
        )}

        {showSuspicionPopup && <SuspicionPopup />}
      </div>
    </PhoneFrame>
  )
}
