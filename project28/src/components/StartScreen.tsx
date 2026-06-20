import { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { TEAM_COLORS, COURT, PLAYER } from '../game/constants';
import { Play, Swords, Gamepad2, Target, Trophy, Shield, Sparkles, HelpCircle, X, Zap, Heart, RotateCcw, Star } from 'lucide-react';
import { SFX } from '../game/audio';

export function StartScreen() {
  const startGame = useGameStore((s) => s.actions.startGame);
  const [bounce, setBounce] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setBounce((b) => (b + 1) % 360), 50);
    return () => clearInterval(id);
  }, []);

  const toggleHelp = () => {
    SFX.menuClick();
    setShowHelp((v) => !v);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-gradient-to-br from-dodge-bg-dark/95 via-dodge-bg-mid/95 to-dodge-bg-dark/95 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: `${150 + Math.sin(i) * 80}px`,
              height: `${150 + Math.cos(i) * 80}px`,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 61) % 100}%`,
              background: i % 2 ? TEAM_COLORS.blue.main : TEAM_COLORS.red.main,
              transform: `translateY(${Math.sin((bounce + i * 30) * 0.05) * 30}px)`,
              transition: 'transform 200ms',
            }}
          />
        ))}
      </div>

      <button
        onClick={toggleHelp}
        className="absolute top-6 right-6 z-50 group"
        title="游戏玩法"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-dodge-purple/50 blur-lg opacity-0 group-hover:opacity-60 transition-opacity" />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-dodge-purple to-dodge-purple-dark border-2 border-dodge-purple/60 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-dodge-purple shadow-neon-purple">
            <HelpCircle size={26} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-dodge-yellow flex items-center justify-center text-[9px] font-bold text-dodge-bg-dark animate-bounce-slow shadow-lg">
            ?
          </div>
        </div>
      </button>

      <div className="relative max-w-6xl w-full z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 px-5 py-1.5 rounded-full border-2 border-dodge-purple/40 bg-dodge-purple/10 backdrop-blur-md">
            <Sparkles size={14} className="text-dodge-purple" />
            <span className="text-xs uppercase tracking-[0.3em] text-dodge-purple/90 font-game">
              派对对战游戏
            </span>
            <Sparkles size={14} className="text-dodge-purple" />
          </div>

          <h1
            className="title-neon mb-3"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.2,
            }}
          >
            <span className="team-blue-glow" style={{ color: TEAM_COLORS.blue.main }}>超级</span>
            <span className="mx-2 text-white">躲避球</span>
            <span className="team-red-glow" style={{ color: TEAM_COLORS.red.main }}>大作战</span>
          </h1>

          <div className="flex items-center justify-center gap-2">
            <span className="text-lg animate-bounce-slow inline-block" style={{ animationDelay: '0ms' }}>🏐</span>
            <span className="text-sm text-white/60 font-game tracking-wide">SUPER DODGEBALL BATTLE</span>
            <span className="text-lg animate-bounce-slow inline-block" style={{ animationDelay: '200ms' }}>🏐</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 items-stretch">
          <TeamInstructionCard
            team="blue"
            title="玩家1 · 蓝队"
            color={TEAM_COLORS.blue}
            keys={{
              up: 'W',
              down: 'S',
              left: 'A',
              right: 'D',
              action: '空格',
            }}
            bounce={bounce}
          />

          <div className="flex flex-col items-center justify-center order-first md:order-none py-2">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-50"
                style={{ background: `conic-gradient(from ${bounce}deg, ${TEAM_COLORS.blue.main}, ${TEAM_COLORS.red.main}, #A855F7, ${TEAM_COLORS.blue.main})` }}
              />
              <div className="relative game-card border-dodge-purple/50 p-6 backdrop-blur-xl bg-black/30 flex flex-col items-center gap-4 min-w-[180px]">
                <div className="relative">
                  <div className="text-5xl">⚔️</div>
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-dodge-bg-dark"
                    style={{ background: '#FACC15', transform: `rotate(${bounce}deg)` }}
                  >
                    VS
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">对战模式</div>
                  <div className="font-bold text-white text-lg">本地双人</div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full text-center">
                  <div className="rounded-lg bg-dodge-blue/10 border border-dodge-blue/30 py-2">
                    <div className="text-[10px] text-white/60">时长</div>
                    <div className="text-sm font-bold text-dodge-blue">3分钟</div>
                  </div>
                  <div className="rounded-lg bg-dodge-red/10 border border-dodge-red/30 py-2">
                    <div className="text-[10px] text-white/60">人数</div>
                    <div className="text-sm font-bold text-dodge-red">4v4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TeamInstructionCard
            team="red"
            title="玩家2 · 红队"
            color={TEAM_COLORS.red}
            keys={{
              up: '↑',
              down: '↓',
              left: '←',
              right: '→',
              action: '回车',
            }}
            bounce={bounce}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <RuleCard icon={<Target size={18} />} title="击中对方" desc="被球击中→下场休息" color="text-dodge-orange" />
          <RuleCard icon={<Shield size={18} />} title="接住来球" desc="按动作键→救回1队友" color="text-dodge-yellow" />
          <RuleCard icon={<Trophy size={18} />} title="淘汰全员" desc="对方无人在场→获胜" color="text-dodge-purple" />
          <RuleCard icon={<Swords size={18} />} title="时间决胜" desc="到时存活多者胜" color="text-emerald-400" />
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={startGame}
            className="group relative overflow-hidden animate-pulse-glow"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-dodge-blue via-dodge-purple to-dodge-red blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
            <div className="relative game-btn bg-gradient-to-r from-dodge-purple via-dodge-purple-dark to-dodge-purple border-2 border-white/20 text-white flex items-center gap-3 px-10 py-5 rounded-2xl shadow-neon-purple">
              <Play size={22} fill="white" className="transition-transform group-hover:scale-110" />
              <span
                className="tracking-wider"
                style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '1.1rem' }}
              >
                开始对战
              </span>
              <span className="text-2xl animate-bounce-slow inline-block" style={{ animationDelay: '100ms' }}>🎮</span>
            </div>
          </button>

          <div className="mt-4 flex items-center gap-2 text-xs text-white/40 font-game">
            <Gamepad2 size={12} />
            <span>提示：按住动作键可蓄力，松开投出更快的球！</span>
          </div>
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

function TeamInstructionCard({
  team,
  title,
  color,
  keys,
  bounce,
}: {
  team: 'blue' | 'red';
  title: string;
  color: { main: string; dark: string; shadow: string; name: string };
  keys: { up: string; down: string; left: string; right: string; action: string };
  bounce: number;
}) {
  const isBlue = team === 'blue';
  return (
    <div
      className={`game-card relative overflow-hidden p-5 ${
        isBlue ? 'border-dodge-blue/40' : 'border-dodge-red/40'
      }`}
      style={{ boxShadow: `0 0 30px ${color.shadow}` }}
    >
      <div
        className={`absolute inset-0 opacity-10 ${
          isBlue ? 'bg-gradient-to-br from-dodge-blue to-transparent' : 'bg-gradient-to-bl from-dodge-red to-transparent'
        }`}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${color.main}, ${color.dark})`,
              boxShadow: `0 0 20px ${color.shadow}`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-transparent flex items-center justify-center"
              style={{ transform: `translateY(${Math.sin(bounce * 0.05) * 2}px)` }}
            >
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest opacity-60">PLAYER {isBlue ? 'ONE' : 'TWO'}</div>
            <div className={`text-lg font-bold ${isBlue ? 'team-blue-glow' : 'team-red-glow'}`} style={{ color: color.main }}>
              {title}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-50 mb-2 flex items-center gap-1">
              <Gamepad2 size={10} />
              移动控制
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="key-cap">{keys.up}</div>
              <div className="flex gap-1">
                <div className="key-cap">{keys.left}</div>
                <div className="key-cap">{keys.down}</div>
                <div className="key-cap">{keys.right}</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <div className="text-[10px] uppercase tracking-wider opacity-50 mb-2">投球 / 接球</div>
            <div
              className="key-cap justify-center w-full text-sm"
              style={{
                borderColor: color.main,
                boxShadow: `0 0 12px ${color.shadow}, inset 0 0 10px ${color.shadow}`,
                background: `linear-gradient(to bottom, ${color.main}22, ${color.dark}44)`,
              }}
            >
              <span className="font-bold" style={{ color: color.main }}>
                {keys.action}
              </span>
              <span className="ml-2 text-white/70 text-xs">动作键</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-0.5 opacity-80">
          {Array.from({ length: PLAYER.PER_TEAM }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full"
              style={{
                background: color.main,
                opacity: 0.4 + (i / PLAYER.PER_TEAM) * 0.6,
                transform: `translateY(${Math.sin((bounce + i * 20) * 0.08) * 1.5}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RuleCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="game-card p-4 border-white/10 hover:border-white/20 transition-colors group cursor-default">
      <div className={`${color} mb-2 transition-transform group-hover:scale-110`}>{icon}</div>
      <div className="text-sm font-bold text-white mb-0.5">{title}</div>
      <div className="text-[11px] text-white/50 leading-relaxed">{desc}</div>
    </div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full game-card border-dodge-purple/40 bg-dodge-bg-mid/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl overflow-hidden shadow-neon-purple"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 0 60px rgba(168, 85, 247, 0.25)' }}
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-dodge-purple/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-dodge-blue/20 blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-colors group"
        >
          <X size={18} className="text-white/60 group-hover:text-white transition-colors" />
        </button>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dodge-purple to-dodge-purple-dark flex items-center justify-center shadow-neon-purple">
              <Gamepad2 size={24} className="text-white" />
            </div>
            <div>
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                游戏玩法
              </h2>
              <p className="text-xs text-white/50 mt-1 font-game tracking-wide">
                HOW TO PLAY
              </p>
            </div>
          </div>

          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
            <div className="game-card p-5 border-dodge-blue/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-dodge-blue/20 flex items-center justify-center">
                  <Target size={16} className="text-dodge-blue" />
                </div>
                <h3 className="text-lg font-bold text-dodge-blue">游戏目标</h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                用躲避球击中对方队伍的所有玩家，让他们全部下场休息，即可获得胜利！
                如果3分钟时间到，则场上存活人数更多的队伍获胜。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="game-card p-4 border-dodge-orange/30 bg-dodge-orange/5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-dodge-orange" />
                  <h4 className="font-bold text-dodge-orange">投球攻击</h4>
                </div>
                <ul className="text-xs text-white/60 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-dodge-orange">•</span>
                    <span>走到球旁边自动捡起</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-dodge-orange">•</span>
                    <span>按住动作键蓄力，松开发射</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-dodge-orange">•</span>
                    <span>蓄力越久，球速越快</span>
                  </li>
                </ul>
              </div>

              <div className="game-card p-4 border-dodge-yellow/30 bg-dodge-yellow/5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-dodge-yellow" />
                  <h4 className="font-bold text-dodge-yellow">接球救援</h4>
                </div>
                <ul className="text-xs text-white/60 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-dodge-yellow">•</span>
                    <span>对方投球时按动作键可接球</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-dodge-yellow">•</span>
                    <span>成功接球可救回1名队友</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-dodge-yellow">•</span>
                    <span>接住的球归你所有</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="game-card p-4 border-dodge-red/30 bg-dodge-red/5">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-dodge-red" />
                <h4 className="font-bold text-dodge-red">被击中了怎么办？</h4>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                被对方的球击中后，你会暂时下场，坐到替补席上。别灰心！
                只要队友接住一个对方投来的球，你就有机会被救回场上继续战斗！
              </p>
            </div>

            <div className="game-card p-4 border-dodge-purple/30 bg-dodge-purple/5">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-dodge-purple" />
                <h4 className="font-bold text-dodge-purple">小技巧</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-dodge-yellow">💡</span>
                  <span>左右移动躲避来球</span>
                </div>
                <div className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-dodge-yellow">💡</span>
                  <span>蓄力满时威力最大</span>
                </div>
                <div className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-dodge-yellow">💡</span>
                  <span>接球时机很重要</span>
                </div>
                <div className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-dodge-yellow">💡</span>
                  <span>救队友也是得分</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="game-card p-4 border-dodge-blue/30">
                <h4 className="font-bold text-dodge-blue text-sm mb-2">🔵 蓝队操作</h4>
                <div className="text-[11px] text-white/60 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="key-cap text-xs h-7 min-w-[1.8rem]">W</span>
                    <span>向上移动</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="key-cap text-xs h-7 min-w-[1.8rem]">A/S/D</span>
                    <span>左/下/右</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="key-cap text-xs h-7">空格</span>
                    <span>投球/接球</span>
                  </div>
                </div>
              </div>
              <div className="game-card p-4 border-dodge-red/30">
                <h4 className="font-bold text-dodge-red text-sm mb-2">🔴 红队操作</h4>
                <div className="text-[11px] text-white/60 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="key-cap text-xs h-7 min-w-[1.8rem]">↑</span>
                    <span>向上移动</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="key-cap text-xs h-7 min-w-[1.8rem]">←/↓/→</span>
                    <span>左/下/右</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="key-cap text-xs h-7">回车</span>
                    <span>投球/接球</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="game-btn-primary flex items-center gap-2 px-8 py-3"
            >
              <RotateCcw size={16} />
              <span className="font-game">知道了，开玩！</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
