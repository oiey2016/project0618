import { X, Keyboard, Mouse, Pickaxe, Building2, Heart, Utensils } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          游戏玩法说明
        </h2>
        <p className="text-white/60 text-center mb-8">
          探索世界 · 收集资源 · 建造家园
        </p>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Keyboard className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">移动控制</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[50px] text-center">W</span>
                <span className="text-white/80">向前移动</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[50px] text-center">S</span>
                <span className="text-white/80">向后移动</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[50px] text-center">A</span>
                <span className="text-white/80">向左移动</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[50px] text-center">D</span>
                <span className="text-white/80">向右移动</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 col-span-2">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[80px] text-center">空格</span>
                <span className="text-white/80">跳跃</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Mouse className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">视角与交互</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[80px] text-center">鼠标移动</span>
                <span className="text-white/80">环顾四周，控制视角方向</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[80px] text-center">左键</span>
                <span className="text-white/80">破坏瞄准的方块，自动收集到背包</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[80px] text-center">右键</span>
                <span className="text-white/80">在瞄准方块的相邻位置放置方块</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[80px] text-center">1 - 5</span>
                <span className="text-white/80">快速切换物品栏中的方块类型</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <span className="bg-white/15 px-3 py-1.5 rounded-lg font-mono text-sm text-white font-bold min-w-[80px] text-center">ESC</span>
                <span className="text-white/80">释放鼠标指针，暂停视角控制</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-500/20 p-3 rounded-xl">
                  <Pickaxe className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">挖矿收集</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                用鼠标左键破坏草地方块、泥土、石头、木头等，收集到的资源会自动存入背包。不同方块有不同硬度，破坏时间略有差异。
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-500/20 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">建造创造</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                选择物品栏中的方块，用右键在世界中放置。建造房屋、围墙、平台，发挥你的创造力！注意不能在玩家所在位置放置方块。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-500/20 p-3 rounded-xl">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">生命值</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                顶部状态栏显示红心数量代表生命值。饥饿值充足时会自动恢复，掉落虚空或饥饿耗尽会损失生命值，为 0 时自动重生。
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500/20 p-3 rounded-xl">
                  <Utensils className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">饥饿值</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                鸡腿图标代表饥饿值。移动和跳跃会缓慢消耗饥饿值。生存压力极低，你可以专注于探索和建造而不用担心生存问题。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-10 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            开始探索
          </button>
        </div>
      </div>
    </div>
  );
}
