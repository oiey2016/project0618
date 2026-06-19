import { useState } from 'react';
import { RestaurantScene } from '@/components/RestaurantScene';
import { WelcomeModal } from '@/components/WelcomeModal';
import { HelpModal } from '@/components/HelpModal';
import { useGameStore } from '@/store/gameStore';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function RestaurantPage() {
  const [showHelp, setShowHelp] = useState(false);
  const { level, totalCatsServed, maxActiveCats, activeCats } = useGameStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 pt-20 pb-20">
      <WelcomeModal />
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-4 relative">
          <h1 className="text-2xl font-bold text-rose-600 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            喵喵餐厅
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-rose-400 mt-1">欢迎光临~喵</p>
          <button
            onClick={() => setShowHelp(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-white hover:shadow-lg transition-all active:scale-95"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 mb-4 flex justify-around">
          <div className="text-center">
            <p className="text-xs text-gray-500">餐厅等级</p>
            <p className="text-lg font-bold text-rose-500">Lv.{level}</p>
          </div>
          <div className="w-px bg-rose-100" />
          <div className="text-center">
            <p className="text-xs text-gray-500">已接待</p>
            <p className="text-lg font-bold text-amber-500">{totalCatsServed} 只</p>
          </div>
          <div className="w-px bg-rose-100" />
          <div className="text-center">
            <p className="text-xs text-gray-500">当前顾客</p>
            <p className="text-lg font-bold text-purple-500">{activeCats.length}/{maxActiveCats}</p>
          </div>
        </div>
        
        <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border-2 border-rose-100" style={{ height: '400px' }}>
          <RestaurantScene />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-rose-400">
            💡 点击猫咪头顶的金币来收取哦~
          </p>
        </div>
      </div>
    </div>
  );
}
