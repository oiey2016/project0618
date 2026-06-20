import { useGameStore } from '@/store/useGameStore';
import { X, MousePointer, Package, Ghost, Lock, DoorOpen, Heart } from 'lucide-react';

interface RuleItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}

function RuleItem({ icon, title, description, iconBg }: RuleItemProps) {
  return (
    <div className="flex gap-3 items-start">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-amber-200 font-bold text-sm mb-1">{title}</h4>
        <p className="text-amber-100/70 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function GameInstructions() {
  const showGameInstructions = useGameStore((s) => s.showGameInstructions);
  const closeGameInstructions = useGameStore((s) => s.closeGameInstructions);

  if (!showGameInstructions) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeGameInstructions}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />
      
      <div 
        className="relative z-10 w-full max-w-lg"
        style={{ animation: 'zoomIn 0.3s ease-out' }}
      >
        <div 
          className="rounded-2xl p-6 shadow-2xl"
          style={{
            background: 'linear-gradient(180deg, #3D3022 0%, #2A2015 100%)',
            border: '3px solid #8B7355',
            boxShadow: '0 0 60px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 
              className="text-2xl font-bold text-amber-200"
              style={{ fontFamily: 'serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              📜 游戏规则
            </h3>
            <button
              onClick={closeGameInstructions}
              className="p-1.5 rounded-full text-amber-300 hover:bg-amber-900/40 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4">
              <RuleItem
                icon={<MousePointer size={20} className="text-amber-300" />}
                title="移动与互动"
                description="点击地面移动角色。走近物品后点击可拾取或查看。"
                iconBg="rgba(218, 165, 32, 0.2)"
              />
              
              <RuleItem
                icon={<Package size={20} className="text-green-400" />}
                title="物品使用"
                description="收集的物品会放入物品栏。点击选中后，再点击场景中的目标使用。"
                iconBg="rgba(74, 222, 128, 0.2)"
              />
              
              <RuleItem
                icon={<Ghost size={20} className="text-purple-400" />}
                title="躲避鬼怪"
                description="小心游荡的鬼怪！蓝色为巡逻，橙色为搜索，红色为追逐。被抓住会损失生命。"
                iconBg="rgba(192, 132, 252, 0.2)"
              />
              
              <RuleItem
                icon={<Heart size={20} className="text-red-400" />}
                title="生命值"
                description="你有3点生命值。生命归零则游戏失败。躲进家具后可以避开鬼怪。"
                iconBg="rgba(248, 113, 113, 0.2)"
              />
              
              <RuleItem
                icon={<Lock size={20} className="text-blue-400" />}
                title="解开谜题"
                description="房间中有各种谜题和机关。仔细观察环境，找到线索解开它们。"
                iconBg="rgba(96, 165, 250, 0.2)"
              />
              
              <RuleItem
                icon={<DoorOpen size={20} className="text-orange-400" />}
                title="逃离屋子"
                description="收集所有关键道具，解开最终谜题，找到出口逃离微缩恐怖屋！"
                iconBg="rgba(251, 146, 60, 0.2)"
              />
            </div>

            <div 
              className="mt-5 p-4 rounded-xl"
              style={{
                background: 'rgba(255, 215, 0, 0.08)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
              }}
            >
              <p className="text-amber-300 text-sm font-bold mb-2">⌨️ 快捷键</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-amber-100/70">
                  <kbd className="px-2 py-0.5 bg-amber-900/40 rounded text-amber-200">ESC</kbd> 暂停游戏
                </span>
                <span className="text-amber-100/70">
                  <kbd className="px-2 py-0.5 bg-amber-900/40 rounded text-amber-200">H</kbd> 显示提示
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <button
              onClick={closeGameInstructions}
              className="px-8 py-2.5 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #DAA520 0%, #B8860B 100%)',
                border: '2px solid #FFD700',
                color: '#2D1F00',
                boxShadow: '0 4px 12px rgba(218, 165, 32, 0.4)',
              }}
            >
              我知道了
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
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
