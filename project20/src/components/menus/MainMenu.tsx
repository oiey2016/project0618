import { useGameStore } from '../../store/useGameStore';
import { Play, HelpCircle, Info, RotateCcw, Home, Volume2 } from 'lucide-react';

export default function MainMenu() {
  const gameState = useGameStore((s) => s.gameState);
  const startGame = useGameStore((s) => s.startGame);
  const showInstructions = useGameStore((s) => s.showInstructions);
  const hideInstructions = useGameStore((s) => s.hideInstructions);

  const collectedItems = useGameStore((s) => s.collectedItems);
  const currentRoom = useGameStore((s) => s.currentRoom);
  const score = useGameStore((s) => s.score);

  const hasSave = collectedItems.length > 0 || currentRoom !== 'entrance' || score > 0;

  if (gameState !== 'menu' && gameState !== 'instructions') return null;

  const handleContinue = () => {
    useGameStore.setState({ gameState: 'playing' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #1a1520 0%, #2d2540 50%, #1a1520 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-200 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-72 opacity-20"
          style={{
            background: `
              linear-gradient(90deg, transparent 0%, #4a3d5c 10%, #4a3d5c 30%, transparent 30%, transparent 35%, #5c4d7a 35%, #5c4d7a 65%, transparent 65%, transparent 70%, #4a3d5c 70%, #4a3d5c 90%, transparent 90%)
            `,
            clipPath: 'polygon(0% 100%, 0% 40%, 10% 40%, 10% 20%, 20% 20%, 20% 10%, 30% 10%, 30% 0%, 70% 0%, 70% 10%, 80% 10%, 80% 20%, 90% 20%, 90% 40%, 100% 40%, 100% 100%)',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-12">
          <h1 
          className="text-6xl md:text-7xl font-bold mb-4"
          style={{
            color: '#E8D5B7',
            textShadow: `
              0 0 20px rgba(255, 200, 100, 0.5),
              0 0 40px rgba(255, 150, 50, 0.3),
              2px 2px 4px rgba(0, 0, 0, 0.8)
            `,
            fontFamily: 'serif',
            letterSpacing: '0.1em',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          微缩恐怖屋
        </h1>
          <p 
            className="text-amber-300/70 text-lg tracking-widest"
            style={{ fontFamily: 'serif', fontStyle: 'italic' }}
          >
            Miniature Horror House
          </p>
        </div>

        {gameState === 'menu' && (
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-64 mx-auto block py-4 px-8 rounded-lg font-bold text-xl transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 100%)',
                border: '3px solid #DAA520',
                color: '#FFE4B5',
                boxShadow: '0 4px 20px rgba(218, 165, 32, 0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
              }}
            >
              <Play className="inline mr-2" size={24} />
              开始游戏
            </button>

            {hasSave && (
              <button
                onClick={handleContinue}
                className="w-64 mx-auto block py-3 px-8 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #6B5A45 0%, #3D3022 100%)',
                  border: '2px solid #8B7355',
                  color: '#D4A574',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                }}
              >
                <RotateCcw className="inline mr-2" size={20} />
                继续游戏
              </button>
            )}

            <button
              onClick={showInstructions}
              className="w-64 mx-auto block py-3 px-8 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #4A3D5C 0%, #2D2540 100%)',
                border: '2px solid #6B5D8B',
                color: '#C4B5D4',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              <HelpCircle className="inline mr-2" size={20} />
              游戏说明
            </button>
          </div>
        )}

        {gameState === 'instructions' && (
          <div 
            className="w-full max-w-lg mx-auto p-6 rounded-xl text-left"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(139, 115, 85, 0.5)',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <h3 className="text-2xl font-bold text-amber-200 mb-4 text-center">游戏说明</h3>
            
            <div className="space-y-4 text-amber-100/90">
              <div className="flex gap-3">
              <span className="text-2xl">🖱️</span>
              <div>
                <p className="font-bold text-amber-200">移动与互动</p>
                <p className="text-sm text-amber-100/70">点击地面移动角色，点击物品进行互动。走近物品才能拾取或查看。</p>
              </div>
            </div>
              
              <div className="flex gap-3">
              <span className="text-2xl">🎒</span>
              <div>
                <p className="font-bold text-amber-200">物品系统</p>
                <p className="text-sm text-amber-100/70">收集的物品会放入物品栏。选中物品后点击目标可以使用。</p>
              </div>
            </div>
              
              <div className="flex gap-3">
              <span className="text-2xl">👻</span>
              <div>
                <p className="font-bold text-amber-200">躲避鬼怪</p>
                <p className="text-sm text-amber-100/70">小心游荡的鬼怪！被发现会损失生命。躲在家具后面或躲进柜子里躲避。</p>
              </div>
            </div>
              
              <div className="flex gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <p className="font-bold text-amber-200">解开谜题</p>
                <p className="text-sm text-amber-100/70">房间中有各种谜题和机关，找到线索解开它们。</p>
              </div>
            </div>
              
              <div className="flex gap-3">
              <span className="text-2xl">🚪</span>
              <div>
                <p className="font-bold text-amber-200">逃离屋子</p>
                <p className="text-sm text-amber-100/70">收集所有线索和钥匙，找到出口逃离这个诡异的微缩屋！</p>
              </div>
            </div>
            </div>

            <button
              onClick={hideInstructions}
              className="w-full mt-6 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 100%)',
                border: '2px solid #DAA520',
                color: '#FFE4B5',
              }}
            >
              <Home className="inline mr-2" size={20} />
              返回
            </button>
          </div>
        )}

        <div className="mt-12">
          <p className="text-amber-200/40 text-xs">
            点击开始你的微缩恐怖冒险
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
