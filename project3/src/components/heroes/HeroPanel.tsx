import { useGameStore } from '../../store/useGameStore';
import { HeroCard } from './HeroCard';
import { Users } from 'lucide-react';

export function HeroPanel() {
  const heroes = useGameStore(state => state.heroes);
  const unlockedCount = heroes.filter(h => h.unlocked).length;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="relative px-4 pt-4 pb-3 border-b border-purple-800/30">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center border border-yellow-500/40">
                <Users className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-yellow-400 font-bold text-base leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                  英雄
                </h3>
                <p className="text-gray-500 text-[10px]">
                  {unlockedCount}/{heroes.length} 已解锁
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500">自动攻击</div>
              <div className="text-xs text-blue-400 font-medium">挂机收益</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {heroes.map(hero => (
          <HeroCard key={hero.id} hero={hero} />
        ))}
      </div>
    </div>
  );
}
