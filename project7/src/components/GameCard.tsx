import { useMemo } from "react";
import { useSwipe, type SwipeDirection } from "@/hooks/useSwipe";
import { useGameStore, currentCardSelector } from "@/store/gameStore";
import { STAT_META } from "@/data/cards";
import type { StatChange, StatKey } from "@/types";

function EffectChips({ effect }: { effect: StatChange }) {
  const entries = (Object.entries(effect) as [StatKey, number][]).filter(
    ([, v]) => v !== undefined && v !== 0,
  );
  if (entries.length === 0) {
    return (
      <div className="text-xs text-ink-700/50 italic font-body">
        暂无直接影响
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([k, v]) => {
        const meta = STAT_META[k];
        const up = v > 0;
        return (
          <div
            key={k}
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ring-1 ${
              up
                ? "bg-emerald-100/70 text-emerald-900 ring-emerald-700/20"
                : "bg-rose-100/70 text-rose-900 ring-rose-700/20"
            }`}
          >
            <span>{meta.emoji}</span>
            <span>{up ? "+" : ""}{v}</span>
          </div>
        );
      })}
    </div>
  );
}

export function GameCard() {
  const card = useGameStore(currentCardSelector);
  const makeChoice = useGameStore((s) => s.makeChoice);
  const animatingOut = useGameStore((s) => s.animatingOut);
  const deckIndex = useGameStore((s) => s.deckIndex);

  const handleSwipe = (dir: SwipeDirection) => {
    if (dir) makeChoice(dir);
  };

  const { offsetX, offsetY, rotation, directionHint, handlers } = useSwipe({
    threshold: 100,
    onSwipe: handleSwipe,
    maxRotation: 16,
  });

  const showLeft = directionHint === "left" || animatingOut === "left";
  const showRight = directionHint === "right" || animatingOut === "right";

  const animClass = useMemo(() => {
    if (animatingOut === "left") return "animate-slideOutLeft";
    if (animatingOut === "right") return "animate-slideOutRight";
    return "animate-slideIn";
  }, [animatingOut, deckIndex]);

  const tiltStyle = !animatingOut && directionHint
    ? directionHint === "left"
      ? { transform: "perspective(1000px) rotateY(-6deg)" }
      : { transform: "perspective(1000px) rotateY(6deg)" }
    : undefined;

  return (
    <div className="relative w-full max-w-[380px] h-full max-h-full mx-auto select-none flex items-center justify-center">
      <div
        className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-b from-gold-500/40 to-royal-700/30 blur-2xl opacity-60 scale-95"
        aria-hidden
      />
      <div
        key={deckIndex + (animatingOut ?? "idle")}
        className={`relative ornate-border bg-parchment rounded-[20px] sm:rounded-[24px] shadow-card overflow-hidden card-swipe-grab w-full h-full max-h-full aspect-[3/4] max-w-[360px] ${animClass}`}
        style={{
          transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`,
          transition: handlers.onPointerDown ? undefined : "transform 0.3s cubic-bezier(.22,1,.36,1)",
          ...tiltStyle,
        }}
        {...handlers}
      >
        <div className="relative z-10 flex flex-col h-full w-full p-4 sm:p-5 md:p-6 gap-2 sm:gap-3">
          <div className="flex items-start justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-300/80 to-gold-700/60 ring-2 ring-gold-500/50 flex items-center justify-center shadow-md shrink-0"
              >
                <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow">{card.emoji}</span>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold-700/80 font-bold truncate">
                  {card.character}
                </div>
                <h2 className="font-display text-lg sm:text-xl md:text-2xl text-ink-900 font-black leading-tight mt-0.5 truncate">
                  {card.title}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center min-h-0 overflow-hidden">
            <p className="text-ink-700 leading-relaxed text-[13px] sm:text-[15px] md:text-base font-body overflow-y-auto pr-1 -mr-1">
              {card.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1 sm:mt-2 shrink-0">
            <div className="relative rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-gradient-to-br from-rose-900/10 to-rose-700/15 ring-1 ring-rose-900/20">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-rose-900/70 font-bold mb-0.5 sm:mb-1">
                ◀ 左滑
              </div>
              <div className="font-bold text-rose-950 text-sm sm:text-base mb-1 sm:mb-2 leading-tight">
                {card.leftChoice.label}
              </div>
              <EffectChips effect={card.leftChoice.effect} />
            </div>
            <div className="relative rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-gradient-to-br from-emerald-900/10 to-emerald-700/15 ring-1 ring-emerald-900/20">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-emerald-900/70 font-bold mb-0.5 sm:mb-1 text-right">
                右滑 ▶
              </div>
              <div className="font-bold text-emerald-950 text-sm sm:text-base mb-1 sm:mb-2 text-right leading-tight">
                {card.rightChoice.label}
              </div>
              <div className="flex justify-end">
                <EffectChips effect={card.rightChoice.effect} />
              </div>
            </div>
          </div>
        </div>

        {showLeft && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-rose-900/40 choice-overlay animate-fadeIn">
            <div className="px-8 py-5 border-4 border-rose-300 rounded-[28px] rotate-[-12deg]">
              <div className="text-4xl md:text-5xl font-black text-rose-50 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] tracking-widest">
                拒绝
              </div>
              <div className="mt-1 text-center text-rose-100 text-xs tracking-[0.3em]">
                REJECT
              </div>
            </div>
          </div>
        )}
        {showRight && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-900/40 choice-overlay animate-fadeIn">
            <div className="px-8 py-5 border-4 border-emerald-300 rounded-[28px] rotate-[12deg]">
              <div className="text-4xl md:text-5xl font-black text-emerald-50 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] tracking-widest">
                应允
              </div>
              <div className="mt-1 text-center text-emerald-100 text-xs tracking-[0.3em]">
                ACCEPT
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
