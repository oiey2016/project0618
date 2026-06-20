import { useState } from 'react';
import { HelpCircle, X, Swords, Package, Target, Heart } from 'lucide-react';
import { PLAYER_CONFIGS } from '../game/constants';

interface MenuScreenProps {
  onStart: (playerCount: number) => void;
}

export function MenuScreen({ onStart }: MenuScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyControl = (config: typeof PLAYER_CONFIGS[0]) => {
    const keyLabels: Record<string, string> = {
      KeyA: 'A',
      KeyD: 'D',
      KeyW: 'W',
      KeyF: 'F',
      KeyG: 'G',
      ArrowLeft: '←',
      ArrowRight: '→',
      ArrowUp: '↑',
      Period: '.',
      Slash: '/',
      KeyJ: 'J',
      KeyL: 'L',
      KeyI: 'I',
      KeyK: 'K',
      KeyO: 'O',
      Numpad4: '4',
      Numpad6: '6',
      Numpad8: '8',
      Numpad5: '5',
      Numpad7: '7',
    };

    return {
      left: keyLabels[config.controls.left] || config.controls.left,
      right: keyLabels[config.controls.right] || config.controls.right,
      jump: keyLabels[config.controls.jump] || config.controls.jump,
      attack: keyLabels[config.controls.attack] || config.controls.attack,
      pickup: keyLabels[config.controls.pickup] || config.controls.pickup,
    };
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0F0A1F] via-[#1A1030] to-[#251540] z-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setShowHelp(true)}
        className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-gray-800/60 border-2 border-purple-500/50 flex items-center justify-center text-purple-300 hover:text-white hover:border-purple-400 hover:bg-gray-700/80 transition-all duration-300 hover:scale-110 group"
        title="游戏玩法"
      >
        <HelpCircle size={24} className="group-hover:animate-pulse" />
      </button>

      {showHelp && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="relative w-full max-w-lg mx-4 p-6 rounded-2xl bg-gradient-to-br from-[#1A1030] to-[#251540] border-2 border-purple-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)' }}
          >
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800/60 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
            </button>

            <h2
              className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              游戏玩法
            </h2>

            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-cyan-400 mb-1">游戏目标</h3>
                  <p className="text-sm text-gray-300">
                    成为最后存活的玩家！把对手的血量打到零就获胜。
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Swords size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-pink-400 mb-1">战斗方式</h3>
                  <p className="text-sm text-gray-300">
                    普通攻击造成 8 点伤害。靠近武器按拾取键捡起，
                    再按一次扔出去，武器伤害更高！
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-400 mb-1">武器类型</h3>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>· <span className="text-orange-300">棍子</span>：伤害 15，速度快</p>
                    <p>· <span className="text-orange-300">箱子</span>：伤害 25，均衡型</p>
                    <p>· <span className="text-orange-300">炸弹</span>：伤害 35，高伤害</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <Heart size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-green-400 mb-1">小技巧</h3>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>· 利用平台高低差躲避攻击</p>
                    <p>· 被击中会有短暂无敌时间</p>
                    <p>· 武器会定时刷新，多多利用</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #FF2E93 0%, #8B5CF6 50%, #00F5FF 100%)',
                boxShadow: '0 0 20px rgba(255, 46, 147, 0.3)',
                fontFamily: 'Orbitron, sans-serif',
              }}
            >
              知道了！
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        <h1
          className="text-6xl font-black mb-2 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400"
          style={{
            textShadow: '0 0 40px rgba(255, 46, 147, 0.5)',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          火柴人乱斗
        </h1>
        <p
          className="text-lg text-purple-300 mb-12 tracking-widest"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          STICK FIGHT PARTY
        </p>

        <div className="mb-10">
          <p
            className="text-center text-purple-200 mb-4 text-sm"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            选择对战人数
          </p>
          <div className="flex gap-4">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`w-20 h-20 rounded-full text-2xl font-bold transition-all duration-300 border-2 ${
                  playerCount === count
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white border-pink-400 scale-110 shadow-lg shadow-pink-500/50'
                    : 'bg-gray-800/50 text-gray-400 border-gray-600 hover:border-purple-400 hover:text-purple-300'
                }`}
                style={{
                  boxShadow: playerCount === count ? '0 0 30px rgba(236, 72, 153, 0.5)' : 'none',
                }}
              >
                {count}P
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 grid gap-4" style={{ gridTemplateColumns: `repeat(${playerCount}, 1fr)` }}>
          {PLAYER_CONFIGS.slice(0, playerCount).map((config) => {
            const keys = handleKeyControl(config);
            return (
              <div
                key={config.id}
                className="p-4 rounded-xl bg-gray-900/60 backdrop-blur-sm border-2"
                style={{
                  borderColor: config.colorHex + '60',
                  boxShadow: `0 0 20px ${config.colorHex}20`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: config.colorHex,
                      boxShadow: `0 0 10px ${config.colorHex}`,
                    }}
                  />
                  <span
                    className="font-bold text-sm"
                    style={{ color: config.colorHex, fontFamily: 'Orbitron, sans-serif' }}
                  >
                    玩家 {config.id}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">移动</span>
                    <span className="font-mono">
                      {keys.left} / {keys.right}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">跳跃</span>
                    <span className="font-mono">{keys.jump}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">攻击</span>
                    <span className="font-mono">{keys.attack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">捡/扔</span>
                    <span className="font-mono">{keys.pickup}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onStart(playerCount)}
          className="relative px-12 py-4 text-xl font-bold text-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group"
          style={{
            background: 'linear-gradient(135deg, #FF2E93 0%, #8B5CF6 50%, #00F5FF 100%)',
            boxShadow: '0 0 30px rgba(255, 46, 147, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          <span className="relative z-10">开始游戏</span>
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <p className="mt-8 text-xs text-gray-500 text-center max-w-md">
          规则简单：把对手打到血量归零就赢了！
          <br />
          场景里会随机出现武器，捡起来扔出去伤害更高
        </p>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
