import { motion } from 'framer-motion';
import { Truck, Package, RefreshCw, Moon, Zap, ArrowUp } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { LOGISTICS_UPGRADES, getLogisticsCost } from '@/data/upgrades';
import { formatGold, formatNumber, formatPerSecond } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

export const LogisticsPanel = () => {
  const gold = useGameStore((state) => state.gold);
  const logistics = useGameStore((state) => state.logistics);
  const upgradeLogistics = useGameStore((state) => state.upgradeLogistics);
  const getLogisticsSpeed = useGameStore((state) => state.getLogisticsSpeed);
  const getStorageCapacity = useGameStore((state) => state.getStorageCapacity);
  const getAutomationRate = useGameStore((state) => state.getAutomationRate);
  const getGoldPerSecond = useGameStore((state) => state.getGoldPerSecond);

  const logisticsSpeed = getLogisticsSpeed();
  const storageCapacity = getStorageCapacity();
  const automationRate = getAutomationRate();
  const goldPerSecond = getGoldPerSecond();
  const autoGoldPerSecond = goldPerSecond * automationRate;

  const getIcon = (id: string) => {
    switch (id) {
      case 'transport': return <Truck className="w-6 h-6" />;
      case 'storage': return <Package className="w-6 h-6" />;
      case 'automation': return <RefreshCw className="w-6 h-6" />;
      case 'offline': return <Moon className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  const getEffectDisplay = (id: string, level: number) => {
    const upgrade = LOGISTICS_UPGRADES.find(u => u.id === id);
    if (!upgrade) return '';
    const effect = level * upgrade.effect * 100;
    switch (id) {
      case 'transport': return `+${effect.toFixed(0)}% 速度`;
      case 'storage': return `+${effect.toFixed(0)}% 容量`;
      case 'automation': return `${effect.toFixed(0)}% 自动售卖`;
      case 'offline': return `+${effect.toFixed(0)}% 离线效率`;
      default: return '';
    }
  };

  const handleUpgrade = (upgradeId: string) => {
    upgradeLogistics(upgradeId);
  };

  return (
    <div className="space-y-4">
      <Card variant="gold" className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-stone-400">运输速度</span>
            </div>
            <p className="text-lg font-bold text-white">{logisticsSpeed.toFixed(1)}×</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-stone-400">仓库容量</span>
            </div>
            <p className="text-lg font-bold text-white">{formatNumber(storageCapacity)}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-green-400" />
              <span className="text-sm text-stone-400">自动售卖</span>
            </div>
            <p className="text-lg font-bold text-white">{(automationRate * 100).toFixed(0)}%</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-stone-400">自动收入</span>
            </div>
            <p className="text-lg font-bold text-amber-400">{formatPerSecond(autoGoldPerSecond)}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {LOGISTICS_UPGRADES.map((upgrade, index) => {
          const level = logistics[upgrade.id] || 0;
          const cost = getLogisticsCost(upgrade.baseCost, level);
          const canUpgrade = gold >= cost && level < upgrade.maxLevel;
          const isMaxed = level >= upgrade.maxLevel;

          return (
            <motion.div
              key={upgrade.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}
                  >
                    <span className="text-amber-400">{getIcon(upgrade.id)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{upgrade.name}</h4>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">
                        Lv.{level} / {upgrade.maxLevel}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      {upgrade.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-green-400">
                        {getEffectDisplay(upgrade.id, level)}
                      </span>
                      {!isMaxed && (
                        <span className="text-xs text-stone-500">
                          → {getEffectDisplay(upgrade.id, level + 1)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <ProgressBar
                        value={level}
                        max={upgrade.maxLevel}
                        color="green"
                      />
                    </div>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant={isMaxed ? 'secondary' : 'success'}
                        onClick={() => handleUpgrade(upgrade.id)}
                        disabled={!canUpgrade}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        {isMaxed ? (
                          '已满级'
                        ) : (
                          <>
                            <ArrowUp className="w-4 h-4" />
                            升级
                            <span className="text-xs opacity-80">{formatGold(cost)}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
