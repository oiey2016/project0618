import { useMemo } from 'react'
import type { ReactNode } from 'react'

function RainEffect() {
  const drops = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${20 + Math.random() * 40}px`,
      duration: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 5}s`,
      opacity: 0.1 + Math.random() * 0.15,
    }))
  }, [])

  return (
    <div className="rain-container">
      {drops.map((d) => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: d.left,
            height: d.height,
            animationDuration: d.duration,
            animationDelay: d.delay,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  )
}

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-0 md:p-4">
      <div className="relative w-full md:max-w-[420px] min-h-screen md:min-h-0 md:h-[844px] md:rounded-[2.5rem] md:border-2 md:border-zinc-800 bg-[#0D0D0D] overflow-hidden md:shadow-2xl md:shadow-black/50">
        <RainEffect />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,71,0.03)_0%,transparent_50%)] pointer-events-none z-[1]" />
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
        <div className="relative z-[2] h-full overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>
  )
}
