import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Coins, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getEquipmentStats, getUpgradeCost } from '../data/equipment';
import { formatNumber, formatPercent, getStatName } from '../utils/formatter';
import type { Equipment } from '../types/game';

export default function EquipmentPage() {
  const { equipment, gold, upgradeEquipment, getPlayerTotalStats } = useGameStore();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(equipment[0] || null);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  
  const totalStats = getPlayerTotalStats();
  
  const handleUpgrade = (eq: Equipment) => {
    if (gold < getUpgradeCost(eq)) return;
    if (eq.level >= eq.maxLevel) return;
    
    setUpgradingId(eq.id);
    
    setTimeout(() => {
      const success = upgradeEquipment(eq.id);
      if (success) {
        setSelectedEquipment(equipment.find(e => e.id === eq.id) || null);
      }
      setUpgradingId(null);
    }, 300);
  };
  
  const selectedStats = selectedEquipment ? getEquipmentStats(selectedEquipment) : {};
  const selectedUpgradeCost = selectedEquipment ? getUpgradeCost(selectedEquipment) : 0;
  const canUpgrade = selectedEquipment && gold >= selectedUpgradeCost && selectedEquipment.level < selectedEquipment.maxLevel;
  
  const typeLabels = {
    weapon: '⚔️ 武器',
    armor: '🛡️ 护甲',
    accessory: '💍 饰品',
  };
  
  return (
    <div className="space-y-4">
      <Card gradient>
        <h2 className="font-display text-xl font-bold text-coffee-600 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          装备强化
        </h2>
        
        <div className="flex justify-center gap-6 mb-6">
          {equipment.map((eq) => {
            const stats = getEquipmentStats(eq);
            const isSelected = selectedEquipment?.id === eq.id;
            const cost = getUpgradeCost(eq);
            const canAfford = gold >= cost && eq.level < eq.maxLevel;
            const isUpgrading = upgradingId === eq.id;
            
            return (
              <motion.button
                key={eq.id}
                onClick={() => setSelectedEquipment(eq)}
                className={`relative flex flex-col items-center transition-all ${
                  isSelected ? 'scale-110' : 'hover:scale-105'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={isUpgrading ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                } : {}}
              >
                {isSelected && (
                  <motion.div
                    layoutId="equipmentGlow"
                    className="absolute -inset-2 rounded-full bg-gradient-to-r from-mint-300 to-coral-300 opacity-30 blur-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div
                  className={`hex-slot relative z-10 flex items-center justify-center text-3xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-mint-200 to-coral-200 shadow-lg'
                      : canAfford
                      ? 'bg-gradient-to-br from-cream-100 to-cream-200 hover:from-mint-100 hover:to-coral-100'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 opacity-70'
                  }`}
                >
                  {eq.icon}
                  <span className="absolute -top-1 -right-1 bg-coral-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {eq.level}
                  </span>
                </div>
                
                <p className={`mt-2 text-xs font-bold ${isSelected ? 'text-mint-600' : 'text-coffee-500'}`}>
                  {eq.name}
                </p>
              </motion.button>
            );
          })}
        </div>
        
        <AnimatePresence mode="wait">
          {selectedEquipment && (
            <motion.div
              key={selectedEquipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-cream-50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-coffee-600 text-lg flex items-center gap-2">
                    {selectedEquipment.icon} {selectedEquipment.name}
                    <span className="text-sm text-mint-500">+{selectedEquipment.level}</span>
                  </h3>
                  <p className="text-sm text-coffee-400">
                    {typeLabels[selectedEquipment.type]} · 最高等级 {selectedEquipment.maxLevel}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm font-bold text-coffee-500 mb-2">当前属性</p>
                {Object.entries(selectedStats).length > 0 ? (
                  Object.entries(selectedStats).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2 bg-white rounded-lg"
                    >
                      <span className="text-coffee-500">{getStatName(key)}</span>
                      <span className="font-mono font-bold text-mint-600">
                        {key === 'critRate' || key === 'critDamage'
                          ? `+${formatPercent(value as number)}`
                          : `+${Math.floor(value as number)}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-coffee-400 text-sm">该装备暂无属性加成</p>
                )}
                
                {selectedEquipment.level < selectedEquipment.maxLevel && (
                  <>
                    <p className="text-sm font-bold text-coffee-500 mt-4 mb-2">升级后</p>
                    {Object.entries(selectedStats).map(([key, value]) => {
                      const nextLevelMultiplier = 1 + selectedEquipment.level * 0.1;
                      const currentMultiplier = 1 + (selectedEquipment.level - 1) * 0.1;
                      const increase = (value as number) * (nextLevelMultiplier / currentMultiplier - 1);
                      
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-2 bg-coral-50 rounded-lg"
                        >
                          <span className="text-coffee-500">{getStatName(key)}</span>
                          <span className="font-mono font-bold text-coral-600">
                            +{key === 'critRate' || key === 'critDamage'
                              ? formatPercent(increase)
                              : Math.floor(increase)}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              
              {selectedEquipment.level >= selectedEquipment.maxLevel ? (
                <div className="text-center py-4 bg-mint-50 rounded-xl">
                  <p className="font-bold text-mint-600">✨ 已达到最高等级！</p>
                </div>
              ) : (
                <Button
                  fullWidth
                  disabled={!canUpgrade || upgradingId === selectedEquipment.id}
                  onClick={() => handleUpgrade(selectedEquipment)}
                  className="flex items-center justify-center gap-2"
                >
                  <ArrowUp className="w-5 h-5" />
                  升级装备
                  <span className="flex items-center gap-1 ml-2">
                    <Coins className="w-4 h-4 text-yellow-300" />
                    {formatNumber(selectedUpgradeCost)}
                  </span>
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      
      <Card>
        <h3 className="font-bold text-coffee-600 mb-3 flex items-center gap-2">
          📊 角色总属性
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-mint-50 rounded-xl">
            <p className="text-xs text-coffee-400">❤️ 生命值</p>
            <p className="font-mono font-bold text-lg text-coffee-600">
              {formatNumber(totalStats.maxHp)}
            </p>
          </div>
          <div className="p-3 bg-coral-50 rounded-xl">
            <p className="text-xs text-coffee-400">⚔️ 攻击力</p>
            <p className="font-mono font-bold text-lg text-coffee-600">
              {formatNumber(totalStats.attack)}
            </p>
          </div>
          <div className="p-3 bg-lavender-100 rounded-xl">
            <p className="text-xs text-coffee-400">🛡️ 防御力</p>
            <p className="font-mono font-bold text-lg text-coffee-600">
              {formatNumber(totalStats.defense)}
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-xl">
            <p className="text-xs text-coffee-400">🎯 暴击率</p>
            <p className="font-mono font-bold text-lg text-coffee-600">
              {formatPercent(totalStats.critRate)}
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-xl col-span-2">
            <p className="text-xs text-coffee-400">💥 暴击伤害</p>
            <p className="font-mono font-bold text-lg text-coffee-600">
              {formatPercent(totalStats.critDamage)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
