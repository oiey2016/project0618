import { useState } from "react";
import { StatPanel } from "@/components/StatPanel";
import { GameCard } from "@/components/GameCard";
import { HintBar } from "@/components/HintBar";
import { GameOverModal } from "@/components/GameOverModal";
import { RulesModal } from "@/components/RulesModal";
import { Crown, Scroll, BookOpen } from "lucide-react";

export default function Home() {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <div className="bg-court h-screen w-full relative overflow-hidden flex flex-col">
      <header className="relative z-10 pt-3 sm:pt-4 md:pt-6 pb-2 text-center shrink-0">
        <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/30 backdrop-blur-sm ring-1 ring-gold-500/25 shadow-innerGlow">
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold-300" strokeWidth={2} />
          <h1 className="font-display text-base sm:text-lg md:text-2xl font-black gold-text tracking-[0.15em] sm:tracking-[0.2em] uppercase">
            王权 · King's Reign
          </h1>
          <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold-300" strokeWidth={2} />
        </div>
        <p className="mt-1 sm:mt-2 text-[10px] sm:text-[11px] md:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-parchment-200/60 uppercase font-bold">
          权衡四方 · 一念兴亡
        </p>

        <button
          onClick={() => setRulesOpen(true)}
          className="absolute right-3 sm:right-5 md:right-8 top-3 sm:top-4 md:top-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 backdrop-blur-sm ring-1 ring-gold-500/25 flex items-center justify-center hover:bg-black/40 transition-colors"
          aria-label="游戏规则"
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gold-300" strokeWidth={1.8} />
        </button>
      </header>

      <main className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 flex-1 min-h-0 flex flex-col gap-3 sm:gap-4 md:gap-6 pb-3 sm:pb-4 md:pb-6">
        <div className="shrink-0">
          <StatPanel />
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0 py-1 sm:py-2">
          <GameCard />
        </div>

        <div className="shrink-0">
          <HintBar />
        </div>
      </main>

      <div
        className="pointer-events-none absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-royal-700/20 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-gold-500/10 blur-[120px]"
        aria-hidden
      />

      <GameOverModal />
      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
