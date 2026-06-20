import { useGameStore } from '../store/useGameStore';
import { RotateCcw } from 'lucide-react';

export const Scoreboard = () => {
  const currentRound = useGameStore((s) => s.currentRound);
  const roundsToWin = useGameStore((s) => s.config.roundsToWin);
  const p1Score = useGameStore((s) => s.players.P1.score);
  const p2Score = useGameStore((s) => s.players.P2.score);
  const phase = useGameStore((s) => s.phase);
  const resetRound = useGameStore((s) => s.actions.resetRound);
  const backToMenu = useGameStore((s) => s.actions.backToMenu);

  if (phase === 'menu') return null;

  return (
    <div className="w-full max-w-[720px] mx-auto flex items-center justify-between gap-4 px-2">
      <PlayerScore
        id="P1"
        name="玩家 1"
        score={p1Score}
        roundsToWin={roundsToWin}
        colorClass="player1"
        align="left"
      />

      <div className="flex flex-col items-center gap-2">
        <div className="glass-card px-5 py-2 rounded-full">
          <span className="font-display font-bold text-sm tracking-widest text-slate-400">
            ROUND&nbsp;
            <span className="text-white">{currentRound}</span>
            <span className="mx-2 text-slate-600">·</span>
            先赢&nbsp;
            <span className="text-accent-glow">{roundsToWin}</span>
            &nbsp;局
          </span>
        </div>

        <div className="flex gap-2">
          {phase === 'playing' && (
            <button
              onClick={resetRound}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         text-xs font-display font-semibold tracking-wide
                         text-slate-400 hover:text-white
                         bg-slate-800/50 border border-slate-700/60
                         hover:bg-slate-700/60 hover:border-slate-600
                         transition-all duration-200"
              title="重置回合"
            >
              <RotateCcw size={13} />
              重置
            </button>
          )}
          <button
            onClick={backToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       text-xs font-display font-semibold tracking-wide
                       text-slate-400 hover:text-white
                       bg-slate-800/50 border border-slate-700/60
                       hover:bg-slate-700/60 hover:border-slate-600
                       transition-all duration-200"
          >
            主菜单
          </button>
        </div>
      </div>

      <PlayerScore
        id="P2"
        name="玩家 2"
        score={p2Score}
        roundsToWin={roundsToWin}
        colorClass="player2"
        align="right"
      />
    </div>
  );
};

interface PlayerScoreProps {
  id: 'P1' | 'P2';
  name: string;
  score: number;
  roundsToWin: number;
  colorClass: 'player1' | 'player2';
  align: 'left' | 'right';
}

const PlayerScore = ({ id, name, score, roundsToWin, colorClass, align }: PlayerScoreProps) => {
  const dots = Array.from({ length: roundsToWin }, (_, i) => i < score);
  const isP1 = colorClass === 'player1';

  return (
    <div className={`flex items-center gap-3 min-w-[180px] ${align === 'right' ? 'justify-end' : ''}`}>
      {align === 'left' && (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center
                      font-display font-bold text-white shadow-lg
                      ${isP1 ? 'bg-gradient-to-br from-player1-glow to-player1-dark shadow-glow-blue' : 'bg-gradient-to-br from-player2-glow to-player2-dark shadow-glow-orange'}`}
        >
          {id === 'P1' ? '1' : '2'}
        </div>
      )}

      <div className={align === 'right' ? 'text-right' : ''}>
        <div
          className={`font-display font-bold text-lg leading-tight
                      ${isP1 ? 'text-gradient-p1' : 'text-gradient-p2'}`}
        >
          {name}
        </div>
        <div className="flex gap-1.5 mt-1" style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
          {dots.map((filled, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300
                          ${filled
                            ? isP1
                              ? 'bg-player1 shadow-[0_0_8px_rgba(59,130,246,0.8)] scale-110'
                              : 'bg-player2 shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110'
                            : 'bg-slate-700 border border-slate-600'
                          }`}
            />
          ))}
        </div>
      </div>

      {align === 'right' && (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center
                      font-display font-bold text-white shadow-lg
                      ${isP1 ? 'bg-gradient-to-br from-player1-glow to-player1-dark shadow-glow-blue' : 'bg-gradient-to-br from-player2-glow to-player2-dark shadow-glow-orange'}`}
        >
          {id === 'P1' ? '1' : '2'}
        </div>
      )}
    </div>
  );
};
