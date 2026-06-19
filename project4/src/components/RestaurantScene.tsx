import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CatSprite } from '@/components/CatSprite';
import { DecorationSprite } from '@/components/DecorationSprite';

export function RestaurantScene() {
  const activeCats = useGameStore((state) => state.activeCats);
  const placedDecorations = useGameStore((state) => state.placedDecorations);
  const updateCats = useGameStore((state) => state.updateCats);
  const lastTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;
      
      updateCats(deltaTime);
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateCats]);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50" />
      
      <div className="absolute top-8 left-0 right-0 h-1 bg-rose-100" />
      
      <div className="absolute top-12 left-8 text-4xl opacity-60">🖼️</div>
      <div className="absolute top-14 right-12 text-3xl opacity-60">🕐</div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-amber-100 to-amber-200">
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-full h-0.5 bg-amber-300"
              style={{ top: `${i * 15 + 10}%` }}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-4/5 flex justify-around">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative">
            <div className="text-3xl">🪑</div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">🍽️</div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 h-16 bg-gradient-to-t from-amber-200 to-transparent" />
      
      {placedDecorations.map((deco) => (
        <DecorationSprite key={deco.id} placedId={deco.id} />
      ))}
      
      {activeCats.map((cat) => (
        <CatSprite key={cat.id} activeCatId={cat.id} />
      ))}
      
      <div className="absolute bottom-8 right-4 text-5xl">
        👨‍🍳
      </div>
      
      <div className="absolute top-16 left-4 text-2xl animate-float-slow opacity-70">
        ✨
      </div>
      <div className="absolute top-24 right-8 text-xl animate-float-slow opacity-60" style={{ animationDelay: '1s' }}>
        ✨
      </div>
    </div>
  );
}
