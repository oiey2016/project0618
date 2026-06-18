import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getAvailableUpgrades } from '../game/logic';
import { calculateUpgradeCost, formatNumber } from '../game/utils';
import { UPGRADES } from '../game/config';

export const UpgradePanel = () => {
  const state = useGameStore((s) => s.state);
  const purchaseUpgrade = useGameStore((s) => s.purchaseUpgrade);

  const availableUpgrades = getAvailableUpgrades(state);

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="w-80 bg-white/95 backdrop-blur-md border-r border-amber-200 shadow-xl flex flex-col"
    >
      <div className="p-4 border-b border-amber-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          科技升级
        </h2>
        <p className="text-xs text-gray-500 mt-1">提升你的产蛋效率</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {availableUpgrades.map((upgrade, index) => {
          const level = state.upgrades[upgrade.id] || 0;
          const cost = calculateUpgradeCost(
            upgrade.baseCost,
            upgrade.costMultiplier,
            level
          );
          const canAfford = state.eggs >= cost;
          const effectTypeText =
            upgrade.effectType === 'click'
              ? '点击'
              : upgrade.effectType === 'auto'
              ? '自动'
              : '倍率';

          return (
            <motion.button
              key={upgrade.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => purchaseUpgrade(upgrade.id)}
              disabled={!canAfford}
              className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                canAfford
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-amber-400 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-gray-50 border-2 border-gray-200 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`text-3xl ${
                    canAfford ? 'animate-bounce' : 'grayscale'
                  }`}
                  style={{ animationDuration: '3s' }}
                >
                  {upgrade.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 truncate">
                      {upgrade.name}
                    </h3>
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      Lv.{level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {upgrade.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs">
                      <span className="text-gray-400">{effectTypeText}:</span>
                      <span className="text-green-600 font-medium ml-1">
                        +{formatNumber(upgrade.baseEffect * (level + 1))}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 font-bold text-sm ${
                        canAfford ? 'text-amber-600' : 'text-gray-400'
                      }`}
                    >
                      <span>🥚</span>
                      <span>{formatNumber(cost)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}

        {state.currentStage < 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 text-center text-gray-400 text-sm"
          >
            <div className="text-2xl mb-2">🔒</div>
            <p>继续积累鸡蛋解锁更多科技！</p>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-amber-100 bg-amber-50/50">
        <div className="text-xs text-gray-500">
          <div className="flex justify-between mb-1">
            <span>总升级次数</span>
            <span className="font-medium text-gray-700">
              {Object.values(state.upgrades).reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>效率倍率</span>
            <span className="font-medium text-amber-600">
              x{state.multiplier.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
