import { useEffect, useState } from "react";
import type { StatKey } from "@/types";
import { STAT_META } from "@/data/cards";
import { useGameStore } from "@/store/gameStore";

interface StatBarProps {
  statKey: StatKey;
}

export function StatBar({ statKey }: StatBarProps) {
  const meta = STAT_META[statKey];
  const value = useGameStore((s) => s.stats[statKey]);
  const delta = useGameStore((s) => s.lastChange[statKey]);
  const animatingOut = useGameStore((s) => s.animatingOut);

  const [displayValue, setDisplayValue] = useState(value);
  const [flashKind, setFlashKind] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (delta === undefined) return;
    setFlashKind(delta > 0 ? "up" : "down");
    const timer = window.setTimeout(() => setFlashKind(null), 700);
    return () => window.clearTimeout(timer);
  }, [delta, animatingOut]);

  useEffect(() => {
    const start = displayValue;
    const end = value;
    if (start === end) return;
    const duration = 360;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayValue(Math.round(start + (end - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const pct = Math.max(0, Math.min(100, displayValue));
  const isWarning = pct <= 20 || pct >= 80;
  const isCritical = pct <= 10 || pct >= 90;

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full">
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl shrink-0 shadow-innerGlow ring-1 ring-black/30 ${
          isCritical ? "animate-pulseWarning" : ""
        }`}
        style={{
          background: `linear-gradient(180deg, ${meta.color}dd, ${meta.color}88)`,
        }}
      >
        <span className="text-base sm:text-xl drop-shadow-sm">{meta.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <span className="font-display text-[10px] sm:text-[11px] md:text-xs tracking-widest uppercase gold-text">
            {meta.name}
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {delta !== undefined && !animatingOut && (
              <span
                className={`text-[10px] sm:text-[11px] md:text-xs font-bold tabular-nums transition-opacity ${
                  delta > 0 ? "text-emerald-300" : "text-rose-300"
                } ${flashKind ? "opacity-100" : "opacity-0"}`}
              >
                {delta > 0 ? "+" : ""}
                {delta}
              </span>
            )}
            <span
              className={`text-sm sm:text-base font-bold tabular-nums ${
                isWarning ? "royal-text" : "text-parchment-50"
              } ${isCritical ? "animate-pulseWarning" : ""}`}
            >
              {displayValue}
            </span>
          </div>
        </div>
        <div className="stat-bar-track h-2 sm:h-2.5 md:h-3 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${meta.barClass} ${
              flashKind === "up" ? "brightness-125" : ""
            } ${flashKind === "down" ? "brightness-75" : ""}`}
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-0 h-full w-[2px] bg-white/20 pointer-events-none"
            style={{ left: "20%" }}
          />
          <div
            className="absolute top-0 h-full w-[2px] bg-white/20 pointer-events-none"
            style={{ left: "80%" }}
          />
        </div>
      </div>
    </div>
  );
}
