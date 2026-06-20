import { useGameStore } from '../../store/useGameStore';
import { Play, RotateCcw, Home, Pause, HelpCircle } from 'lucide-react';

export default function PauseMenu() {
  const gameState = useGameStore((s) => s.gameState);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const startGame = useGameStore((s) => s.startGame);
  const goToMenu = useGameStore((s) => s.goToMenu);
  const openGameInstructions = useGameStore((s) => s.openGameInstructions);

  if (gameState !== 'paused') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />
      
      <div 
        className="relative z-10 text-center"
        style={{ animation: 'zoomIn 0.3s ease-out' }}
      >
        <div 
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: 'linear-gradient(180deg, #5C4A3A 0%, #3D3022 100%)',
            border: '4px solid #8B7355',
            boxShadow: '0 0 50px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
          }}
        >
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255, 215, 0, 0.2)',
                border: '2px solid #DAA520',
              }}
            >
              <Pause size={32} className="text-amber-300" />
            </div>
            <h2 
              className="text-3xl font-bold text-amber-200"
              style={{ fontFamily: 'serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              游戏暂停
            </h2>
          </div>

          <div className="space-y-3 w-56 mx-auto">
            <button
              onClick={resumeGame}
              className="w-full py-3 px-6 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #DAA520 0%, #B8860B 100%)',
                border: '3px solid #FFD700',
                color: '#2D1F00',
                boxShadow: '0 4px 12px rgba(218, 165, 32, 0.4)',
              }}
            >
              <Play className="inline mr-2" size={20} />
              继续游戏
            </button>

            <button
              onClick={startGame}
              className="w-full py-3 px-6 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 100%)',
                border: '2px solid #A0826D',
                color: '#FFE4B5',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              <RotateCcw className="inline mr-2" size={18} />
              重新开始
            </button>

            <button
              onClick={openGameInstructions}
              className="w-full py-3 px-6 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #3D5A7A 0%, #2A3D5C 100%)',
                border: '2px solid #5A7A9A',
                color: '#B5D4FF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              <HelpCircle className="inline mr-2" size={18} />
              游戏规则
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
              <Home className="inline mr-2" size={18} />
              返回主菜单
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
