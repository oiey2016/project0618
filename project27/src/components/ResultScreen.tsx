import { PLAYER_CONFIGS } from '../game/constants';

interface ResultScreenProps {
  winnerId: number | null;
  onRestart: () => void;
  onMenu: () => void;
}

export function ResultScreen({ winnerId, onRestart, onMenu }: ResultScreenProps) {
  const winnerConfig = winnerId
    ? PLAYER_CONFIGS.find((p) => p.id === winnerId)
    : null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-30">
      <div className="relative text-center">
        <div className="absolute -inset-20 rounded-full blur-3xl opacity-50"
             style={{ backgroundColor: winnerConfig?.colorHex || '#8B5CF6' }} />
        
        <div className="relative z-10">
          <p
            className="text-2xl text-purple-300 mb-4 tracking-widest"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            获胜者
          </p>

          <div
            className="text-8xl font-black mb-8 text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(135deg, ${winnerConfig?.colorHex || '#FFFFFF'}, ${winnerConfig?.colorHex || '#FFFFFF'}88)`,
              textShadow: `0 0 50px ${winnerConfig?.colorHex || '#FFFFFF'}`,
              fontFamily: 'Orbitron, sans-serif',
            }}
          >
            {winnerConfig ? `P${winnerConfig.id}` : '无人'}
          </div>

          <div className="flex justify-center mb-12">
            <div
              className="w-24 h-32 relative"
              style={{ color: winnerConfig?.colorHex || '#FFFFFF' }}
            >
              <svg viewBox="0 0 40 70" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="20" cy="12" r="10" />
                <line x1="20" y1="22" x2="20" y2="45" />
                <line x1="20" y1="28" x2="8" y2="38" />
                <line x1="20" y1="28" x2="32" y2="38" />
                <line x1="20" y1="45" x2="12" y2="65" />
                <line x1="20" y1="45" x2="28" y2="65" />
              </svg>
              <div
                className="absolute -inset-4 rounded-full blur-xl opacity-60"
                style={{ backgroundColor: winnerConfig?.colorHex || '#FFFFFF' }}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onRestart}
              className="px-8 py-3 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #FF2E93, #8B5CF6)',
                boxShadow: '0 0 20px rgba(255, 46, 147, 0.4)',
                fontFamily: 'Orbitron, sans-serif',
              }}
            >
              再来一局
            </button>
            <button
              onClick={onMenu}
              className="px-8 py-3 rounded-full font-bold text-gray-300 border-2 border-gray-600 transition-all duration-300 hover:border-purple-400 hover:text-purple-300 hover:scale-105 active:scale-95"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              返回菜单
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-bounce"
            style={{
              backgroundColor:
                i % 3 === 0
                  ? '#00F5FF'
                  : i % 3 === 1
                  ? '#FF2E93'
                  : '#FFE600',
              left: `${(i * 47) % 100}%`,
              top: `${(i * 31) % 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${1 + (i % 3)}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}
