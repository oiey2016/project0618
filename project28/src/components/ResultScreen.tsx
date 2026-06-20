import { useEffect, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { TEAM_COLORS } from '../game/constants';
import { teamActiveCount } from '../game/renderer';
import { Trophy, RotateCcw, Home, Star, Skull, Heart, Zap, Crown } from 'lucide-react';

export function ResultScreen() {
  const winner = useGameStore((s) => s.winner);
  const players = useGameStore((s) => s.players);
  const scores = useGameStore((s) => s.scores);
  const teamKills = useGameStore((s) => s.teamKills);
  const phase = useGameStore((s) => s.phase);
  const resetGame = useGameStore((s) => s.actions.resetGame);
  const goToMenu = useGameStore((s) => s.actions.goToMenu);

  const blueAlive = teamActiveCount(players, 'blue');
  const redAlive = teamActiveCount(players, 'red');

  const confetti = useMemo(() => {
    if (phase !== 'result') return [];
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 2.5,
      color: [
        TEAM_COLORS.blue.main,
        TEAM_COLORS.red.main,
        '#FACC15',
        '#FF8C00',
        '#A855F7',
        '#22C55E',
        '#EC4899',
      ][i % 7],
      size: 6 + Math.random() * 8,
      rot: Math.random() * 360,
    }));
  }, [phase]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (phase !== 'result') return;
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        resetGame();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        goToMenu();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [phase, resetGame, goToMenu]);

  if (phase !== 'result' || !winner) return null;

  const isBlueWin = winner === 'blue';
  const winColor = isBlueWin ? TEAM_COLORS.blue : TEAM_COLORS.red;
  const loseColor = isBlueWin ? TEAM_COLORS.red : TEAM_COLORS.blue;
  const winAlive = isBlueWin ? blueAlive : redAlive;
  const loseAlive = isBlueWin ? redAlive : blueAlive;
  const winScore = isBlueWin ? scores.blue : scores.red;
  const loseScore = isBlueWin ? scores.red : scores.blue;
  const winKills = isBlueWin ? teamKills.blue : teamKills.red;
  const loseKills = isBlueWin ? teamKills.red : teamKills.blue;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dodge-bg-dark/90 via-dodge-bg-mid/95 to-dodge-bg-dark/90 backdrop-blur-xl" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti"
            style={{
              left: `${c.left}%`,
              top: '-20px',
              width: `${c.size}px`,
              height: `${c.size * 0.6}px`,
              background: c.color,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              transform: `rotate(${c.rot}deg)`,
              boxShadow: `0 0 6px ${c.color}`,
              borderRadius: '1px',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl w-full mx-6">
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-4 border-2 animate-bounce-slow"
            style={{
              background: `${winColor.main}22`,
              borderColor: `${winColor.main}66`,
              boxShadow: `0 0 30px ${winColor.shadow}`,
            }}
          >
            <Crown size={18} style={{ color: '#FACC15', fill: '#FACC15' }} />
            <span
              className="text-sm uppercase tracking-[0.4em] font-game"
              style={{ color: winColor.main }}
            >
              胜利! Victory!
            </span>
            <Crown size={18} style={{ color: '#FACC15', fill: '#FACC15' }} />
          </div>

          <div
            className="flex items-center justify-center gap-4 mb-4"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <div
              className="text-6xl md:text-7xl font-bold team-blue-glow"
              style={{
                color: isBlueWin ? TEAM_COLORS.blue.main : '#475569',
                opacity: isBlueWin ? 1 : 0.3,
                filter: isBlueWin ? 'none' : 'grayscale(0.8)',
              }}
            >
              蓝
            </div>
            <div
              className="text-3xl md:text-4xl animate-pulse"
              style={{ color: '#FACC15', textShadow: '0 0 20px rgba(250,204,21,0.6)' }}
            >
              🏆
            </div>
            <div
              className="text-6xl md:text-7xl font-bold team-red-glow"
              style={{
                color: !isBlueWin ? TEAM_COLORS.red.main : '#475569',
                opacity: !isBlueWin ? 1 : 0.3,
                filter: !isBlueWin ? 'none' : 'grayscale(0.8)',
              }}
            >
              红
            </div>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold title-neon tracking-wider"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: winColor.main,
            }}
          >
            {winColor.name} 获胜!
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className={`game-card p-5 relative overflow-hidden ${
              isBlueWin ? 'border-dodge-blue/60 shadow-neon-blue' : 'border-white/10 opacity-70'
            }`}
          >
            {isBlueWin && (
              <div className="absolute -top-4 -right-4 text-6xl animate-float opacity-20">🏆</div>
            )}
            <div className="flex items-center gap-2 mb-4 relative">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: TEAM_COLORS.blue.main, boxShadow: `0 0 10px ${TEAM_COLORS.blue.shadow}` }}
              />
              <span className="font-bold text-lg text-dodge-blue">蓝队</span>
              {isBlueWin && (
                <span className="ml-auto flex items-center gap-1 text-xs text-dodge-yellow bg-dodge-yellow/10 px-2 py-0.5 rounded-full border border-dodge-yellow/40">
                  <Star size={10} fill="#FACC15" /> 胜利者
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat icon={<Heart size={14} />} label="存活" value={`${blueAlive}/4`} color="text-dodge-blue" />
              <Stat icon={<Zap size={14} />} label="救援分" value={String(scores.blue)} color="text-dodge-yellow" />
              <Stat icon={<Skull size={14} />} label="击杀" value={String(teamKills.blue)} color="text-dodge-red" />
            </div>
            {isBlueWin && (
              <div className="mt-4 flex justify-center gap-1">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    size={20}
                    fill="#FACC15"
                    style={{
                      color: '#FACC15',
                      filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.6))',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            className={`game-card p-5 relative overflow-hidden ${
              !isBlueWin ? 'border-dodge-red/60 shadow-neon-red' : 'border-white/10 opacity-70'
            }`}
          >
            {!isBlueWin && (
              <div className="absolute -top-4 -right-4 text-6xl animate-float opacity-20">🏆</div>
            )}
            <div className="flex items-center gap-2 mb-4 relative">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: TEAM_COLORS.red.main, boxShadow: `0 0 10px ${TEAM_COLORS.red.shadow}` }}
              />
              <span className="font-bold text-lg text-dodge-red">红队</span>
              {!isBlueWin && (
                <span className="ml-auto flex items-center gap-1 text-xs text-dodge-yellow bg-dodge-yellow/10 px-2 py-0.5 rounded-full border border-dodge-yellow/40">
                  <Star size={10} fill="#FACC15" /> 胜利者
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat icon={<Heart size={14} />} label="存活" value={`${redAlive}/4`} color="text-dodge-red" />
              <Stat icon={<Zap size={14} />} label="救援分" value={String(scores.red)} color="text-dodge-yellow" />
              <Stat icon={<Skull size={14} />} label="击杀" value={String(teamKills.red)} color="text-dodge-orange" />
            </div>
            {!isBlueWin && (
              <div className="mt-4 flex justify-center gap-1">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    size={20}
                    fill="#FACC15"
                    style={{
                      color: '#FACC15',
                      filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.6))',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="game-card border-dodge-purple/30 p-4 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">净存活</div>
              <div className={`font-bold text-xl ${winAlive > loseAlive ? 'text-dodge-yellow' : 'text-white/80'}`}>
                {winAlive} vs {loseAlive}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">救援分差</div>
              <div className={`font-bold text-xl ${winScore > loseScore ? 'text-dodge-yellow' : 'text-white/80'}`}>
                {winScore} vs {loseScore}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">总击杀</div>
              <div className={`font-bold text-xl ${winKills > loseKills ? 'text-dodge-yellow' : 'text-white/80'}`}>
                {winKills} vs {loseKills}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={resetGame} className="game-btn-primary flex items-center gap-2 px-8 py-4 animate-pulse-glow">
            <RotateCcw size={20} />
            <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.9rem' }}>再来一局</span>
          </button>
          <button onClick={goToMenu} className="game-btn flex items-center gap-2 px-6 py-4 bg-white/5 border-white/20 text-white/80 hover:bg-white/10">
            <Home size={18} />
            <span className="font-game tracking-wide">返回首页</span>
          </button>
        </div>

        <div className="mt-5 text-center">
          <div className="inline-flex items-center gap-4 text-xs text-white/30 font-game">
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10">Enter</kbd>
              重新开始
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10">Esc</kbd>
              返回首页
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/5 py-2 px-1">
      <div className={`flex items-center justify-center gap-1 text-[10px] text-white/50 mb-1`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className={`font-bold text-lg ${color}`}>{value}</div>
    </div>
  );
}
