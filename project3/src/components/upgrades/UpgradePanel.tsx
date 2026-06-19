import { useGameStore } from '../../store/useGameStore';
import { UpgradeCard } from './UpgradeCard';
import { TrendingUp, Flame } from 'lucide-react';

export function UpgradePanel() {
  const upgrades = useGameStore(state => state.upgrades);
  const totalLevels = upgrades.reduce((sum, u) => sum + u.level, 0);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="relative px-4 pt-4 pb-3 border-b border-purple-800/30">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center border border-green-500/40">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-green-400 font-bold text-base leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                  强化
                </h3>
                <p className="text-gray-500 text-[10px]">
                  总等级 Lv.{totalLevels}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500">效果类型</div>
              <div className="text-xs text-green-400 font-medium">永久属性</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {upgrades.map(upgrade => (
          <UpgradeCard key={upgrade.id} upgrade={upgrade} />
        ))}

        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/40">
          <h4 className="flex items-center gap-2 text-gray-200 font-bold text-sm mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
            <Flame className="w-4 h-4 text-orange-400" />
            强化指南
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <span className="text-lg flex-shrink-0">👆</span>
              <div>
                <div className="text-xs text-gray-200 font-medium">点击强化</div>
                <div className="text-[10px] text-gray-500">提升每次点击造成的伤害</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
              <span className="text-lg flex-shrink-0">⚔️</span>
              <div>
                <div className="text-xs text-gray-200 font-medium">英雄强化</div>
                <div className="text-[10px] text-gray-500">提升所有英雄的伤害输出</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <span className="text-lg flex-shrink-0">💎</span>
              <div>
                <div className="text-xs text-gray-200 font-medium">金币猎手</div>
                <div className="text-[10px] text-gray-500">增加击杀怪物获得的金币</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
              <span className="text-lg flex-shrink-0">🎯</span>
              <div>
                <div className="text-xs text-gray-200 font-medium">暴击精通</div>
                <div className="text-[10px] text-gray-500">提高攻击时的暴击几率</div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-yellow-400/90 flex items-start gap-1.5">
              <span>💡</span>
              <span>提示：优先升级能让你快速推进层数的属性！</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
