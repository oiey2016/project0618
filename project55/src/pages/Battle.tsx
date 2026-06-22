import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, FastForward, Zap, MapPin } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useBattle } from '../hooks/useBattle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HealthBar } from '../components/game/HealthBar';
import { DamageNumbers } from '../components/game/DamageNumber';
import { FloatingTexts } from '../components/game/FloatingText';
import { BattleLog } from '../components/game/BattleLog';
import { formatNumber } from '../utils/formatter';

export default function Battle() {
  const {
    player,
    currentMonster,
    currentStage,
    isAutoBattle,
    isPaused,
    battleSpeed,
    startBattle,
    pauseBattle,
    toggleAutoBattle,
    setBattleSpeed,
    spawnMonster,
  } = useGameStore();
  
  const {
    damageNumbers,
    floatingTexts,
    battleLogs,
    playerAnimating,
    monsterAnimating,
    playerHit,
    monsterHit,
  } = useBattle();
  
  useEffect(() => {
    if (!currentMonster) {
      spawnMonster();
    }
  }, [currentMonster, spawnMonster]);
  
  const handleToggleBattle = () => {
    if (isPaused) {
      startBattle();
    } else {
      pauseBattle();
    }
  };
  
  const handleSpeedToggle = () => {
    const speeds = [1, 2, 3];
    const currentIndex = speeds.indexOf(battleSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setBattleSpeed(speeds[nextIndex]);
  };
  
  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-mint-500" />
            <span className="font-bold text-coffee-600">
              地牢第 <span className="text-mint-500">{currentStage}</span> 层
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeedToggle}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                battleSpeed > 1 ? 'bg-coral-100 text-coral-600' : 'bg-cream-100 text-coffee-400'
              }`}
            >
              <FastForward className="w-4 h-4" />
              {battleSpeed}x
            </button>
            <button
              onClick={toggleAutoBattle}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                isAutoBattle ? 'bg-mint-100 text-mint-600' : 'bg-cream-100 text-coffee-400'
              }`}
            >
              <Zap className="w-4 h-4" />
              自动
            </button>
          </div>
        </div>
        
        <div 
          className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-200 via-mint-100 to-cream-100"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 80%, rgba(127, 200, 169, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 60%, rgba(255, 180, 162, 0.2) 0%, transparent 50%)
            `
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cream-300/50 to-transparent" />
            <div className="absolute top-4 left-8 text-4xl opacity-30">☁️</div>
            <div className="absolute top-8 right-12 text-3xl opacity-20">☁️</div>
            <div className="absolute top-2 left-1/2 text-2xl opacity-25">☁️</div>
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <motion.div
              className={`relative ${playerAnimating ? 'animate-attack-right' : ''} ${playerHit ? 'animate-hit' : ''}`}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="text-6xl drop-shadow-lg">🧙‍♂️</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20">
                <HealthBar
                  current={player.hp}
                  max={player.maxHp}
                  size="sm"
                  showHeart={false}
                />
              </div>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {currentMonster && (
                <motion.div
                  key={currentMonster.id}
                  initial={{ opacity: 0, scale: 0.5, x: 50 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: 0,
                    y: [0, -5, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.5, x: 50 }}
                  transition={{
                    duration: 0.4,
                    y: {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  }}
                  className={`relative ${monsterAnimating ? 'animate-attack-left' : ''} ${monsterHit ? 'animate-hit animate-shake' : ''}`}
                >
                  <div className="text-6xl drop-shadow-lg">{currentMonster.icon}</div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                    <p className="text-xs font-bold text-coffee-600 bg-white/80 px-2 py-0.5 rounded-full mb-1">
                      Lv.{currentMonster.level} {currentMonster.name}
                    </p>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20">
                    <HealthBar
                      current={currentMonster.hp}
                      max={currentMonster.maxHp}
                      size="sm"
                      showHeart={false}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <DamageNumbers damages={damageNumbers} />
          <FloatingTexts texts={floatingTexts} />
          
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center text-white">
                <Pause className="w-12 h-12 mx-auto mb-2" />
                <p className="font-bold text-lg">战斗已暂停</p>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="mt-6 flex gap-3">
          <Button
            fullWidth
            variant={isPaused ? 'primary' : 'secondary'}
            onClick={handleToggleBattle}
            className="flex items-center justify-center gap-2"
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5" />
                开始战斗
              </>
            ) : (
              <>
                <Pause className="w-5 h-5" />
                暂停战斗
              </>
            )}
          </Button>
        </div>
        
        {currentMonster && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-cream-50 rounded-lg py-2">
              <p className="text-xs text-coffee-400">攻击力</p>
              <p className="font-mono font-bold text-coffee-600">{formatNumber(currentMonster.attack)}</p>
            </div>
            <div className="bg-cream-50 rounded-lg py-2">
              <p className="text-xs text-coffee-400">防御力</p>
              <p className="font-mono font-bold text-coffee-600">{formatNumber(currentMonster.defense)}</p>
            </div>
            <div className="bg-cream-50 rounded-lg py-2">
              <p className="text-xs text-coffee-400">金币掉落</p>
              <p className="font-mono font-bold text-yellow-600">{formatNumber(currentMonster.goldDrop)}</p>
            </div>
          </div>
        )}
      </Card>
      
      <Card>
        <h3 className="font-bold text-coffee-600 mb-3 flex items-center gap-2">
          📜 战斗日志
        </h3>
        <BattleLog logs={battleLogs} maxHeight="180px" />
      </Card>
    </div>
  );
}
