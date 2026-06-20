import { RotateCcw, Pause } from 'lucide-react'

interface HUDProps {
  levelName: string
  timeElapsed: number
  onReset: () => void
  onPause: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function HUD({ levelName, timeElapsed, onReset, onPause }: HUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 bg-black/30 backdrop-blur-sm">
      <span className="text-white font-nunito text-lg font-bold">{levelName}</span>
      <span className="text-white font-fredoka text-2xl tracking-wider">{formatTime(timeElapsed)}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="btn-paper p-2 rounded-lg text-white hover:text-orange-300 transition-colors"
        >
          <RotateCcw size={22} />
        </button>
        <button
          onClick={onPause}
          className="btn-paper p-2 rounded-lg text-white hover:text-orange-300 transition-colors"
        >
          <Pause size={22} />
        </button>
      </div>
    </div>
  )
}
