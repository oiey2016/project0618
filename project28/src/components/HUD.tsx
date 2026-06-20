import { useGameStore } from '../store/useGameStore';
import { formatTime, teamActiveCount, teamBenchCount } from '../game/renderer';
import { TEAM_COLORS, PLAYER } from '../game/constants';
import { Heart, Users, Clock, Target, Zap } from 'lucide-react';

export function HUD() {
  const timeLeft = useGameStore((s) => s.timeLeft);
  const players = useGameStore((s) => s.players);
  const scores = useGameStore((s) => s.scores);
  const teamKills = useGameStore((s) => s.teamKills);
  const hintText = useGameStore((s) => s.hintText);
  const hintTimer = useGameStore((s) => s.hintTimer);
  const phase = useGameStore((s) => s.phase);

  const blueAlive = teamActiveCount(players, 'blue');
  const redAlive = teamActiveCount(players, 'red');
  const blueBench = teamBenchCount(players, 'blue');
  const redBench = teamBenchCount(players, 'red');

  const timeSec = Math.ceil(timeLeft / 1000);
  const urgent = timeSec <= 30;
  const showHint = phase === 'playing' && hintTimer > 0 && hintText;

  if (phase === 'menu') return null;

  return (
    <>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 pointer-events-none select-none">
        <div className="game-card px-5 py-2 flex items-center gap-2 border-dodge-blue/60 shadow-neon-blue">
          <div
            className="w-4 h-4 rounded-full"
            style={{ background: TEAM_COLORS.blue.main, boxShadow: `0 0 10px ${TEAM_COLORS.blue.shadow}` }}
          />
          <div className="flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-wider text-dodge-blue/80">蓝队</div>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: PLAYER.PER_TEAM }).map((_, i) => (
                <Heart
                  key={i}
                  size={16}
                  fill={i < blueAlive ? TEAM_COLORS.blue.main : 'transparent'}
                  className={i < blueAlive ? 'drop-shadow-[0_0_4px_rgba(0,212,255,0.6)]' : 'opacity-30'}
                  style={{ color: i < blueAlive ? TEAM_COLORS.blue.main : '#475569' }}
                />
              ))}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10 mx-1" />
          <div className="flex flex-col items-center min-w-[50px]">
            <div className="flex items-center gap-1 text-[10px] text-white/60">
              <Users size={10} />
              <span>替补 {blueBench}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-dodge-blue">
              <Zap size={12} />
              {scores.blue}
            </div>
          </div>
        </div>

        <div
          className={`game-card px-6 py-2 flex flex-col items-center ${
            urgent
              ? 'border-dodge-red/70 shadow-neon-red animate-pulse'
              : 'border-dodge-yellow/50 shadow-neon-yellow'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/70">
            <Clock size={10} />
            <span>剩余时间</span>
          </div>
          <div
            className={`font-display text-2xl mt-0.5 ${
              urgent ? 'text-dodge-red team-red-glow' : 'text-dodge-yellow'
            }`}
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="game-card px-5 py-2 flex items-center gap-2 border-dodge-red/60 shadow-neon-red">
          <div className="flex flex-col items-center min-w-[50px]">
            <div className="flex items-center gap-1 text-[10px] text-white/60">
              <Users size={10} />
              <span>替补 {redBench}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-dodge-red">
              <Zap size={12} />
              {scores.red}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10 mx-1" />
          <div className="flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-wider text-dodge-red/80">红队</div>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: PLAYER.PER_TEAM }).map((_, i) => (
                <Heart
                  key={i}
                  size={16}
                  fill={i < redAlive ? TEAM_COLORS.red.main : 'transparent'}
                  className={i < redAlive ? 'drop-shadow-[0_0_4px_rgba(255,61,104,0.6)]' : 'opacity-30'}
                  style={{ color: i < redAlive ? TEAM_COLORS.red.main : '#475569' }}
                />
              ))}
            </div>
          </div>
          <div
            className="w-4 h-4 rounded-full"
            style={{ background: TEAM_COLORS.red.main, boxShadow: `0 0 10px ${TEAM_COLORS.red.shadow}` }}
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 pointer-events-none select-none">
        <div className="flex items-center gap-2 text-[11px] text-white/50 font-game">
          <Target size={12} />
          <span className="text-dodge-blue/80">WASD移动</span>
          <span className="text-white/30">|</span>
          <span className="text-white/70">空格投/接</span>
        </div>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-2 text-[11px] text-white/50 font-game">
          <span className="text-dodge-red/80">方向键移动</span>
          <span className="text-white/30">|</span>
          <span className="text-white/70">回车投/接</span>
        </div>
      </div>

      {showHint && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none"
          style={{
            opacity: Math.min(1, hintTimer / 500),
            transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, hintTimer / 500)) * -20}px)`,
            transition: 'opacity 120ms, transform 120ms',
          }}
        >
          <div className="game-card px-8 py-3 border-dodge-purple/60 shadow-neon-purple bg-black/40 backdrop-blur-md">
            <div
              className="font-display text-xl text-white title-neon"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              {hintText}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-20 left-4 z-20 game-card px-3 py-1.5 text-[10px] pointer-events-none opacity-70">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-dodge-blue" />
          <span className="text-white/60">击杀</span>
          <span className="font-bold text-dodge-blue">{teamKills.blue}</span>
        </div>
      </div>
      <div className="absolute top-20 right-4 z-20 game-card px-3 py-1.5 text-[10px] pointer-events-none opacity-70">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-dodge-red">{teamKills.red}</span>
          <span className="text-white/60">击杀</span>
          <span className="w-2 h-2 rounded-full bg-dodge-red" />
        </div>
      </div>
    </>
  );
}
