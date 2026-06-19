import { useState, useEffect } from 'react';

interface FloatingCoinProps {
  id: string;
  amount: number;
  x: number;
  y: number;
  onComplete: (id: string) => void;
}

export function FloatingCoin({ id, amount, x, y, onComplete }: FloatingCoinProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(id), 300);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id, onComplete]);
  
  return (
    <div
      className={`absolute pointer-events-none z-30 transition-all duration-1000 ${
        isVisible ? 'opacity-100 -translate-y-8' : 'opacity-0 -translate-y-16'
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) ${isVisible ? 'translateY(-20px)' : 'translateY(-60px)'}`,
      }}
    >
      <div className="relative">
        <span className="text-xl">🪙</span>
        <span className="absolute -top-1 -right-6 text-sm font-bold text-amber-500 whitespace-nowrap drop-shadow-md">
          +{amount}
        </span>
      </div>
    </div>
  );
}

interface FloatingCoinManagerProps {
  coins: { id: string; amount: number; x: number; y: number }[];
  onRemove: (id: string) => void;
}

export function FloatingCoinManager({ coins, onRemove }: FloatingCoinManagerProps) {
  return (
    <>
      {coins.map((coin) => (
        <FloatingCoin
          key={coin.id}
          id={coin.id}
          amount={coin.amount}
          x={coin.x}
          y={coin.y}
          onComplete={onRemove}
        />
      ))}
    </>
  );
}
