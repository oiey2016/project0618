import { Crown, ArrowLeft, ArrowRight } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export function HintBar() {
  const year = useGameStore((s) => s.year);
  const kingName = useGameStore((s) => s.kingName);
  const makeChoice = useGameStore((s) => s.makeChoice);
  const animatingOut = useGameStore((s) => s.animatingOut);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2 text-parchment-100 min-w-0">
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-300 shrink-0" strokeWidth={2} />
          <span className="font-display text-xs sm:text-sm md:text-base tracking-wider gold-text font-bold truncate">
            {kingName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-parchment-200/70 font-bold">
            第
          </span>
          <span className="font-display text-lg sm:text-xl md:text-2xl font-black royal-text tabular-nums">
            {year}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-parchment-200/70 font-bold">
            年
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-3 items-center">
        <button
          disabled={!!animatingOut}
          onClick={() => makeChoice("left")}
          className="btn-choice !py-2.5 sm:!py-3.5 !px-3 sm:!px-5 bg-gradient-to-b from-rose-500 to-rose-700 text-white ring-1 ring-rose-300/40 flex items-center justify-center gap-1 sm:gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_-8px_rgba(244,63,94,0.5)]"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={2.5} />
          <span className="text-[11px] sm:text-xs md:text-sm">拒绝</span>
        </button>
        <div className="px-1 sm:px-2 text-[8px] sm:text-[10px] md:text-xs text-parchment-100/50 whitespace-nowrap tracking-wider sm:tracking-widest uppercase text-center">
          拖动 · 或点击
        </div>
        <button
          disabled={!!animatingOut}
          onClick={() => makeChoice("right")}
          className="btn-choice !py-2.5 sm:!py-3.5 !px-3 sm:!px-5 bg-gradient-to-b from-emerald-500 to-emerald-700 text-white ring-1 ring-emerald-300/40 flex items-center justify-center gap-1 sm:gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)]"
        >
          <span className="text-[11px] sm:text-xs md:text-sm">应允</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
