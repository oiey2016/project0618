import { useState } from 'react';
import { Play, HelpCircle, Sparkles, Map, Fuel, Coins, Backpack, AlertTriangle, X } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import StarField from '@/components/common/StarField';
import GoldButton from '@/components/common/GoldButton';
import Modal from '@/components/common/Modal';
import { INTRO_NARRATIVE } from '@/data/narratives';

function DividerSvg() {
  return (
    <svg
      width="280"
      height="24"
      viewBox="0 0 280 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-80"
    >
      <path
        d="M0 12 H110"
        stroke="url(#goldGrad)"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M170 12 H280"
        stroke="url(#goldGrad)"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M110 12 C 120 4, 130 4, 140 12 S 160 20, 170 12"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="140" cy="12" r="4" fill="#d4af37" opacity="0.9" />
      <path
        d="M125 12 L130 9 M150 12 L155 9 M125 12 L130 15 M150 12 L155 15"
        stroke="#d4af37"
        strokeWidth="1"
        opacity="0.7"
      />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="12" x2="280" y2="12">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
          <stop offset="50%" stopColor="#d4af37" stopOpacity="1" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CornerDeco({ position }: { position: 'tl' | 'br' }) {
  const base = 'absolute w-20 h-20 pointer-events-none opacity-60';
  const style =
    position === 'tl'
      ? 'top-6 left-6 border-t-2 border-l-2 border-stardust-400/40'
      : 'bottom-6 right-6 border-b-2 border-r-2 border-stardust-400/40';

  return (
    <div className={`${base} ${style}`}>
      <div
        className={`absolute ${
          position === 'tl'
            ? 'top-0 left-0 w-4 h-4 border-t border-l border-stardust-400/80'
            : 'bottom-0 right-0 w-4 h-4 border-b border-r border-stardust-400/80'
        }`}
      />
      <div
        className={`absolute ${
          position === 'tl'
            ? 'top-5 left-5 w-10 h-10 border-t border-l border-stardust-400/30'
            : 'bottom-5 right-5 w-10 h-10 border-b border-r border-stardust-400/30'
        }`}
      />
    </div>
  );
}

export default function StartScreen() {
  const { startNewGame, loadGame, switchScreen, storyLog, currentDay, isGameOver } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);
  const canContinue = (storyLog.length > 1 || currentDay > 1) && !isGameOver;

  const handleContinue = () => {
    if (loadGame() || canContinue) {
      switchScreen('game');
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <StarField />

      <CornerDeco position="tl" />
      <CornerDeco position="br" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 py-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4 opacity-80">
              <Sparkles size={14} className="text-stardust-400 animate-pulse-slow" />
              <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-stardust-300">
                Interstellar Travel Chronicle
              </span>
              <Sparkles size={14} className="text-stardust-400 animate-pulse-slow" />
            </div>
          </div>

          <h1 className="font-display font-black text-6xl md:text-7xl text-gold-gradient animate-glow-gold leading-none mb-3 animate-scale-in">
            星际80天
          </h1>

          <p className="font-mono text-plasma-300 tracking-[0.4em] text-sm md:text-base opacity-90 mt-3 animate-fade-in" style={{ animationDelay: '150ms' }}>
            AROUND THE GALAXY IN 80 DAYS
          </p>

          <div className="my-10 animate-fade-in" style={{ animationDelay: '250ms' }}>
            <DividerSvg />
          </div>

          <div
            className="mt-0 flex flex-col items-center space-y-4 animate-slide-up"
            style={{ animationDelay: '350ms' }}
          >
            <GoldButton size="lg" variant="primary" onClick={startNewGame} icon={Play}>
              ✦ 开始新冒险 ✦
            </GoldButton>

            <GoldButton
              size="md"
              variant="secondary"
              onClick={handleContinue}
              disabled={!canContinue}
            >
              <span>继续旅程</span>
            </GoldButton>

            <GoldButton
              size="md"
              variant="ghost"
              onClick={() => setShowHelp(true)}
              icon={HelpCircle}
            >
              游戏说明
            </GoldButton>
          </div>

          <p
            className="font-serif text-space-100 italic mt-16 max-w-xl text-center opacity-70 text-lg animate-fade-in"
            style={{ animationDelay: '500ms' }}
          >
            {INTRO_NARRATIVE.slice(0, 60)}...
          </p>
        </div>
      </div>

      <Modal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        title="游戏玩法说明"
      >
        <div className="space-y-6 text-space-100">
          <div>
            <h3 className="font-display font-bold text-lg text-stardust-200 mb-2 flex items-center gap-2">
              <Map size={18} className="text-plasma-300" />
              目标
            </h3>
            <p className="font-serif leading-relaxed text-space-200">
              在 <span className="text-stardust-300 font-bold">80 天</span> 内从首都星球
              Londinium Prime 出发，环游已知星系后返回起点。成功返回即获胜！
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-stardust-200 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-stardust-300" />
              航线规划三要素
            </h3>
            <div className="space-y-3 ml-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-space-500/60 border border-space-300/30">
                  <span className="font-mono text-xs text-plasma-300">时</span>
                </div>
                <div>
                  <div className="font-semibold text-plasma-200 text-sm">时间</div>
                  <p className="font-serif text-sm text-space-200">
                    每条航线消耗不同天数，80 天内不返回 Londinium Prime 即失败。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-space-500/60 border border-space-300/30">
                  <Fuel size={12} className="text-plasma-300" />
                </div>
                <div>
                  <div className="font-semibold text-plasma-200 text-sm">燃料</div>
                  <p className="font-serif text-sm text-space-200">
                    燃料不足将无法启航。可以在旅途中通过物品或事件补充。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-space-500/60 border border-space-300/30">
                  <Coins size={12} className="text-stardust-300" />
                </div>
                <div>
                  <div className="font-semibold text-stardust-200 text-sm">星币</div>
                  <p className="font-serif text-sm text-space-200">
                    支付航线费用的货币，星币不足也无法出发。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-alert-400/10 border border-alert-400/30">
                  <AlertTriangle size={12} className="text-alert-400" />
                </div>
                <div>
                  <div className="font-semibold text-alert-300 text-sm">风险等级</div>
                  <p className="font-serif text-sm text-space-200">
                    低/中/高风险决定了途中触发随机事件的概率，高风险航线通常更快但更危险。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-stardust-200 mb-2 flex items-center gap-2">
              <Backpack size={18} className="text-stardust-300" />
              行李管理
            </h3>
            <p className="font-serif leading-relaxed text-space-200">
              行李舱共 <span className="text-stardust-300 font-bold">8 格</span>
              ，装有用消耗品（燃料补剂、星币袋、神经镇静剂等）和装备类物品。合理使用道具可以化险为夷！
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-stardust-200 mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-plasma-300" />
              随机事件
            </h3>
            <p className="font-serif leading-relaxed text-space-200">
              航行途中会遇到各种各样的随机事件——友善的商人、壮丽的星云、海盗袭击、超新星风暴……
              每个选择都会影响资源和士气，带来机遇与挑战。谨慎决策是成功的关键！
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowHelp(false)}
              className="w-full flex items-center justify-center gap-2 rounded-sm border border-stardust-400/40 bg-stardust-400/10 py-3 font-display font-semibold text-stardust-200 transition-all hover:bg-stardust-400/20 hover:shadow-gold"
            >
              <X size={16} />
              了解了，开始冒险！
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
