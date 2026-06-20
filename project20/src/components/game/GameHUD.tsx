import { useGameStore } from '../../store/useGameStore';
import { Heart, Pause, Lightbulb, MapPin, HelpCircle } from 'lucide-react';

export default function GameHUD() {
  const player = useGameStore((s) => s.player);
  const currentRoom = useGameStore((s) => s.currentRoom);
  const rooms = useGameStore((s) => s.rooms);
  const score = useGameStore((s) => s.score);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const toggleHint = useGameStore((s) => s.toggleHint);
  const showHint = useGameStore((s) => s.showHint);
  const showGameInstructions = useGameStore((s) => s.showGameInstructions);
  const openGameInstructions = useGameStore((s) => s.openGameInstructions);
  const closeGameInstructions = useGameStore((s) => s.closeGameInstructions);
  const ghost = useGameStore((s) => s.ghost);

  const room = rooms[currentRoom];
  const ghostInRoom = ghost.currentRoom === currentRoom;

  return (
    <div className="w-full max-w-4xl mx-auto mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              border: '2px solid rgba(139, 115, 85, 0.5)',
            }}
          >
            <div className="flex gap-1">
              {Array.from({ length: player.maxHealth }).map((_, i) => (
                <Heart
                  key={i}
                  size={20}
                  fill={i < player.health ? '#ef4444' : 'transparent'}
                  stroke={i < player.health ? '#ef4444' : '#666'}
                  style={{
                    filter: i < player.health ? 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))' : 'none',
                    animation: i < player.health && player.health <= 1 ? 'pulse 1s infinite' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {ghostInRoom && (
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-lg animate-pulse"
              style={{
                background: 'rgba(139, 0, 0, 0.7)',
                border: '2px solid #8b0000',
              }}
            >
              <span className="text-red-200 text-sm font-bold">👻 鬼怪出没!</span>
            </div>
          )}
        </div>

        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            border: '2px solid rgba(139, 115, 85, 0.5)',
          }}
        >
          <MapPin size={16} className="text-amber-400" />
          <span className="text-amber-200 text-sm font-medium">{room?.name || '???'}</span>
        </div>

        <div className="flex items-center gap-3">
          <div 
            className="px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <span className="text-amber-300 text-sm font-bold">分数: {score}</span>
          </div>

          <button
            onClick={toggleHint}
            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
            style={{
              background: showHint ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
              border: `2px solid ${showHint ? 'rgba(255, 215, 0, 0.8)' : 'rgba(139, 115, 85, 0.5)'}`,
            }}
            title="提示"
          >
            <Lightbulb 
              size={20} 
              style={{ 
                color: showHint ? '#FFD700' : '#D4A574',
                filter: showHint ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))' : 'none',
              }} 
            />
          </button>

          <button
            onClick={openGameInstructions}
            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
            style={{
              background: showGameInstructions ? 'rgba(100, 180, 255, 0.3)' : 'rgba(0, 0, 0, 0.6)',
              border: `2px solid ${showGameInstructions ? 'rgba(100, 180, 255, 0.8)' : 'rgba(139, 115, 85, 0.5)'}`,
            }}
            title="游戏规则"
          >
            <HelpCircle 
              size={20} 
              style={{ 
                color: showGameInstructions ? '#64B4FF' : '#D4A574',
                filter: showGameInstructions ? 'drop-shadow(0 0 8px rgba(100, 180, 255, 0.6))' : 'none',
              }} 
            />
          </button>

          <button
            onClick={pauseGame}
            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '2px solid rgba(139, 115, 85, 0.5)',
            }}
            title="暂停"
          >
            <Pause size={20} className="text-amber-300" />
          </button>
        </div>
      </div>

      {showHint && (
        <div 
          className="mt-3 p-4 rounded-lg"
          style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '2px solid rgba(255, 215, 0, 0.5)',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <p className="text-amber-200 text-sm">
            💡 <span className="font-bold">提示：</span>
            {currentRoom === 'entrance' && '仔细查看桌上的纸条，上面可能有重要信息。抽屉需要三位数密码。'}
            {currentRoom === 'living_room' && '墙上的油画可能暗示着什么顺序。沙发下面也许藏着什么东西。'}
            {currentRoom === 'kitchen' && '旧书里面可能夹着什么。餐桌和架子上都可以看看。'}
            {currentRoom === 'study' && '宝石祭坛需要两颗宝石，按正确顺序放入。书桌抽屉里可能有一颗。'}
            {currentRoom === 'attic' && '神秘之门需要金钥匙才能打开。也许阁楼的宝箱里有线索？'}
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
