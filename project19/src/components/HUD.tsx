import React, { useEffect, useState } from 'react';
import { useGameStore } from '../game/store';
import { TOTAL_KEYS, COLORS } from '../game/constants';

const HUD: React.FC = () => {
  const collectedKeys = useGameStore((state) => state.collectedKeys);
  const isChasing = useGameStore((state) => state.isChasing);
  const isHiding = useGameStore((state) => state.isHiding);
  const enemyState = useGameStore((state) => state.enemy.state);
  const gameTime = useGameStore((state) => state.gameTime);
  const doorUnlocked = useGameStore((state) => state.door.unlocked);

  const [displayTime, setDisplayTime] = useState(0);
  const [heartbeatScale, setHeartbeatScale] = useState(1);

  useEffect(() => {
    setDisplayTime(Math.floor(gameTime));
  }, [gameTime]);

  useEffect(() => {
    if (isChasing) {
      const interval = setInterval(() => {
        setHeartbeatScale((s) => (s === 1 ? 1.3 : 1));
      }, 250);
      return () => clearInterval(interval);
    } else {
      setHeartbeatScale(1);
    }
  }, [isChasing]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEnemyStatusText = (): string => {
    if (isHiding) return '😶‍🌫️ 躲藏中...';
    if (isChasing) return '😱 发现你了！';
    if (enemyState === 'search') return '🔍 搜寻中...';
    return '😴 巡逻中';
  };

  const getEnemyStatusColor = (): string => {
    if (isHiding) return 'text-ice-mint';
    if (isChasing) return 'text-warning-red animate-pulse';
    if (enemyState === 'search') return 'text-creep-yellow';
    return 'text-white/70';
  };

  return (
    <div className="absolute inset-x-0 top-0 z-20 pointer-events-none p-4">
      <div className="flex justify-between items-start max-w-6xl mx-auto">
        <div className="bg-dark-card/80 backdrop-blur-sm rounded-lg p-4 border border-ice-pink/30">
          <div className="font-vt323 text-ice-pink text-sm mb-2">🔑 钥匙</div>
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_KEYS }).map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition-all duration-300 ${
                  i < collectedKeys
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 scale-110 shadow-lg shadow-yellow-500/50'
                    : 'bg-dark-bg border-2 border-white/20'
                }`}
              >
                {i < collectedKeys ? '🔑' : '❔'}
              </div>
            ))}
          </div>
          {collectedKeys >= TOTAL_KEYS && (
            <div className="mt-2 font-vt323 text-ice-mint text-sm animate-pulse">
              ✓ 门已解锁！快去开门！
            </div>
          )}
        </div>

        <div className="bg-dark-card/80 backdrop-blur-sm rounded-lg p-4 border border-warning-red/30">
          <div className="font-vt323 text-warning-red text-sm mb-2">👁️ 司机状态</div>
          <div className={`font-vt323 text-xl ${getEnemyStatusColor()}`}>
            {getEnemyStatusText()}
          </div>
          {isChasing && (
            <div
              className="mt-2 flex items-center gap-2"
              style={{ transform: `scale(${heartbeatScale})`, transition: 'transform 0.1s' }}
            >
              <span className="text-2xl">❤️</span>
              <span className="font-vt323 text-warning-red text-sm">快躲起来！</span>
            </div>
          )}
        </div>

        <div className="bg-dark-card/80 backdrop-blur-sm rounded-lg p-4 border border-ice-mint/30">
          <div className="font-vt323 text-ice-mint text-sm mb-2">⏱️ 时间</div>
          <div className="font-vt323 text-3xl text-white">
            {formatTime(displayTime)}
          </div>
          {doorUnlocked && (
            <div className="mt-2 font-vt323 text-ice-mint text-xs">
              🚪 门: 已解锁
            </div>
          )}
        </div>
      </div>

      {isHiding && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-dark-card/90 backdrop-blur-sm rounded-lg px-8 py-4 border-2 border-ice-mint animate-pulse">
            <div className="font-creepster text-3xl text-ice-mint text-center text-shadow-neon-green">
              😶‍🌫️ 躲藏中...
            </div>
            <div className="font-vt323 text-white/70 text-center mt-1">
              按空格键出来
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="bg-dark-card/60 backdrop-blur-sm rounded-full px-6 py-2 border border-white/10">
          <div className="flex items-center gap-6 font-vt323 text-sm text-white/60">
            <span>WASD/方向键 移动</span>
            <span>|</span>
            <span>空格 躲藏</span>
            <span>|</span>
            <span>E 拾取/开门</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUD;
