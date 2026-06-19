import { useState } from 'react';
import { CATS } from '@/data/cats';
import { DISHES } from '@/data/dishes';
import { useGameStore } from '@/store/gameStore';
import { getRarityColor, getRarityLabel, getRarityBorderColor } from '@/utils';
import { Cat, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type RarityFilter = 'all' | 'common' | 'rare' | 'epic' | 'legendary';

export default function CatsPage() {
  const { unlockedCats, catVisitCounts } = useGameStore();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [filter, setFilter] = useState<RarityFilter>('all');
  
  const filteredCats = filter === 'all' 
    ? CATS 
    : CATS.filter(cat => cat.rarity === filter);
  
  const unlockedCount = unlockedCats.length;
  const totalCount = CATS.length;
  
  const selectedCatData = selectedCat ? CATS.find(c => c.id === selectedCat) : null;
  const isSelectedUnlocked = selectedCat ? unlockedCats.includes(selectedCat) : false;
  
  const filters: { value: RarityFilter; label: string; color: string }[] = [
    { value: 'all', label: '全部', color: 'bg-gray-200 text-gray-600' },
    { value: 'common', label: '普通', color: 'bg-gray-100 text-gray-600' },
    { value: 'rare', label: '稀有', color: 'bg-blue-100 text-blue-600' },
    { value: 'epic', label: '史诗', color: 'bg-purple-100 text-purple-600' },
    { value: 'legendary', label: '传说', color: 'bg-yellow-100 text-yellow-600' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pt-20 pb-24">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-purple-700 flex items-center justify-center gap-2">
            <Cat className="w-7 h-7 text-purple-500" />
            猫咪图鉴
          </h1>
          <p className="text-sm text-purple-400 mt-1">
            已收集 {unlockedCount} / {totalCount} 只猫咪
          </p>
        </div>
        
        <div className="bg-white/60 rounded-full p-1 mb-4 flex gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex-1 py-1.5 px-2 rounded-full text-xs font-medium transition-all',
                filter === f.value 
                  ? f.color + ' shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <div className="h-2 bg-white/50 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {filteredCats.map((cat) => {
            const isUnlocked = unlockedCats.includes(cat.id);
            const visitCount = catVisitCounts[cat.id] || 0;
            
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={cn(
                  'bg-white/70 backdrop-blur-sm rounded-2xl p-3 border-2 transition-all duration-300 cursor-pointer',
                  isUnlocked 
                    ? `${getRarityBorderColor(cat.rarity)} shadow-md hover:scale-105` 
                    : 'border-gray-200 opacity-60',
                  selectedCat === cat.id && 'ring-2 ring-purple-400 ring-offset-2'
                )}
              >
                <div className="text-center">
                  <div className="relative inline-block">
                    <span className={cn(
                      'text-4xl block',
                      !isUnlocked && 'grayscale blur-sm'
                    )}>
                      {cat.emoji}
                    </span>
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">❓</span>
                      </div>
                    )}
                    {isUnlocked && visitCount > 0 && (
                      <div className="absolute -top-1 -right-2 bg-rose-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {visitCount}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-gray-700 mt-2 text-sm">
                    {isUnlocked ? cat.name : '???'}
                  </h3>
                  
                  <span className={cn(
                    'inline-block text-xs px-2 py-0.5 rounded-full mt-1',
                    getRarityColor(cat.rarity)
                  )}>
                    {getRarityLabel(cat.rarity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedCatData && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setSelectedCat(null)}
          >
            <div 
              className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-10 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              
              <div className="text-center">
                <div className="relative inline-block">
                  <span className={cn(
                    'text-7xl',
                    !isSelectedUnlocked && 'grayscale blur-md'
                  )}>
                    {selectedCatData.emoji}
                  </span>
                  {!isSelectedUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl">❓</span>
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-700 mt-3">
                  {isSelectedUnlocked ? selectedCatData.name : '未知猫咪'}
                </h2>
                
                <span className={cn(
                  'inline-block text-sm px-3 py-1 rounded-full mt-2',
                  getRarityColor(selectedCatData.rarity)
                )}>
                  {getRarityLabel(selectedCatData.rarity)}
                </span>
                
                {isSelectedUnlocked ? (
                  <>
                    <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                      {selectedCatData.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="bg-rose-50 rounded-xl p-3">
                        <Heart className="w-5 h-5 text-rose-400 mx-auto" />
                        <p className="text-xs text-gray-500 mt-1">性格</p>
                        <p className="text-sm font-bold text-rose-500">{selectedCatData.personality}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3">
                        <span className="text-xl">💰</span>
                        <p className="text-xs text-gray-500 mt-1">打赏</p>
                        <p className="text-sm font-bold text-amber-500">{selectedCatData.coinReward}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3">
                        <Star className="w-5 h-5 text-purple-400 mx-auto" />
                        <p className="text-xs text-gray-500 mt-1">来访</p>
                        <p className="text-sm font-bold text-purple-500">{catVisitCounts[selectedCatData.id] || 0}次</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-2">❤️ 喜欢的食物</p>
                      <div className="flex justify-center gap-2 flex-wrap">
                        {selectedCatData.favoriteDishes.map((dishId) => {
                          const dishData = DISHES.find(d => d.id === dishId);
                          return (
                            <div key={dishId} className="text-center">
                              <span className="text-2xl">{dishData?.emoji || '🍽️'}</span>
                              <p className="text-xs text-gray-500 mt-1">{dishData?.name || '???'}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">
                      🔒 解锁条件：研究对应的菜品后可能会遇到哦~
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedCat(null)}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all active:scale-95"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
