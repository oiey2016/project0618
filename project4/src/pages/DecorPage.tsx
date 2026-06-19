import { useState } from 'react';
import { DECORATIONS } from '@/data/decorations';
import { useGameStore } from '@/store/gameStore';
import { Palette, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type CategoryFilter = 'all' | 'furniture' | 'plant' | 'toy' | 'wall';

export default function DecorPage() {
  const { 
    ownedDecorations, 
    placedDecorations,
    buyDecoration, 
    placeDecoration,
    removeDecoration,
    coins,
    reputation,
  } = useGameStore();
  
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [activeTab, setActiveTab] = useState<'shop' | 'owned'>('shop');
  const [selectedDeco, setSelectedDeco] = useState<string | null>(null);
  
  const filteredDecorations = filter === 'all'
    ? DECORATIONS
    : DECORATIONS.filter(d => d.category === filter);
  
  const ownedCount = ownedDecorations.length;
  const totalCount = DECORATIONS.length;
  
  const categories: { value: CategoryFilter; label: string; emoji: string }[] = [
    { value: 'all', label: '全部', emoji: '🏠' },
    { value: 'furniture', label: '家具', emoji: '🪑' },
    { value: 'plant', label: '植物', emoji: '🌱' },
    { value: 'toy', label: '玩具', emoji: '🧸' },
    { value: 'wall', label: '墙饰', emoji: '🖼️' },
  ];
  
  const handleBuy = (decoId: string) => {
    const success = buyDecoration(decoId);
    if (success) {
      setSelectedDeco(null);
    }
  };
  
  const handlePlace = (decoId: string) => {
    const x = 20 + Math.random() * 60;
    const y = 30 + Math.random() * 40;
    placeDecoration(decoId, x, y);
  };
  
  const selectedDecoration = selectedDeco ? DECORATIONS.find(d => d.id === selectedDeco) : null;
  const isOwned = selectedDeco ? ownedDecorations.includes(selectedDeco) : false;
  const canAfford = selectedDecoration ? coins >= selectedDecoration.price : false;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50 pt-20 pb-24">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-teal-700 flex items-center justify-center gap-2">
            <Palette className="w-7 h-7 text-teal-500" />
            装饰商店
          </h1>
          <p className="text-sm text-teal-400 mt-1">
            装扮你的餐厅，吸引更多猫咪~
          </p>
        </div>
        
        <div className="bg-white/60 rounded-full p-1 mb-4 flex">
          <button
            onClick={() => setActiveTab('shop')}
            className={cn(
              'flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1',
              activeTab === 'shop'
                ? 'bg-teal-400 text-white shadow-sm'
                : 'text-gray-400'
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            商店
          </button>
          <button
            onClick={() => setActiveTab('owned')}
            className={cn(
              'flex-1 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1',
              activeTab === 'owned'
                ? 'bg-teal-400 text-white shadow-sm'
                : 'text-gray-400'
            )}
          >
            <Check className="w-4 h-4" />
            我的 ({ownedCount})
          </button>
        </div>
        
        {activeTab === 'shop' && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={cn(
                    'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1',
                    filter === cat.value
                      ? 'bg-teal-400 text-white shadow-sm'
                      : 'bg-white/60 text-gray-500'
                  )}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-teal-600">
                收集进度：{ownedCount} / {totalCount}
              </p>
              <div className="h-2 bg-white/50 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(ownedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'owned' && (
          <div className="bg-white/50 rounded-xl p-3 mb-4 flex justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-500">{ownedCount}</p>
              <p className="text-xs text-gray-500">已拥有</p>
            </div>
            <div className="w-px bg-teal-100" />
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">{reputation}</p>
              <p className="text-xs text-gray-500">声望值</p>
            </div>
            <div className="w-px bg-teal-100" />
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-500">{placedDecorations.length}</p>
              <p className="text-xs text-gray-500">已摆放</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-3">
          {(activeTab === 'shop' ? filteredDecorations : DECORATIONS.filter(d => ownedDecorations.includes(d.id))).map((deco) => {
            const isOwnedDeco = ownedDecorations.includes(deco.id);
            const isPlaced = placedDecorations.some(p => p.decorationId === deco.id);
            
            return (
              <div
                key={deco.id}
                onClick={() => setSelectedDeco(deco.id)}
                className={cn(
                  'bg-white/70 backdrop-blur-sm rounded-2xl p-3 border-2 transition-all duration-300 cursor-pointer',
                  isOwnedDeco
                    ? 'border-teal-200 shadow-md'
                    : 'border-gray-100 opacity-80',
                  selectedDeco === deco.id && 'ring-2 ring-teal-400 ring-offset-2',
                  'hover:scale-105'
                )}
              >
                <div className="text-center">
                  <div className="relative inline-block">
                    <span className={cn(
                      'text-4xl block',
                      !isOwnedDeco && activeTab === 'shop' && 'grayscale opacity-70'
                    )}>
                      {deco.emoji}
                    </span>
                    {isOwnedDeco && (
                      <div className="absolute -top-1 -right-2">
                        <div className="w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                    {isPlaced && (
                      <div className="absolute -bottom-1 -right-1">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-gray-700 mt-2 text-sm">
                    {deco.name}
                  </h3>
                  
                  {activeTab === 'shop' && !isOwnedDeco && (
                    <p className="text-sm text-amber-500 font-semibold mt-1">
                      💰 {deco.price}
                    </p>
                  )}
                  
                  {isOwnedDeco && (
                    <p className="text-xs text-purple-500 mt-1">
                      +{deco.reputationBonus} 声望
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedDecoration && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setSelectedDeco(null)}
          >
            <div 
              className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-10 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              
              <div className="text-center">
                <span className="text-7xl">{selectedDecoration.emoji}</span>
                
                <h2 className="text-2xl font-bold text-gray-700 mt-3">
                  {selectedDecoration.name}
                </h2>
                
                <p className="text-gray-500 text-sm mt-2">
                  {selectedDecoration.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">声望加成</p>
                    <p className="text-lg font-bold text-purple-500">+{selectedDecoration.reputationBonus}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">价格</p>
                    <p className="text-lg font-bold text-amber-500">💰 {selectedDecoration.price}</p>
                  </div>
                </div>
                
                {isOwned ? (
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => {
                        handlePlace(selectedDecoration.id);
                        setSelectedDeco(null);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-white font-bold rounded-2xl hover:from-teal-500 hover:to-emerald-500 transition-all active:scale-95"
                    >
                      摆放到餐厅
                    </button>
                    <p className="text-xs text-gray-400">
                      已摆放 {placedDecorations.filter(p => p.decorationId === selectedDecoration.id).length} 个
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(selectedDecoration.id)}
                    disabled={!canAfford}
                    className={cn(
                      'mt-6 w-full py-3 font-bold rounded-2xl transition-all active:scale-95',
                      canAfford
                        ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    {canAfford ? '购买' : '金币不足'}
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedDeco(null)}
                  className="mt-3 w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
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
