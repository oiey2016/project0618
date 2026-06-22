import { X, MousePointer2, Smartphone, Music2, Trophy, Heart } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass-card w-full max-w-2xl p-8 animate-slide-down">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 flex items-center justify-center
                     hover:bg-white hover:scale-110 transition-all duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-display font-black text-3xl md:text-4xl mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            怎么玩？
          </h2>
          <p className="text-gray-500">简单几步，享受节奏的快乐！</p>
        </div>

        <div className="space-y-5">
          <div className="flex gap-4 items-start p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-1">选择喜欢的歌曲</h3>
              <p className="text-gray-600 text-sm">
                从三首不同难度的歌曲中挑一首，新手推荐从「小星星」开始哦！
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-1">跟着箭头踩准节拍</h3>
              <p className="text-gray-600 text-sm">
                箭头会从上方落下，当箭头到达底部的发光判定线时，立刻点击对应的轨道！
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-sky-50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <MousePointer2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">键盘操作</h3>
                <div className="flex gap-2 mb-2">
                  <kbd className="px-3 py-1 rounded-lg bg-white shadow font-mono font-bold text-pink-600">D</kbd>
                  <kbd className="px-3 py-1 rounded-lg bg-white shadow font-mono font-bold text-purple-600">F</kbd>
                  <kbd className="px-3 py-1 rounded-lg bg-white shadow font-mono font-bold text-cyan-600">J</kbd>
                  <kbd className="px-3 py-1 rounded-lg bg-white shadow font-mono font-bold text-emerald-600">K</kbd>
                </div>
                <p className="text-gray-600 text-xs">4个键对应4条轨道</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">触屏操作</h3>
                <p className="text-gray-600 text-sm">
                  直接用手指点击屏幕上对应的轨道区域，支持多点触控！
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-1">追求更高评价</h3>
              <div className="flex gap-3 flex-wrap mb-2">
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">✨ Perfect</span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">🌟 Great</span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">👍 Good</span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-bold text-sm">💔 Miss</span>
              </div>
              <p className="text-gray-600 text-sm">
                时机越准，分数越高！连续命中还能累积 Combo 加成哦~
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 pt-6 border-t border-white/50">
          <div className="flex items-center gap-2 text-gray-600">
            <Music2 className="w-5 h-5 text-pink-500" />
            <span className="text-sm">享受音乐</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Trophy className="w-5 h-5 text-purple-500" />
            <span className="text-sm">挑战高分</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="text-sm">保持好心情</span>
          </div>
        </div>
      </div>
    </div>
  );
}
