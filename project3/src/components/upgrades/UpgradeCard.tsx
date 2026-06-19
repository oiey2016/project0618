import { useGameStore } from '../../store/useGameStore';
import { calculateUpgradeCost } from '../../utils/calculator';
import { formatNumber } from '../../utils/formatter';
import { Upgrade } from '../../types/game';
import { ArrowUp } from 'lucide-react';

interface UpgradeCardProps {
  upgrade: Upgrade;
}

export function UpgradeCard({ upgrade }: UpgradeCardProps) {
  const gold = useGameStore(state => state.gold);
  const upgradeUpgrade = useGameStore(state => state.upgradeUpgrade);

  const cost = calculateUpgradeCost(upgrade);
  const canAfford = gold >= cost;

  const getEffectText = () => {
    const value = (upgrade.effectValue * 100).toFixed(0);
    const totalValue = (upgrade.effectValue * upgrade.level * 100).toFixed(0);
    switch (upgrade.effectType) {
      case 'click':
        return `点击伤害 +${value}%`;
      case 'dps':
        return `英雄伤害 +${value}%`;
      case 'gold':
        return `金币掉落 +${value}%`;
      case 'crit':
        return `暴击几率 +${value}%`;
      default:
        return '';
    }
  };

  const getTotalText = () => {
    const totalValue = (upgrade.effectValue * upgrade.level * 100).toFixed(0);
    return `当前 +${totalValue}%`;
  };

  return (
    <div className={`relative p-4 rounded-2xl transition-all duration-300 ${
      canAfford
        ? 'bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-900/30 border border-green-500/40 hover:border-green-400/70 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-0.5'
        : 'bg-gradient-to-br from-green-950/20 to-emerald-950/20 border border-gray-700/50'
    }`}>
      {upgrade.level > 0 && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-green-500/30" style={{ fontFamily: 'Cinzel, serif' }}>
            Lv.{upgrade.level}
          </div>
        </div>
      )}

      {canAfford && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent animate-shimmer" />
        </div>
      )}

      <div className="relative flex items-start gap-4">
        <div className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0 ${
          upgrade.level > 0
            ? 'bg-gradient-to-br from-green-500/25 to-emerald-500/25 border-2 border-green-500/40 shadow-lg shadow-green-500/10'
            : 'bg-gray-800/50 border border-gray-600/50'
        }`}>
          <span className="text-2xl">{upgrade.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-green-400 font-bold truncate" style={{ fontFamily: 'Cinzel, serif' }}>
              {upgrade.name}
            </span>
          </div>
          
          <div className="text-xs text-gray-400 mt-0.5">
            {upgrade.description}
          </div>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-400 font-medium">{getEffectText()}</span>
              {upgrade.level > 0 && (
                <span className="text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {getTotalText()}
                </span>
              )}
            </div>
            {upgrade.level > 0 && (
              <div className="h-1.5 bg-gray-800/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(upgrade.level * 5, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => upgradeUpgrade(upgrade.id)}
        disabled={!canAfford}
        className={`relative w-full mt-4 py-2.5 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm overflow-hidden ${
          canAfford
            ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 text-white hover:from-green-400 hover:via-emerald-300 hover:to-green-400 hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.97]'
            : 'bg-gray-800/60 text-gray-500 cursor-not-allowed border border-gray-700/50'
        }`}
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        {canAfford && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
        <ArrowUp className="w-4 h-4 relative z-10" />
        <span className="relative z-10">强化</span>
        <span className="relative z-10 text-xs ml-1 opacity-80">
          ({formatNumber(cost)} 💰)
        </span>
      </button>
    </div>
  );
}
