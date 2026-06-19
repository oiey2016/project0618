import { useState, useEffect } from 'react';
import { DISHES } from '@/data/dishes';
import { useGameStore } from '@/store/gameStore';
import { getRarityColor, getRarityLabel, getRarityBorderColor, formatTime } from '@/utils';
import { Lock, Clock, Sparkles, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MenuPage() {
  const { 
    unlockedDishes, 
    researchingDish, 
    startResearch,
    coins,
  } = useGameStore();
  
  const [researchProgress, setResearchProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  useEffect(() => {
    if (!researchingDish) {
      setResearchProgress(0);
      setTimeLeft(0);
      return;
    }
    
    const updateProgress = () => {
      const elapsed = Date.now() - researchingDish.startTime;
      const progress = Math.min(100, (elapsed / researchingDish.duration) * 100);
      const remaining = Math.max(0, Math.ceil((researchingDish.duration - elapsed) / 1000));
      setResearchProgress(progress);
      setTimeLeft(remaining);
    };
    
    updateProgress();
    const interval = setInterval(updateProgress, 100);
    
    return () => clearInterval(interval);
  }, [researchingDish]);
  
  const handleResearch = (dishId: string) => {
    startResearch(dishId);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pt-20 pb-24">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-700 flex items-center justify-center gap-2">
            <ChefHat className="w-7 h-7 text-amber-500" />
            菜谱研究
          </h1>
          <p className="text-sm text-amber-400 mt-1">研究新菜品，吸引更多猫咪~</p>
        </div>
        
        {researchingDish && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl animate-bounce-slow">
                {DISHES.find(d => d.id === researchingDish.dishId)?.emoji}
              </div>
              <div className="flex-1">
                <p className="font-bold text-amber-700">
                  正在研究: {DISHES.find(d => d.id === researchingDish.dishId)?.name}
                </p>
                <p className="text-xs text-amber-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  剩余 {formatTime(timeLeft)}
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
            <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-200"
                style={{ width: `${researchProgress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {DISHES.map((dish) => {
            const isUnlocked = unlockedDishes.includes(dish.id);
            const isResearching = researchingDish?.dishId === dish.id;
            const canAfford = coins >= dish.unlockCost;
            const canResearch = !isUnlocked && !researchingDish && canAfford && dish.unlockCost > 0;
            
            return (
              <div
                key={dish.id}
                className={cn(
                  'bg-white/70 backdrop-blur-sm rounded-2xl p-3 border-2 transition-all duration-300',
                  isUnlocked 
                    ? `${getRarityBorderColor(dish.rarity)} shadow-md` 
                    : 'border-gray-200 opacity-80',
                  canResearch && 'hover:scale-105 hover:shadow-lg cursor-pointer'
                )}
                onClick={() => canResearch && handleResearch(dish.id)}
              >
                <div className="text-center">
                  <div className="relative inline-block">
                    <span className={cn(
                      'text-4xl block',
                      !isUnlocked && 'grayscale opacity-50'
                    )}>
                      {dish.emoji}
                    </span>
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {isResearching && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-gray-700 mt-2 text-sm">
                    {dish.name}
                  </h3>
                  
                  <span className={cn(
                    'inline-block text-xs px-2 py-0.5 rounded-full mt-1',
                    getRarityColor(dish.rarity)
                  )}>
                    {getRarityLabel(dish.rarity)}
                  </span>
                  
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 h-8">
                    {dish.description}
                  </p>
                  
                  {isUnlocked ? (
                    <div className="mt-2 text-sm text-amber-600 font-semibold">
                      💰 售价 {dish.basePrice}
                    </div>
                  ) : (
                    <div className={cn(
                      'mt-2 text-sm font-semibold',
                      canAfford ? 'text-amber-500' : 'text-gray-400'
                    )}>
                      {dish.unlockCost > 0 ? (
                        <>
                          🔬 研究费 {dish.unlockCost}
                          {dish.unlockTime > 0 && (
                            <span className="block text-xs text-gray-400">
                              ⏱️ {formatTime(dish.unlockTime)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-green-500">已解锁</span>
                      )}
                    </div>
                  )}
                  
                  {canResearch && (
                    <button className="mt-2 w-full py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all active:scale-95">
                      开始研究
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 bg-white/50 rounded-xl p-3 text-center">
          <p className="text-xs text-amber-600">
            💡 研究新菜品可以吸引更多种类的猫咪顾客哦~
          </p>
        </div>
      </div>
    </div>
  );
}
