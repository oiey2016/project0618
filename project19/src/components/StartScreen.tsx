import React, { useEffect, useState } from 'react';
import { useGameStore } from '../game/store';
import { audioManager } from '../game/utils/audio';

const StartScreen: React.FC = () => {
  const setPhase = useGameStore((state) => state.setPhase);
  const resetGame = useGameStore((state) => state.resetGame);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    const initAudio = () => {
      audioManager.init();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, []);

  const handleStart = () => {
    resetGame();
    audioManager.init();
    setPhase('playing');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark-bg overflow-hidden relative">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-ice-pink/20 via-transparent to-neon-purple/20 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ice-pink/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="crt-effect vignette absolute inset-0 pointer-events-none z-50" />

      <div className="absolute top-6 right-6 z-30 flex gap-3">
        <button
          onClick={() => setShowRulesModal(true)}
          className="w-12 h-12 rounded-full bg-dark-card/80 border-2 border-ice-mint/50 flex items-center justify-center text-ice-mint text-xl hover:border-ice-mint hover:bg-dark-card hover:scale-110 transition-all duration-300 group box-shadow-neon-green"
          title="游戏规则"
        >
          <span className="group-hover:animate-pulse">📜</span>
        </button>
        <button
          onClick={() => setShowHelpModal(true)}
          className="w-12 h-12 rounded-full bg-dark-card/80 border-2 border-ice-pink/50 flex items-center justify-center text-ice-pink text-2xl font-creepster hover:border-ice-pink hover:bg-dark-card hover:scale-110 transition-all duration-300 group box-shadow-neon-pink"
          title="操作说明"
        >
          <span className="group-hover:animate-pulse">?</span>
        </button>
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-creepster text-7xl md:text-8xl mb-2 bg-gradient-to-r from-ice-pink via-neon-purple to-ice-pink bg-clip-text text-transparent animate-flicker">
            诡异冰淇淋
          </h1>
          <p className="font-creepster text-4xl md:text-5xl text-ice-mint text-shadow-neon-green">
            躲猫猫
          </p>
        </div>

        <div className="mb-8 relative">
          <div className="text-8xl mb-4 animate-float">🍦</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-ice-pink/30 rounded-full blur-xl animate-pulse" />
          </div>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleStart}
            className="group relative px-12 py-4 bg-gradient-to-r from-ice-pink to-neon-purple rounded-lg font-creepster text-3xl text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 text-shadow-neon-pink">
              开始游戏
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <div className="absolute inset-0 animate-glow opacity-50" />
          </button>

          <p className="font-vt323 text-sm text-white/50 mt-4">
            提示：点击屏幕或按任意键启用音效
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-vt323 text-white/30 text-sm">
        🍦 小心那个冰淇淋...它不太对劲 🍦
      </div>

      {showRulesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowRulesModal(false)}
        >
          <div
            className="relative bg-dark-card rounded-xl p-8 max-w-md w-full mx-4 border-2 border-ice-mint box-shadow-neon-green animate-float"
            onClick={(e) => e.stopPropagation()}
            style={{ animationDuration: '0.3s' }}
          >
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-bg border border-ice-mint/50 flex items-center justify-center text-ice-mint text-xl hover:border-ice-mint hover:text-white transition-colors"
            >
              ×
            </button>

            <h2 className="font-creepster text-4xl text-ice-mint text-shadow-neon-green mb-6 text-center">
              📜 游戏规则
            </h2>

            <div className="space-y-4 font-vt323">
              <div className="bg-dark-bg/50 rounded-lg p-4">
                <p className="text-white text-lg text-center">
                  在诡异的冰淇淋车里躲避疯狂司机，
                </p>
                <p className="text-creep-yellow text-xl text-center mt-2 font-bold">
                  收集 3 把钥匙
                </p>
                <p className="text-white text-lg text-center mt-2">
                  然后
                  <span className="text-ice-mint text-xl font-bold"> 开门逃跑 </span>
                  ！
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-dark-bg/50 rounded-lg p-3">
                  <span className="text-2xl">🔑</span>
                  <div>
                    <p className="text-ice-pink text-lg">收集钥匙</p>
                    <p className="text-white/70 text-sm">车内散落着3把金钥匙，找到它们才能开门</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-dark-bg/50 rounded-lg p-3">
                  <span className="text-2xl">👁️</span>
                  <div>
                    <p className="text-ice-pink text-lg">躲避司机</p>
                    <p className="text-white/70 text-sm">司机会在车内巡逻，注意避开他的红色视野扇形区域</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-dark-bg/50 rounded-lg p-3">
                  <span className="text-2xl">❄️</span>
                  <div>
                    <p className="text-ice-pink text-lg">躲藏自保</p>
                    <p className="text-white/70 text-sm">被发现时，赶紧躲进冰箱、箱子或桌子底下！</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-dark-bg/50 rounded-lg p-3">
                  <span className="text-2xl">🚪</span>
                  <div>
                    <p className="text-ice-pink text-lg">开门逃离</p>
                    <p className="text-white/70 text-sm">集齐3把钥匙后，车门会解锁，快去开门！</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-ice-mint/30">
              <p className="text-warning-red text-center font-vt323">
                ⚠ 被司机抓住就会被做成冰淇淋！
              </p>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="relative bg-dark-card rounded-xl p-8 max-w-md w-full mx-4 border-2 border-ice-pink box-shadow-neon-pink animate-float"
            onClick={(e) => e.stopPropagation()}
            style={{ animationDuration: '0.3s' }}
          >
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-bg border border-ice-pink/50 flex items-center justify-center text-ice-pink text-xl hover:border-ice-pink hover:text-white transition-colors"
            >
              ×
            </button>

            <h2 className="font-creepster text-4xl text-ice-pink text-shadow-neon-pink mb-6 text-center">
              🎮 操作说明
            </h2>

            <div className="space-y-4 font-vt323">
              <div className="flex items-center gap-4 bg-dark-bg/50 rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-10 h-10 bg-ice-pink/20 rounded text-ice-pink font-bold flex items-center justify-center">W</span>
                </div>
                <div>
                  <p className="text-white text-lg">向上移动</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-dark-bg/50 rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-10 h-10 bg-ice-pink/20 rounded text-ice-pink font-bold flex items-center justify-center">A</span>
                  <span className="w-10 h-10 bg-ice-pink/20 rounded text-ice-pink font-bold flex items-center justify-center">S</span>
                  <span className="w-10 h-10 bg-ice-pink/20 rounded text-ice-pink font-bold flex items-center justify-center">D</span>
                </div>
                <div>
                  <p className="text-white text-lg">左 / 下 / 右移动</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-dark-bg/50 rounded-lg p-3">
                <span className="px-4 h-10 bg-ice-mint/20 rounded text-ice-mint font-bold flex items-center justify-center text-sm">方向键 ↑↓←→</span>
                <div>
                  <p className="text-white text-lg">也可以移动</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-dark-bg/50 rounded-lg p-3">
                <span className="px-4 h-10 bg-ice-mint/20 rounded text-ice-mint font-bold flex items-center justify-center">空格</span>
                <div>
                  <p className="text-white text-lg">躲藏 / 出来</p>
                  <p className="text-white/60 text-sm">靠近冰箱、箱子等躲藏点时使用</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-dark-bg/50 rounded-lg p-3">
                <span className="w-10 h-10 bg-ice-mint/20 rounded text-ice-mint font-bold flex items-center justify-center">E</span>
                <div>
                  <p className="text-white text-lg">拾取钥匙 / 开门</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-ice-pink/30">
              <p className="text-warning-red text-center font-vt323">
                ⚠ 被司机发现会被追逐，快躲起来！
              </p>
              <p className="text-ice-mint text-center font-vt323 mt-2">
                💡 收集3把钥匙就能开门逃跑！
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartScreen;
