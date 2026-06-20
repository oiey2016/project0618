import { useGameStore } from '../../store/useGameStore';
import { RotateCcw, Home, Trophy, Skull } from 'lucide-react';

export default function EndScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const score = useGameStore((s) => s.score);
  const startGame = useGameStore((s) => s.startGame);
  const goToMenu = useGameStore((s) => s.goToMenu);

  const isVictory = gameState === 'victory';
  const isGameOver = gameState === 'gameover';

  if (!isVictory && !isGameOver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          background: isVictory 
            ? 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)'
            : 'radial-gradient(circle, rgba(139, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.9) 100%)',
          animation: 'fadeIn 0.5s ease-out',
        }}
      />
      
      <div 
        className="relative z-10 text-center px-4"
        style={{ animation: 'zoomIn 0.5s ease-out' }}
      >
        <div className="mb-8">
          {isVictory ? (
            <>
              <div className="text-8xl mb-6" style={{ animation: 'bounce 1s ease-in-out infinite' }}>
                🏆
              </div>
              <h1 
                className="text-5xl font-bold mb-4"
                style={{
                  color: '#FFD700',
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.8)',
                  fontFamily: 'serif',
                }}
              >
                成功逃脱！
              </h1>
              <p className="text-amber-200 text-xl">
                你从微缩恐怖屋中逃了出来！
              </p>
            </>
          ) : (
            <>
              <div className="text-8xl mb-6" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                💀
              </div>
              <h1 
                className="text-5xl font-bold mb-4"
                style={{
                  color: '#8B0000',
                  textShadow: '0 0 30px rgba(139, 0, 0, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.8)',
                  fontFamily: 'serif',
                }}
              >
                游戏结束
              </h1>
              <p className="text-red-300 text-xl">
                你被鬼怪抓住了...
              </p>
            </>
          )}
        </div>

        <div 
          className="rounded-xl p-6 mb-8 inline-block"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: `2px solid ${isVictory ? 'rgba(255, 215, 0, 0.5)' : 'rgba(139, 0, 0, 0.5)'}`,
          }}
        >
          <p className="text-amber-300 text-sm mb-1">最终得分</p>
          <p 
            className="text-4xl font-bold"
            style={{ 
              color: isVictory ? '#FFD700' : '#CD5C5C',
              textShadow: `0 0 10px ${isVictory ? 'rgba(255, 215, 0, 0.5)' : 'rgba(205, 92, 92, 0.5)'}`,
            }}
          >
            {score}
          </p>
        </div>

        <div className="space-y-3 w-56 mx-auto">
          <button
            onClick={startGame}
            className="w-full py-4 px-6 rounded-lg font-bold text-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: isVictory
                ? 'linear-gradient(180deg, #DAA520 0%, #B8860B 100%)'
                : 'linear-gradient(180deg, #8B3A3A 0%, #5C1A1A 100%)',
              border: `3px solid ${isVictory ? '#FFD700' : '#CD5C5C'}`,
              color: isVictory ? '#2D1F00' : '#FFE0E0',
              boxShadow: `0 4px 15px ${isVictory ? 'rgba(218, 165, 32, 0.4)' : 'rgba(139, 0, 0, 0.4)'}`,
            }}
          >
            <RotateCcw className="inline mr-2" size={22} />
            再玩一次
          </button>

          <button
            onClick={goToMenu}
            className="w-full py-3 px-6 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #4A3D5C 0%, #2D2540 100%)',
              border: '2px solid #6B5D8B',
              color: '#C4B5D4',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Home className="inline mr-2" size={20} />
            返回主菜单
          </button>
        </div>
      </div>

      {isVictory && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#90EE90'][i % 4],
                animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
