import { useNavigate } from 'react-router-dom';
import { Play, Keyboard, Mouse, Info } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export default function StartPage() {
  const navigate = useNavigate();
  const startGame = useGameStore((state) => state.startGame);

  const handleStart = () => {
    startGame();
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-12 bg-white/60 rounded-full blur-sm" />
        <div className="absolute top-32 right-20 w-48 h-16 bg-white/50 rounded-full blur-sm" />
        <div className="absolute top-16 left-1/3 w-40 h-14 bg-white/40 rounded-full blur-sm" />
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
          方块世界
        </h1>
        <p className="text-2xl text-white/90 mb-12 drop-shadow-md">
          极简沙盒建造生存游戏
        </p>

        <button
          onClick={handleStart}
          className="group bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-bold py-5 px-16 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-4 mx-auto mb-16"
        >
          <Play className="w-8 h-8" />
          开始游戏
        </button>

        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
            <Info className="w-6 h-6" />
            操作说明
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Keyboard className="w-6 h-6 text-white" />
                <h3 className="text-lg font-semibold text-white">移动控制</h3>
              </div>
              <ul className="text-white/80 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">W</span>
                  向前移动
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">S</span>
                  向后移动
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">A</span>
                  向左移动
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">D</span>
                  向右移动
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">空格</span>
                  跳跃
                </li>
              </ul>
            </div>

            <div className="bg-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Mouse className="w-6 h-6 text-white" />
                <h3 className="text-lg font-semibold text-white">交互控制</h3>
              </div>
              <ul className="text-white/80 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">鼠标</span>
                  移动视角
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">左键</span>
                  破坏方块
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">右键</span>
                  放置方块
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">1-5</span>
                  切换方块
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded font-mono text-sm">ESC</span>
                  释放鼠标
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-6 text-white/70 text-sm">
            💡 提示：点击游戏画面锁定鼠标，按 ESC 键释放
          </p>
        </div>

        <p className="mt-8 text-white/60 text-sm">
          探索 · 挖矿 · 建造 · 生存
        </p>
      </div>
    </div>
  );
}
