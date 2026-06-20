import { useGameStore } from '../store/useGameStore';
import { Gamepad2, Target, Shield, ChevronRight } from 'lucide-react';

export const StartScreen = () => {
  const phase = useGameStore((s) => s.phase);
  const { startGame } = useGameStore((s) => s.actions);

  if (phase !== 'menu') return null;

  return (
    <div className="absolute inset-0 z-30 animate-fade-in overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0 noise-overlay rounded-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-arena-bg/50 to-arena-bg/80 rounded-3xl pointer-events-none" />

      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-[640px] my-auto">
          <div className="text-center mb-6 sm:mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full
                            bg-white/5 border border-white/10 mb-4 sm:mb-6">
              <Gamepad2 size={12} className="text-accent-glow sm:hidden" />
              <Gamepad2 size={14} className="text-accent-glow hidden sm:inline" />
              <span className="font-display font-semibold text-[10px] sm:text-xs tracking-[0.2em] text-slate-300">
                双人本地对战
              </span>
            </div>

            <h1 className="font-display font-black text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] leading-none tracking-tight text-gradient mb-2 sm:mb-3"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.08)' }}>
              圆盘对战
            </h1>
            <p className="font-display font-semibold text-lg sm:text-xl md:text-2xl tracking-[0.15em] text-slate-400">
              DISC · BATTLE
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <RuleCard
              icon={<Target className="text-player1-glow" />}
              title="推下对手"
              desc="用撞击把对方推出圆盘"
            />
            <RuleCard
              icon={<Shield className="text-accent-glow" />}
              title="留在台上"
              desc="千万别掉下圆盘边缘"
            />
            <RuleCard
              icon={<ChevronRight className="text-player2-glow rotate-[-45deg]" />}
              title="先赢三局"
              desc="率先赢得 3 回合获胜"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <PlayerControls
              playerId={1}
              name="玩家 1"
              colorClass="player1"
              keys={[
                { label: 'W', pos: 'top' },
                { label: 'A', pos: 'left' },
                { label: 'S', pos: 'down' },
                { label: 'D', pos: 'right' },
              ]}
            />
            <PlayerControls
              playerId={2}
              name="玩家 2"
              colorClass="player2"
              keys={[
                { label: '↑', pos: 'top' },
                { label: '←', pos: 'left' },
                { label: '↓', pos: 'down' },
                { label: '→', pos: 'right' },
              ]}
            />
          </div>

          <div className="text-center animate-slide-up pb-2" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={startGame}
              className="btn-primary text-base sm:text-xl px-10 sm:px-14 py-3.5 sm:py-5"
            >
              开始游戏
              <ChevronRight size={18} className="ml-1 -mr-1 sm:hidden" />
              <ChevronRight size={22} className="ml-1 -mr-1 hidden sm:inline" />
            </button>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-500 font-body">
              按下按钮即进入对战 · 准备好了吗？
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RuleCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center transition-transform duration-300 hover:scale-[1.02]">
    <div className="w-8 h-8 sm:w-11 sm:h-11 mx-auto mb-1.5 sm:mb-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10
                    flex items-center justify-center">
      {icon}
    </div>
    <div className="font-display font-bold text-xs sm:text-sm text-white mb-0.5 sm:mb-1">{title}</div>
    <div className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">{desc}</div>
  </div>
);

interface KeyItem {
  label: string;
  pos: 'top' | 'left' | 'down' | 'right';
}

const PlayerControls = ({
  playerId,
  name,
  colorClass,
  keys,
}: {
  playerId: number;
  name: string;
  colorClass: 'player1' | 'player2';
  keys: KeyItem[];
}) => {
  const isP1 = colorClass === 'player1';
  const getKey = (pos: KeyItem['pos']) => keys.find((k) => k.pos === pos)?.label || '';

  return (
    <div className={`glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5
                    ${isP1 ? 'border-l-4 border-l-player1' : 'border-r-4 border-r-player2'}`}>
      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
        <div className={`font-display font-black text-base sm:text-xl ${isP1 ? 'text-gradient-p1' : 'text-gradient-p2'}`}>
          {name}
        </div>
        <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center
                        font-display font-bold text-white text-xs sm:text-sm
                        ${isP1 ? 'bg-gradient-to-br from-player1-glow to-player1-dark shadow-glow-blue' : 'bg-gradient-to-br from-player2-glow to-player2-dark shadow-glow-orange'}`}>
          {playerId}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 sm:gap-1.5">
        <div className="key-cap w-9 h-9 sm:w-12 sm:h-12 text-sm sm:text-base rounded-md sm:rounded-lg">{getKey('top')}</div>
        <div className="flex gap-1 sm:gap-1.5">
          <div className="key-cap w-9 h-9 sm:w-12 sm:h-12 text-sm sm:text-base rounded-md sm:rounded-lg">{getKey('left')}</div>
          <div className="key-cap w-9 h-9 sm:w-12 sm:h-12 text-sm sm:text-base rounded-md sm:rounded-lg bg-slate-700/40 border-dashed opacity-40">
            ·
          </div>
          <div className="key-cap w-9 h-9 sm:w-12 sm:h-12 text-sm sm:text-base rounded-md sm:rounded-lg">{getKey('right')}</div>
        </div>
        <div className="key-cap w-9 h-9 sm:w-12 sm:h-12 text-sm sm:text-base rounded-md sm:rounded-lg">{getKey('down')}</div>
      </div>

      <div className="mt-2.5 sm:mt-4 text-center text-[10px] sm:text-xs text-slate-500 font-body">
        移动控制
      </div>
    </div>
  );
};
