import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/store/gameStore'
import { characters } from '@/data/characters'
import PhoneFrame from '@/components/PhoneFrame'
import { ArrowLeft, RotateCcw } from 'lucide-react'

const MOTIVES = [
  { id: '为钱杀人', label: '为钱杀人', desc: '图财害命' },
  { id: '为情杀人', label: '为情杀人', desc: '爱恨纠葛' },
  { id: '为画杀人', label: '为画杀人', desc: '画作纷争' },
  { id: '灭口', label: '灭口', desc: '杀人封口' },
]

const TRUTH_NARRATIVE = `真相：赵明辉是凶手。他因挪用拍卖款面临巨额赌债，当晚前往画室想要偷走林远舟的未完成遗作《暮色中的告别》抵债。被林远舟发现后，两人在画室发生争执。赵明辉在茶杯中下了氰化物，林远舟饮下后中毒倒地。赵明辉从正门反锁画室，再通过西侧书架后的暗门离开，制造出密室假象。苏婉清当晚确实去过画室，但十点前已离开；陈默凌晨两点才发现尸体；林小雨虽知道遗嘱变更，但与凶案无关。一切线索都指向赵明辉——那个声称"从未去过画室"的人。`

export default function Deduction() {
  const navigate = useNavigate()
  const completeGame = useGameStore((s) => s.completeGame)
  const resetGame = useGameStore((s) => s.resetGame)
  const setDeduction = useGameStore((s) => s.setDeduction)

  const [selectedKiller, setSelectedKiller] = useState<string | null>(null)
  const [selectedMotive, setSelectedMotive] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const isCorrect = selectedKiller === 'zhao-minghui' && selectedMotive === '为钱杀人'

  const handleConfirm = () => {
    if (!selectedKiller || !selectedMotive) return
    setDeduction(selectedKiller, selectedMotive)
    completeGame()
    setConfirmed(true)
  }

  const handleReset = () => {
    resetGame()
    navigate('/')
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 pt-8 pb-3 border-b border-zinc-800/50">
          <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-zinc-200">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-semibold text-zinc-200">推理终局</h1>
        </div>

        {!confirmed ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h2 className="text-xs font-semibold text-[#D4A847] mb-3">第一步：指认凶手</h2>
              <div className="flex gap-3 justify-center">
                {characters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedKiller(c.id)}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      selectedKiller === c.id
                        ? 'scale-110'
                        : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className={`h-12 w-12 rounded-full border-2 object-cover ${
                        selectedKiller === c.id
                          ? 'border-[#D4A847] shadow-lg shadow-[#D4A847]/30'
                          : 'border-zinc-700'
                      }`}
                    />
                    <span className={`text-[10px] ${selectedKiller === c.id ? 'text-[#D4A847]' : 'text-zinc-500'}`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-[#D4A847] mb-3">第二步：选择动机</h2>
              <div className="grid grid-cols-2 gap-2">
                {MOTIVES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMotive(m.id)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      selectedMotive === m.id
                        ? 'border-[#D4A847]/50 bg-[#D4A847]/10'
                        : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                    }`}
                  >
                    <p className={`text-sm font-medium ${selectedMotive === m.id ? 'text-[#D4A847]' : 'text-zinc-400'}`}>
                      {m.label}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedKiller || !selectedMotive}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                selectedKiller && selectedMotive
                  ? 'bg-[#D4A847] text-black hover:bg-[#D4A847]/90'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              确认推理
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <div className={`rounded-xl border p-4 mb-4 ${
              isCorrect
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-red-500/30 bg-red-500/5'
            }`}>
              <p className={`text-lg font-bold text-center ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? '推理正确！' : '推理有误...'}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">{TRUTH_NARRATIVE}</p>
            </div>

            <button
              onClick={handleReset}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw size={14} />
              重新开始
            </button>
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}
