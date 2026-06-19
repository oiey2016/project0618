import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pickaxe, ArrowDown } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { getAvailableOres, getCurrentOre } from '@/data/ores';
import { getMineDepthCost } from '@/data/upgrades';
import { formatNumber, formatGold } from '@/utils/formatters';
import { OreParticle } from './OreParticle';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Particle } from '@/types/game';

export const MineShaft = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const mineRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  const gold = useGameStore((state) => state.gold);
  const mineDepth = useGameStore((state) => state.mineDepth);
  const ores = useGameStore((state) => state.ores);
  const clickMine = useGameStore((state) => state.clickMine);
  const upgradeMineDepth = useGameStore((state) => state.upgradeMineDepth);
  const getStorageCapacity = useGameStore((state) => state.getStorageCapacity);
  const miners = useGameStore((state) => state.miners);

  const availableOres = getAvailableOres(mineDepth);
  const currentOre = getCurrentOre(mineDepth);
  const upgradeCost = getMineDepthCost(mineDepth);
  const canUpgrade = gold >= upgradeCost;
  const storageCapacity = getStorageCapacity();

  const currentOreAmount = ores[currentOre.id] || 0;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mineRef.current) return;

      const rect = mineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const result = clickMine();
      if (result) {
        const newParticle: Particle = {
          id: particleIdRef.current++,
          x,
          y,
          oreId: result.oreId,
          value: result.value,
        };

        setParticles((prev) => [...prev, newParticle]);

        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, 1000);
      }

      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 100);
    },
    [clickMine]
  );

  const handleUpgrade = () => {
    upgradeMineDepth();
  };

  const getLayerColor = (depth: number) => {
    const colors = [
      'from-amber-900/80',
      'from-amber-800/70',
      'from-stone-700/80',
      'from-stone-600/70',
      'from-stone-800/80',
    ];
    return colors[depth % colors.length];
  };

  const getMinerEmojis = () => {
    const emojis: string[] = [];
    miners.forEach((miner) => {
      const minerType = miner.typeId === 'apprentice' ? '👷' :
                        miner.typeId === 'miner' ? '⛏️' :
                        miner.typeId === 'foreman' ? '🧔' :
                        miner.typeId === 'driller' ? '🤖' :
                        miner.typeId === 'engineer' ? '👨‍🔬' :
                        miner.typeId === 'executive' ? '👨‍💼' :
                        miner.typeId === 'robot' ? '🦾' : '🔮';
      for (let i = 0; i < Math.min(miner.count, 3); i++) {
        emojis.push(minerType);
      }
    });
    return emojis;
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-stone-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-amber-400">⛏️ 矿井深度</h2>
            <p className="text-stone-400 text-sm">第 {mineDepth} 层</p>
          </div>
          <Button
            variant="success"
            size="sm"
            onClick={handleUpgrade}
            disabled={!canUpgrade}
            className="flex items-center gap-1"
          >
            <ArrowDown className="w-4 h-4" />
            深挖
          </Button>
        </div>
        <p className="text-xs text-stone-400">
          升级费用: {formatGold(upgradeCost)}
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-stone-700">
          <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-stone-300">
            矿石库存
          </span>
          <span className="text-sm font-bold" style={{ color: currentOre.color }}>
            {currentOre.emoji} {formatNumber(currentOreAmount)} / {formatNumber(storageCapacity)}
          </span>
          </div>
          <ProgressBar
            value={currentOreAmount}
            max={storageCapacity}
            color="amber"
          />
        </div>

        <div className="flex gap-2 p-3 border-b border-stone-700 overflow-x-auto">
          {availableOres.map((ore) => (
            <div
              key={ore.id}
              className="flex items-center gap-1 px-2 py-1 bg-stone-800 rounded text-xs whitespace-nowrap"
              title={`${ore.name}: ${formatNumber(ores[ore.id] || 0)}`}
            >
              <span>{ore.emoji}</span>
              <span className="text-stone-300">{formatNumber(ores[ore.id] || 0)}</span>
            </div>
          ))}
        </div>

        <div
          ref={mineRef}
          onClick={handleClick}
          className="flex-1 relative overflow-hidden cursor-pointer select-none min-h-[300px]"
          style={{
            background: 'linear-gradient(180deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
          }}
        >
          <div className="absolute inset-0 flex flex-col">
            {[...Array(Math.min(mineDepth, 10))].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex-1 relative ${getLayerColor(index)} bg-gradient-to-b to-stone-800 border-b border-stone-900/50`}
              >
                <div className="absolute inset-0 opacity-30">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-stone-600 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 3) * 20}%`,
                      }}
                    />
                  ))}
                </div>

                {index === Math.min(mineDepth, 10) - 1 && (
                  <div className="absolute right-4 bottom-4">
                    <span className="text-4xl">⛰️</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-8 left-4 flex gap-1">
            {getMinerEmojis().map((emoji, i) => {
              const animationProps = {
                y: [0, -5, 0],
              };
              const transitionProps = {
                duration: 0.5,
                delay: i * 0.1,
                repeat: 999999,
                repeatDelay: 2,
              };
              return (
                <motion.span
                  key={i}
                  animate={animationProps}
                  transition={transitionProps}
                  className="text-2xl"
                >
                  {emoji}
                </motion.span>
              );
            })}
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={isClicking ? { scale: 1.2, rotate: -10 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.1 }}
              className="text-center"
            >
              <Pickaxe className="w-16 h-16 text-amber-400 drop-shadow-lg" />
              <p className="text-amber-300 text-sm mt-2 font-bold">点击挖矿!</p>
            </motion.div>
          </div>

          <OreParticle particles={particles} />

          <div className="absolute top-4 right-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: 999999 }}
              className="text-5xl"
              style={{ filter: `drop-shadow(0 0 15px ${currentOre.color})` }}
            >
              {currentOre.emoji}
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
};
