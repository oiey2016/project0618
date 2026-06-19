import { motion } from 'framer-motion';
import { Users, TrendingUp, Plus } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { MINER_TYPES, getMinerCost, getMinerEfficiency } from '@/data/miners';
import { getMinerUpgradeCost } from '@/data/upgrades';
import { formatGold, formatPerSecond } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

export const MinerPanel = () => {
  const gold = useGameStore((state) => state.gold);
  const miners = useGameStore((state) => state.miners);
  const hireMiner = useGameStore((state) => state.hireMiner);
  const upgradeMiner = useGameStore((state) => state.upgradeMiner);
  const getTotalMinerEfficiency = useGameStore((state) => state.getTotalMinerEfficiency);

  const totalEfficiency = getTotalMinerEfficiency();

  const handleHire = (typeId: string) => {
    hireMiner(typeId);
  };

  const handleUpgrade = (minerId: string) => {
    upgradeMiner(minerId);
  };

  const getHiredMiner = (typeId: string) => {
    return miners.find((m) => m.typeId === typeId);
  };

  return (
    <div className="space-y-4">
      <Card variant="gold" className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Users className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-400">矿工总效率</h3>
            <p className="text-2xl font-bold text-white">
              {formatPerSecond(totalEfficiency)}
            </p>
          </div>
        </div>
        <ProgressBar
          value={totalEfficiency}
          max={1000}
          color="amber"
          className="mt-3"
        />
      </Card>

      <div className="space-y-3">
        {MINER_TYPES.map((minerType, index) => {
          const hired = getHiredMiner(minerType.id);
          const count = hired?.count || 0;
          const level = hired?.level || 1;
          const hireCost = getMinerCost(minerType.baseCost, count);
          const upgradeCost = hired ? getMinerUpgradeCost(minerType.baseCost, level) : 0;
          const canHire = gold >= hireCost;
          const canUpgrade = hired && gold >= upgradeCost;
          const efficiency = getMinerEfficiency(minerType.baseEfficiency, level, 1);

          return (
            <motion.div
              key={minerType.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-4xl" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' }}>
                    {minerType.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{minerType.name}</h4>
                      {count > 0 && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">
                          Lv.{level} × {count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {minerType.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">
                        效率: {formatPerSecond(efficiency)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleHire(minerType.id)}
                        disabled={!canHire}
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        {count > 0 ? '招募' : '解锁'}
                        <span className="text-xs opacity-80">{formatGold(hireCost)}</span>
                      </Button>
                      {hired && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleUpgrade(hired.id)}
                          disabled={!canUpgrade}
                          className="flex items-center gap-1"
                        >
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs">{formatGold(upgradeCost)}</span>
                        </Button>
                      )}
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
