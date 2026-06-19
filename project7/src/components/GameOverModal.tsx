import { useGameStore } from "@/store/gameStore";
import { STAT_META } from "@/data/cards";
import { Crown, RotateCcw, Skull } from "lucide-react";

export function GameOverModal() {
  const { isGameOver, year, deathReason, deathStat, kingName, startNewGame } =
    useGameStore();

  if (!isGameOver) return null;
  const meta = deathStat ? STAT_META[deathStat] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden
      />
      <div className="relative w-full max-w-md animate-bounceIn">
        <div className="relative ornate-border bg-parchment rounded-[28px] shadow-card overflow-hidden p-7 md:p-8 text-center">
          <div className="flex justify-center -mt-2 mb-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-royal-700/40 blur-xl" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-royal-500 to-royal-900 ring-4 ring-gold-500/50 flex items-center justify-center">
                <Skull className="w-10 h-10 text-gold-300" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black royal-text tracking-wider">
            统治结束
          </h2>
          <div className="mt-1 text-xs md:text-sm uppercase tracking-[0.35em] text-gold-700/80 font-bold">
            LONG LIVE THE KING
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 text-gold-500" />
            <div className="font-display text-lg md:text-xl text-ink-900 font-black">
              {kingName}
            </div>
          </div>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-gold-700/40 to-transparent" />

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl p-3 bg-black/5 ring-1 ring-gold-700/20">
              <div className="text-[10px] uppercase tracking-widest text-gold-700 font-bold">
                在位年数
              </div>
              <div className="mt-1 font-display text-3xl font-black text-ink-900 tabular-nums">
                {year}
              </div>
              <div className="text-[10px] text-ink-700/70 mt-0.5">年</div>
            </div>
            <div className="rounded-xl p-3 bg-black/5 ring-1 ring-rose-700/20">
              <div className="text-[10px] uppercase tracking-widest text-rose-800 font-bold">
                崩溃势力
              </div>
              <div className="mt-1 text-3xl">
                {meta?.emoji ?? "💀"}
              </div>
              <div className="text-[11px] font-bold text-rose-900 mt-0.5">
                {meta?.name ?? "未知"}
              </div>
            </div>
          </div>

          <p className="text-ink-700 leading-relaxed font-body text-sm md:text-base">
            {deathReason}
          </p>

          <button
            onClick={startNewGame}
            className="btn-royal mt-7 w-full rounded-2xl py-3.5 font-display text-base md:text-lg tracking-[0.2em] uppercase flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" strokeWidth={2} />
            重登王座
          </button>
        </div>
      </div>
    </div>
  );
}
