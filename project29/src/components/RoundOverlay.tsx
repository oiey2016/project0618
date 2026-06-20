import { useGameStore } from '../store/useGameStore';

export const RoundOverlay = () => {
  const phase = useGameStore((s) => s.phase);
  const countdown = useGameStore((s) => s.countdown);
  const currentRound = useGameStore((s) => s.currentRound);
  const roundWinner = useGameStore((s) => s.roundWinner);
  const gameWinner = useGameStore((s) => s.gameWinner);

  if (phase === 'menu' || phase === 'playing' || phase === 'gameEnd') {
    return null;
  }

  if (phase === 'countdown') {
    const num = Math.max(1, Math.ceil(countdown));
    const isGo = countdown < 1;
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="text-center animate-bounce-in">
          <div
            className={`font-display font-black leading-none
                        ${isGo
                          ? 'text-[10rem] text-gradient animate-pulse'
                          : num === 3
                            ? 'text-[12rem] text-player1-glow'
                            : num === 2
                              ? 'text-[12rem] text-accent-glow'
                              : 'text-[12rem] text-player2-glow'}`}
            style={{
              textShadow: isGo
                ? '0 0 60px rgba(52, 211, 153, 0.6), 0 0 120px rgba(52, 211, 153, 0.3)'
                : `0 0 40px currentColor`,
            }}
          >
            {isGo ? 'GO!' : num}
          </div>
          {!isGo && (
            <div className="mt-2 font-display font-bold text-xl tracking-[0.3em] text-slate-400">
              第 {currentRound} 回合
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'roundEnd' && roundWinner && !gameWinner) {
    const isP1 = roundWinner === 'P1';
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in rounded-3xl" />
        <div className="relative text-center animate-bounce-in">
          <div className="mb-3 font-display font-bold text-2xl tracking-[0.2em] text-slate-300">
            回合胜利！
          </div>
          <div
            className={`font-display font-black text-7xl leading-none
                        ${isP1 ? 'text-gradient-p1' : 'text-gradient-p2'}`}
            style={{
              textShadow: isP1
                ? '0 0 60px rgba(59, 130, 246, 0.6)'
                : '0 0 60px rgba(249, 115, 22, 0.6)',
            }}
          >
            {isP1 ? '玩家 1' : '玩家 2'}
          </div>
          <div className="mt-2 font-display font-semibold text-lg text-slate-400">
            {isP1 ? 'Player 1' : 'Player 2'} wins the round
          </div>
        </div>
      </div>
    );
  }

  return null;
};
