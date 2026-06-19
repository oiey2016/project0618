import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getCatById, getDishById } from '@/data';
import { cn } from '@/lib/utils';

interface CatSpriteProps {
  activeCatId: string;
}

export function CatSprite({ activeCatId }: CatSpriteProps) {
  const activeCat = useGameStore((state) => 
    state.activeCats.find(c => c.id === activeCatId)
  );
  const collectCoin = useGameStore((state) => state.collectCoin);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  
  const cat = activeCat ? getCatById(activeCat.catId) : null;
  const dish = activeCat?.orderedDish ? getDishById(activeCat.orderedDish) : null;
  
  useEffect(() => {
    if (activeCat?.coinReady && !showCoin) {
      setShowCoin(true);
      setIsBouncing(true);
    }
  }, [activeCat?.coinReady, showCoin]);
  
  if (!activeCat || !cat) return null;
  
  const handleClick = () => {
    if (activeCat.coinReady) {
      collectCoin(activeCatId);
      setShowCoin(false);
      setIsBouncing(false);
    }
  };
  
  const isFlipped = activeCat.state === 'leaving' || 
    (activeCat.state === 'walking' && activeCat.targetX > activeCat.positionX);
  
  return (
    <div
      className={cn(
        'absolute transition-transform cursor-pointer z-10',
        activeCat.coinReady && 'animate-pulse'
      )}
      style={{
        left: `${activeCat.positionX}%`,
        top: `${activeCat.positionY}%`,
        transform: `translate(-50%, -50%) scale(${isFlipped ? -1 : 1}, 1)`,
      }}
      onClick={handleClick}
    >
      <div className="relative">
        <div 
          className={cn(
            'text-5xl transition-transform duration-200 select-none',
            activeCat.state === 'walking' && 'animate-bounce-slow',
            activeCat.coinReady && 'scale-110',
            isBouncing && 'animate-bounce'
          )}
          style={{ 
            filter: activeCat.coinReady ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))' : 'none'
          }}
        >
          {cat.emoji}
        </div>
        
        {activeCat.state === 'eating' && dish && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce-slow">
            {dish.emoji}
          </div>
        )}
        
        {activeCat.coinReady && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="relative">
              <span className="text-2xl animate-bounce inline-block">🪙</span>
              <span className="absolute -top-1 -right-2 text-xs font-bold text-amber-600 bg-white/80 px-1 rounded-full">
                +{activeCat.coinAmount}
              </span>
            </div>
          </div>
        )}
        
        {activeCat.state === 'eating' && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-0.5">
            <span className="text-sm animate-float">💭</span>
          </div>
        )}
      </div>
    </div>
  );
}
