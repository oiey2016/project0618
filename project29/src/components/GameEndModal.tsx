import { useGameStore } from '../store/useGameStore';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';

export const GameEndModal = () => {
  const phase = useGameStore((s) => s.phase);
  const gameWinner = useGameStore((s) => s.gameWinner);
  const p1Score = useGameStore((s) => s.players.P1.score);
  const p2Score = useGameStore((s) => s.players.P2.score);
  const startGame = useGameStore((s) => s.actions.startGame);
  const backToMenu = useGameStore((s) => s.actions.backToMenu);

  if (phase !== 'gameEnd' || !gameWinner) return null;

  const isP1 = gameWinner === 'P1';
  const winnerScore = isP1 ? p1Score : p2Score;
  const loserScore = isP1 ? p2Score : p1Score;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-40 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-3xl" />

      <div className="relative w-full max-w-[520px] mx-6 animate-bounce-in">
        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center
                          shadow-2xl animate-float
                          ${isP1 ? 'bg-gradient-to-br from-player1-glow via-player1 to-player1-dark shadow-glow-blue' : 'bg-gradient-to-br from-player2-glow via-player2 to-player2-dark shadow-glow-orange'}`}>
            <Trophy size={44} className="text-white drop-shadow-lg" />
          </div>
          <Sparkles
            size={20}
            className={`absolute top-1 left-3 animate-pulse ${isP1 ? 'text-player1-glow' : 'text-player2-glow'}`}
          />
          <Sparkles
            size={16}
            className={`absolute top-6 right-1 animate-pulse ${isP1 ? 'text-accent-glow' : 'text-player1-glow'}`}
            style={{ animationDelay: '0.3s' }}
          />
          <Sparkles
            size={14}
            className={`absolute bottom-3 right-4 animate-pulse ${isP1 ? 'text-player2-glow' : 'text-accent-glow'}`}
            style={{ animationDelay: '0.6s' }}
          />
        </div>

        <div className="glass-card rounded-3xl pt-20 pb-8 px-8 border border-white/10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                            bg-accent/10 border border-accent/30 mb-4">
              <Trophy size={14} className="text-accent-glow" />
              <span className="font-display font-bold text-xs tracking-[0.2em] text-accent-glow">
                GAME, SET & MATCH
              </span>
            </div>

            <h2 className={`font-display font-black text-6xl leading-none mb-2
                            ${isP1 ? 'text-gradient-p1' : 'text-gradient-p2'}`}
                style={{
                  textShadow: isP1
                    ? '0 0 60px rgba(59, 130, 246, 0.5)'
                    : '0 0 60px rgba(249, 115, 22, 0.5)',
                }}>
              {isP1 ? '玩家 1' : '玩家 2'}
            </h2>
            <p className="font-display font-bold text-2xl text-white tracking-wide">
              赢得了整场胜利！
            </p>
            <p className="text-slate-400 mt-1 text-sm">
              {isP1 ? 'Player 1' : 'Player 2'} is the ultimate champion
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <ScoreSummary
              label="胜者"
              name={isP1 ? '玩家 1' : '玩家 2'}
              score={winnerScore}
              colorClass={isP1 ? 'player1' : 'player2'}
              isWinner
            />
            <ScoreSummary
              label="挑战者"
              name={isP1 ? '玩家 2' : '玩家 1'}
              score={loserScore}
              colorClass={isP1 ? 'player2' : 'player1'}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={startGame}
              className="btn-primary flex-1 sm:flex-none"
            >
              <RotateCcw size={18} className="mr-2" />
              再来一局
            </button>
            <button
              onClick={backToMenu}
              className="btn-secondary flex-1 sm:flex-none"
            >
              <Home size={18} className="mr-2" />
              返回主菜单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreSummary = ({
  label,
  name,
  score,
  colorClass,
  isWinner = false,
}: {
  label: string;
  name: string;
  score: number;
  colorClass: 'player1' | 'player2';
  isWinner?: boolean;
}) => {
  const isP1 = colorClass === 'player1';
  return (
    <div
      className={`rounded-2xl p-4 text-center
                  ${isWinner
                    ? 'bg-gradient-to-br ' + (isP1 ? 'from-player1/15 to-player1/5 border border-player1/30' : 'from-player2/15 to-player2/5 border border-player2/30')
                    : 'bg-white/[0.03] border border-white/5'}`}
    >
      <div className={`font-display font-bold text-[10px] tracking-[0.2em] mb-1
                      ${isWinner ? 'text-accent-glow' : 'text-slate-500'}`}>
        {label.toUpperCase()}
      </div>
      <div className={`font-display font-bold text-base mb-1 ${isP1 ? 'text-gradient-p1' : 'text-gradient-p2'}`}>
        {name}
      </div>
      <div className={`font-display font-black text-4xl ${isWinner ? 'text-white' : 'text-slate-500'}`}>
        {score}
      </div>
    </div>
  );
};
