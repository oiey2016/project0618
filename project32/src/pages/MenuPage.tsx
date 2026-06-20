import { useNavigate } from 'react-router-dom';
import { Play, ShoppingBag, User, Volume2, VolumeX, BookOpen } from 'lucide-react';
import { useState } from 'react';
import StarBackground from '@/components/StarBackground';
import CoinDisplay from '@/components/CoinDisplay';
import { usePlayerStore } from '@/store/playerStore';

export default function MenuPage() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const playerName = usePlayerStore((state) => state.name);
  const level = usePlayerStore((state) => state.level);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarBackground />

      <div className="absolute top-6 right-6 z-10">
        <CoinDisplay size="lg" />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="text-white" size={24} />
          ) : (
            <VolumeX className="text-gray-400" size={24} />
          )}
        </button>
      </div>

      <div className="z-10 text-center px-6">
        <div className="mb-8 animate-float">
          <div className="text-7xl mb-4">🧭</div>
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-4 text-gradient-gold text-shadow-glow font-display"
          style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
        >
          知识探险队
        </h1>

        <p className="text-xl text-gray-300 mb-12">
          踏上冒险之旅，用智慧征服每一个关卡！
        </p>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => navigate('/map')}
            className="btn-primary text-xl px-12 py-4 flex items-center gap-3 min-w-[280px] justify-center"
          >
            <Play size={28} fill="currentColor" />
            开始冒险
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="btn-secondary text-lg px-8 py-3 flex items-center gap-2 min-w-[280px] justify-center"
          >
            <ShoppingBag size={22} />
            装备商店
          </button>

          <button
            onClick={() => navigate('/inventory')}
            className="btn-secondary text-lg px-8 py-3 flex items-center gap-2 min-w-[280px] justify-center"
          >
            <User size={22} />
            角色背包
          </button>

          <button
            onClick={() => navigate('/guide')}
            className="text-lg px-8 py-3 flex items-center gap-2 min-w-[280px] justify-center rounded-xl font-bold text-yellow-300 transition-all duration-200 transform hover:bg-white/10 border-2 border-yellow-500/50 hover:border-yellow-400"
          >
            <BookOpen size={22} />
            游戏玩法
          </button>
        </div>

        <div className="mt-12 game-card inline-block px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🧙</div>
            <div className="text-left">
              <div className="font-bold text-lg">{playerName}</div>
              <div className="text-sm text-gray-300">等级 {level}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-sm text-gray-500">
        © 2024 知识探险队 - 寓教于乐
      </div>
    </div>
  );
}
