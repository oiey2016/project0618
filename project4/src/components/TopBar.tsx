import { Coins, Star, TrendingUp } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { formatNumber } from '@/utils';

export function TopBar() {
  const { coins, level, reputation, experience, experienceToNextLevel } = useGameStore();
  
  const expPercent = (experience / experienceToNextLevel) * 100;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 pb-2">
      <div className="max-w-lg mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
              <Coins className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-amber-600 text-lg">{formatNumber(coins)}</span>
          </div>
          
          <div className="flex-1 max-w-28">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-rose-400" fill="currentColor" />
              <span className="text-xs font-bold text-rose-500">Lv.{level}</span>
            </div>
            <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-purple-600">{formatNumber(reputation)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
