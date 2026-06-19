import { useGameStore } from '../../store/useGameStore';
import { calculateHeroCost, calculateHeroDPS } from '../../utils/calculator';
import { formatNumber } from '../../utils/formatter';
import { Hero } from '../../types/game';
import { Lock, ArrowUp } from 'lucide-react';

interface HeroCardProps {
  hero: Hero;
}

export function HeroCard({ hero }: HeroCardProps) {
  const gold = useGameStore(state => state.gold);
  const upgradeHero = useGameStore(state => state.upgradeHero);
  const state = useGameStore();

  const cost = calculateHeroCost(hero);
  const canAfford = gold >= cost;
  const dps = calculateHeroDPS(hero, state);

  if (!hero.unlocked) {
    return (
      <div className="relative p-4 rounded-2xl bg-gray-900/40 border border-gray-700/50 opacity-70">
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/50">
            <span className="text-3xl opacity-40 grayscale">{hero.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-gray-400 font-bold block truncate" style={{ fontFamily: 'Cinzel, serif' }}>
              {hero.name}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Lock className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600">
                第 {hero.unlockStage} 层解锁
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative p-4 rounded-2xl transition-all duration-300 ${
      canAfford
        ? 'bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-purple-900/40 border border-yellow-500/40 hover:border-yellow-400/70 hover:shadow-[0_0_30px_rgba(250,204,21,0.15)] hover:-translate-y-0.5'
        : 'bg-gradient-to-br from-purple-950/30 to-indigo-950/30 border border-gray-700/50'
    }`}>
      {hero.level > 0 && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-yellow-500/30" style={{ fontFamily: 'Cinzel, serif' }}>
            Lv.{hero.level}
          </div>
        </div>
      )}

      {canAfford && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent animate-shimmer" />
        </div>
      )}

      <div className="relative flex items-center gap-4">
        <div className={`relative w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 ${
          hero.level > 0
            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 shadow-lg shadow-yellow-500/10'
            : 'bg-gray-800/50 border border-gray-600/50'
        }`}>
          <span className="text-3xl drop-shadow-lg">{hero.icon}</span>
          {hero.level > 0 && dps > 0 && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
              {formatNumber(dps)}/s
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <span className="text-yellow-400 font-bold block truncate drop-shadow-sm" style={{ fontFamily: 'Cinzel, serif' }}>
            {hero.name}
          </span>
          <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
            {hero.description}
          </div>
          {hero.level > 0 && (
            <div className="flex items-center gap-3 mt-1 text-[11px]">
              <span className="text-gray-500">
                ⚔️ {formatNumber(hero.baseDamage * hero.level)}
              </span>
              <span className="text-gray-500">
                ⚡ {hero.attackSpeed}/s
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => upgradeHero(hero.id)}
        disabled={!canAfford}
        className={`relative w-full mt-4 py-2.5 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm overflow-hidden ${
          canAfford
            ? 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black hover:from-yellow-400 hover:via-amber-300 hover:to-yellow-400 hover:shadow-lg hover:shadow-yellow-500/30 active:scale-[0.97]'
            : 'bg-gray-800/60 text-gray-500 cursor-not-allowed border border-gray-700/50'
        }`}
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        {canAfford && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
        <ArrowUp className="w-4 h-4 relative z-10" />
        <span className="relative z-10">{hero.level === 0 ? '雇佣' : '升级'}</span>
        <span className="relative z-10 text-xs ml-1 opacity-80">
          ({formatNumber(cost)} 💰)
        </span>
      </button>
    </div>
  );
}
