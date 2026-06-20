import React from 'react';
import { useGameStore } from '../game/store';

const EndScreen: React.FC = () => {
  const phase = useGameStore((state) => state.phase);
  const stats = useGameStore((state) => state.stats);
  const setPhase = useGameStore((state) => state.setPhase);
  const resetGame = useGameStore((state) => state.resetGame);

  const isWin = phase === 'won';

  const handleRestart = () => {
    resetGame();
    setPhase('playing');
  };

  const handleMainMenu = () => {
    resetGame();
    setPhase('start');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}分${secs}秒`;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/95 backdrop-blur-sm z-30">
      <div className="crt-effect vignette absolute inset-0 pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-lg">
        <div className="mb-8">
          {isWin ? (
            <>
              <div className="text-8xl mb-4 animate-float">🎉</div>
              <h1 className="font-creepster text-6xl md:text-7xl text-ice-mint text-shadow-neon-green mb-2">
                成功逃脱！
              </h1>
              <p className="font-vt323 text-xl text-white/80">
                你成功逃离了诡异的冰淇淋车！
              </p>
            </>
          ) : (
            <>
              <div className="text-8xl mb-4 animate-shake">💀</div>
              <h1 className="font-creepster text-6xl md:text-7xl text-warning-red text-shadow-neon-red mb-2">
                被抓住了...
              </h1>
              <p className="font-vt323 text-xl text-white/80">
                司机把你做成了冰淇淋甜筒...
              </p>
            </>
          )}
        </div>

        <div className={`bg-dark-card/80 backdrop-blur-sm rounded-lg p-6 mb-8 ${
          isWin ? 'border-2 border-ice-mint/50' : 'border-2 border-warning-red/50'
        }`}>
          <h2 className="font-vt323 text-2xl text-white mb-4">📊 游戏统计</h2>
          <div className="grid grid-cols-2 gap-4 text-left font-vt323">
            <div className="bg-dark-bg/50 rounded-lg p-3">
              <div className="text-white/60 text-sm">游戏时长</div>
              <div className="text-xl text-ice-pink">{formatTime(stats.playTime)}</div>
            </div>
            <div className="bg-dark-bg/50 rounded-lg p-3">
              <div className="text-white/60 text-sm">收集钥匙</div>
              <div className="text-xl text-creep-yellow">{stats.keysCollected} / 3</div>
            </div>
            <div className="bg-dark-bg/50 rounded-lg p-3">
              <div className="text-white/60 text-sm">躲藏次数</div>
              <div className="text-xl text-ice-mint">{stats.hideCount} 次</div>
            </div>
            <div className="bg-dark-bg/50 rounded-lg p-3">
              <div className="text-white/60 text-sm">惊险时刻</div>
              <div className="text-xl text-warning-red">{stats.nearMissCount} 次</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRestart}
            className={`px-8 py-3 rounded-lg font-creepster text-2xl text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
              isWin
                ? 'bg-gradient-to-r from-ice-mint to-neon-purple hover:shadow-lg hover:shadow-ice-mint/50'
                : 'bg-gradient-to-r from-warning-red to-ice-pink hover:shadow-lg hover:shadow-warning-red/50'
            }`}
          >
            🔄 再玩一次
          </button>
          <button
            onClick={handleMainMenu}
            className="px-8 py-3 rounded-lg font-creepster text-2xl text-white bg-dark-card border-2 border-white/30 hover:border-ice-pink hover:text-ice-pink transition-all duration-300 hover:scale-105 active:scale-95"
          >
            🏠 返回主菜单
          </button>
        </div>

        <div className="mt-8 font-vt323 text-white/40 text-sm">
          {isWin
            ? '🍦 恭喜你没有变成冰淇淋！'
            : '🍦 下次小心那个冰淇淋车司机...'}
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
