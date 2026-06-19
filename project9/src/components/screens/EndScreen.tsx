import { Calendar, Map, AlertTriangle, Coins, Backpack, Sparkles, Trophy, Skull, RotateCcw, Home, type LucideIcon } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import StarField from '@/components/common/StarField';
import GoldButton from '@/components/common/GoldButton';
import DecorativeCard from '@/components/common/DecorativeCard';

function DividerLine() {
  return (
    <div className="w-full flex items-center gap-3 my-4 opacity-80">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stardust-400/60 to-transparent" />
      <svg width="16" height="16" viewBox="0 0 16 16" className="text-stardust-400">
        <path
          d="M8 1 L10 8 L8 15 L6 8 Z"
          fill="currentColor"
          opacity="0.8"
        />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stardust-400/60 to-transparent" />
    </div>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sub?: string;
}

function StatCard({ icon: Icon, label, value, sub }: StatCardProps) {
  return (
    <div className="glass-panel rounded-sm p-4 relative overflow-hidden group hover:border-stardust-400/30 transition-all duration-300">
      <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity">
        <Icon size={28} className="text-stardust-400" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2">
          <Icon size={14} className="text-plasma-300 shrink-0" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-space-200">
            {label}
          </span>
        </div>
        <div className="font-display font-black text-3xl text-gold-gradient leading-none">
          {value}
        </div>
        {sub && (
          <div className="font-serif text-xs text-space-200/70 mt-1 italic">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EndScreen() {
  const {
    isVictory,
    endReason,
    stats,
    stardust,
    morale,
    startNewGame,
    returnToTitle,
  } = useGameStore();

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className={cn(
          'absolute inset-0 z-0',
          isVictory ? 'bg-victory' : 'bg-defeat'
        )}
        style={{
          animation: isVictory ? undefined : undefined,
        }}
      />
      <StarField />

      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: isVictory
            ? 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(224,53,84,0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6 py-10">
        <DecorativeCard className="w-[min(720px,92vw)] p-8 md:p-12 animate-scale-in">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div
                className={cn(
                  'flex h-20 w-20 items-center justify-center rounded-full border-2 animate-pulse-slow',
                  isVictory
                    ? 'border-stardust-400/60 bg-stardust-400/10'
                    : 'border-alert-400/50 bg-alert-400/10'
                )}
              >
                {isVictory ? (
                  <Trophy size={36} className="text-stardust-300" />
                ) : (
                  <Skull size={36} className="text-alert-400" />
                )}
              </div>
            </div>

            <h1
              className={cn(
                'font-display font-black text-5xl md:text-6xl leading-none mb-3',
                isVictory
                  ? 'text-gold-gradient'
                  : 'text-alert-400'
              )}
            >
              {isVictory ? '环球成功！' : '旅程终结'}
            </h1>

            <p className="font-mono tracking-widest text-sm md:text-base uppercase opacity-80 mt-3">
              {isVictory
                ? 'VICTORY — A LEGEND IS BORN'
                : 'DEFEAT — BUT THE JOURNEY CONTINUES'}
            </p>

            <DividerLine />

            <div
              className={cn(
                'font-serif text-xl leading-relaxed my-6 whitespace-pre-line',
                isVictory ? 'text-stardust-100/90' : 'text-alert-200/90'
              )}
            >
              {endReason}
            </div>

            <DividerLine />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <StatCard
                icon={Calendar}
                label="用时天数"
                value={stats.totalDaysUsed}
                sub={`共 ${stats.totalDaysUsed} 天`}
              />
              <StatCard
                icon={Map}
                label="访问星球"
                value={stats.planetsVisited}
                sub={`${stats.planetsVisited} 颗星`}
              />
              <StatCard
                icon={AlertTriangle}
                label="解决事件"
                value={stats.eventsResolved}
                sub={`${stats.eventsResolved} 次`}
              />
              <StatCard
                icon={Coins}
                label="星币结余"
                value={stardust}
                sub={
                  stats.stardustEarned > 0
                    ? `赚取 ${stats.stardustEarned} / 花费 ${stats.stardustSpent}`
                    : undefined
                }
              />
              <StatCard
                icon={Backpack}
                label="物品使用"
                value={stats.itemsUsed}
                sub={`${stats.itemsUsed} 件物品`}
              />
              <StatCard
                icon={Sparkles}
                label="士气终值"
                value={`${morale}%`}
                sub={morale >= 60 ? '精神饱满' : morale >= 30 ? '勉强维持' : '低落不已'}
              />
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <GoldButton size="md" variant="primary" onClick={startNewGame} icon={RotateCcw}>
                再启新程
              </GoldButton>
              <GoldButton size="md" variant="ghost" onClick={returnToTitle} icon={Home}>
                返回标题
              </GoldButton>
            </div>
          </div>
        </DecorativeCard>
      </div>
    </div>
  );
}
