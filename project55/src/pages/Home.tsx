import { motion } from 'framer-motion';
import { Swords, Trophy, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatItem } from '../components/ui/StatItem';
import { Button } from '../components/ui/Button';
import { formatNumber, formatPercent } from '../utils/formatter';
import { getEquipmentStats } from '../data/equipment';

export default function Home() {
  const navigate = useNavigate();
  const { player, gold, equipment, currentStage, highestStage, monstersKilled, getPlayerTotalStats } = useGameStore();
  const totalStats = getPlayerTotalStats();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants}>
        <Card gradient className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint-200/30 to-coral-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex items-start gap-4">
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-mint-300 to-coral-300 flex items-center justify-center text-4xl shadow-lg"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🧙‍♂️
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-xl font-bold text-coffee-600">
                  勇敢的冒险者
                </h2>
                <span className="px-2 py-0.5 bg-mint-100 text-mint-600 text-xs font-bold rounded-full">
                  Lv.{player.level}
                </span>
              </div>
              
              <ProgressBar
                value={player.exp}
                max={player.maxExp}
                color="purple"
                height="sm"
                showLabel
                label={`经验: ${formatNumber(player.exp)} / ${formatNumber(player.maxExp)}`}
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card>
          <h3 className="font-bold text-coffee-600 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            冒险统计
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatItem
              icon="🏰"
              label="当前层数"
              value={currentStage}
              color="mint"
            />
            <StatItem
              icon="👑"
              label="最高层数"
              value={highestStage}
              color="coral"
            />
            <StatItem
              icon="⚔️"
              label="击杀怪物"
              value={formatNumber(monstersKilled)}
              color="lavender"
            />
            <StatItem
              icon="💰"
              label="拥有金币"
              value={formatNumber(gold)}
              color="yellow"
            />
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card>
          <h3 className="font-bold text-coffee-600 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-mint-500" />
            角色属性
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-mint-50 rounded-lg">
              <span className="text-coffee-500 flex items-center gap-2">
                <span>❤️</span> 生命值
              </span>
              <span className="font-mono font-bold text-coffee-600">
                {formatNumber(totalStats.maxHp)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-coral-50 rounded-lg">
              <span className="text-coffee-500 flex items-center gap-2">
                <span>⚔️</span> 攻击力
              </span>
              <span className="font-mono font-bold text-coffee-600">
                {formatNumber(totalStats.attack)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-lavender-100 rounded-lg">
              <span className="text-coffee-500 flex items-center gap-2">
                <span>🛡️</span> 防御力
              </span>
              <span className="font-mono font-bold text-coffee-600">
                {formatNumber(totalStats.defense)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                <span className="text-coffee-500 flex items-center gap-2 text-sm">
                  <span>🎯</span> 暴击率
                </span>
                <span className="font-mono font-bold text-coffee-600 text-sm">
                  {formatPercent(totalStats.critRate)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                <span className="text-coffee-500 flex items-center gap-2 text-sm">
                  <span>💥</span> 暴击伤害
                </span>
                <span className="font-mono font-bold text-coffee-600 text-sm">
                  {formatPercent(totalStats.critDamage)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card>
          <h3 className="font-bold text-coffee-600 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-lavender-500" />
            当前装备
          </h3>
          <div className="flex justify-around">
            {equipment.map((eq) => {
              const stats = getEquipmentStats(eq);
              const statEntries = Object.entries(stats);
              
              return (
                <motion.div
                  key={eq.id}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="hex-slot bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-3xl mb-1">
                    {eq.icon}
                  </div>
                  <p className="text-xs font-bold text-coffee-600">{eq.name}</p>
                  <p className="text-xs text-mint-500 font-mono">+{eq.level}</p>
                  {statEntries.length > 0 && (
                    <p className="text-xs text-coffee-400 mt-0.5">
                      {statEntries.map(([k, v]) => 
                        k === 'critRate' || k === 'critDamage' 
                          ? `+${formatPercent(v as number)}` 
                          : `+${Math.floor(v as number)}`
                      ).join(' ')}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/battle')}
          className="text-lg"
        >
          <Swords className="w-5 h-5 inline mr-2" />
          开始冒险
        </Button>
      </motion.div>
    </motion.div>
  );
}
