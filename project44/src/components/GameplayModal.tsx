import { X } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const GameplayModal = () => {
  const { showGameplay, closeGameplay } = useGameStore();

  if (!showGameplay) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        <div className="card-wasteland p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rust-400 text-glow-rust">
              📖 游戏玩法
            </h2>
            <button
              onClick={closeGameplay}
              className="p-2 rounded-lg hover:bg-wasteland-border transition-colors"
            >
              <X className="w-5 h-5 text-wasteland-muted" />
            </button>
          </div>

          <div className="space-y-6 text-wasteland-text">
            <div>
              <h3 className="text-lg font-bold text-rust-500 mb-2">🌞 白天 - 生存准备</h3>
              <p className="text-sm text-wasteland-muted ml-4">
                白天是安全的，可以外出探索收集资源。点击底部的「探索」按钮前往不同地点获取材料。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-rust-500 mb-2">🏗️ 建造系统</h3>
              <p className="text-sm text-wasteland-muted ml-4">
                使用收集的资源建造和升级建筑。庇护所提供生命上限，农田产出食物，水井产出水源，防御建筑保护你免受僵尸攻击。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-rust-500 mb-2">⚔️ 武器制作</h3>
              <p className="text-sm text-wasteland-muted ml-4">
                在工作台制作武器提升战斗力。近战武器攻速快，远程武器伤害高。武器有耐久度，使用后会损坏。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-rust-500 mb-2">🧟 夜晚 - 僵尸来袭</h3>
              <p className="text-sm text-wasteland-muted ml-4">
                每晚僵尸都会攻击你的庇护所！确保建造足够的防御设施，并装备好武器。击败僵尸可以获得废料奖励。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-rust-500 mb-2">⚡ 生存提示</h3>
              <ul className="text-sm text-wasteland-muted ml-4 space-y-1">
                <li>• 保持饥饿度和口渴度，归零会持续掉血</li>
                <li>• 建造农田和水井可以自动产出食物和水</li>
                <li>• 升级仓库增加资源存储上限</li>
                <li>• 瞭望塔可以增加探索收益</li>
                <li>• 医疗站每天自动恢复生命值</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={closeGameplay}
              className="
                px-6 py-2 rounded-lg
                bg-gradient-to-r from-rust-700 to-rust-600
                border-2 border-rust-500
                font-bold text-white
                hover:from-rust-600 hover:to-rust-500
                hover:shadow-rust-glow
                transition-all duration-300
              "
            >
              知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};