import { useEffect, useState } from 'react';
import { Skull, Swords, Shield, Heart } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { getLocationConfig } from '../data/locations';

export const BattleScene = () => {
  const { zombies, player, battleLog, getPlayerAttack, getPlayerDefense, currentLocationId, day } = useGameStore();
  const [damageFlash, setDamageFlash] = useState(false);

  useEffect(() => {
    if (zombies.length > 0) {
      setDamageFlash(true);
      const timer = setTimeout(() => setDamageFlash(false), 200);
      return () => clearTimeout(timer);
    }
  }, [zombies.length]);

  const totalZombieHealth = zombies.reduce((sum, z) => sum + z.health, 0);
  const totalZombieMaxHealth = zombies.reduce((sum, z) => sum + z.maxHealth, 0);

  const isExploreBattle = !!currentLocationId;
  const location = currentLocationId ? getLocationConfig(currentLocationId) : null;

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      bg-gradient-to-b from-red-950/80 via-wasteland-bg to-wasteland-bg
      transition-all duration-300
      ${damageFlash ? 'bg-red-900/50' : ''}
    `}>
      <div className="w-full max-w-2xl p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Skull className="w-8 h-8 text-red-500 animate-pulse" />
            <h2 className="text-2xl font-bold text-red-400 text-glow-danger">
              {isExploreBattle ? `探索遭遇 - ${location?.name}` : `第 ${day} 天 夜间袭击`}
            </h2>
            <Skull className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <p className="text-wasteland-muted">
            剩余僵尸: <span className="text-red-400 font-bold">{zombies.length}</span> 只
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card-wasteland p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-4xl">🧟</div>
              <div>
                <div className="font-bold text-red-400">僵尸</div>
                <div className="text-xs text-wasteland-muted">敌人</div>
              </div>
            </div>
            <div className="h-3 bg-wasteland-bg rounded-full overflow-hidden border border-wasteland-border">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                style={{ width: `${(totalZombieHealth / totalZombieMaxHealth) * 100}%` }}
              />
            </div>
            <div className="text-xs text-wasteland-muted mt-1 text-right">
              {Math.floor(totalZombieHealth)} / {Math.floor(totalZombieMaxHealth)}
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {zombies.slice(0, 10).map((zombie, idx) => (
                <div
                  key={idx}
                  className={`
                    w-6 h-8 rounded flex items-center justify-center text-lg
                    ${zombie.type === 'tank' ? 'bg-purple-900/50' : zombie.type === 'fast' ? 'bg-yellow-900/50' : 'bg-red-900/50'}
                  `}
                  title={`${zombie.type} - 攻击:${zombie.attack}`}
                >
                  🧟
                </div>
              ))}
              {zombies.length > 10 && (
                <div className="text-xs text-wasteland-muted flex items-center">
                  +{zombies.length - 10}
                </div>
              )}
            </div>
          </div>

          <div className="card-wasteland p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-4xl">🧑</div>
              <div>
                <div className="font-bold text-military-400">你</div>
                <div className="text-xs text-wasteland-muted">幸存者</div>
              </div>
            </div>
            <div className="h-3 bg-wasteland-bg rounded-full overflow-hidden border border-wasteland-border">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300"
                style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
              />
            </div>
            <div className="text-xs text-wasteland-muted mt-1 text-right">
              {Math.floor(player.health)} / {player.maxHealth}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center gap-1 text-xs">
                <Swords className="w-3 h-3 text-red-400" />
                <span className="text-wasteland-muted">攻击</span>
                <span className="text-red-400 font-bold">{getPlayerAttack()}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Shield className="w-3 h-3 text-blue-400" />
                <span className="text-wasteland-muted">防御</span>
                <span className="text-blue-400 font-bold">{getPlayerDefense()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-wasteland p-3 max-h-40 overflow-y-auto">
          <div className="text-xs text-wasteland-muted mb-2 flex items-center gap-1">
            <Heart className="w-3 h-3" />
            战斗日志
          </div>
          <div className="space-y-1">
            {battleLog.slice().reverse().map((log, idx) => (
              <div
                key={idx}
                className={`text-sm ${
                  idx === 0 ? 'text-wasteland-text' : 'text-wasteland-muted'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-700 rounded-lg animate-pulse">
            <Swords className="w-5 h-5 text-red-400" />
            <span className="text-red-300">战斗进行中...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
