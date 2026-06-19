import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ClickEffect as ClickEffectType } from '../../types/game';

interface ClickEffectProps {
  effect: ClickEffectType;
}

export function ClickEffect({ effect }: ClickEffectProps) {
  const removeClickEffect = useGameStore(state => state.removeClickEffect);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeClickEffect(effect.id);
    }, 500);

    return () => clearTimeout(timer);
  }, [effect.id, removeClickEffect]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${effect.x}px`,
        top: `${effect.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="w-20 h-20 rounded-full border-4 border-yellow-400 animate-ripple" />
      <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-yellow-300 animate-ripple-delayed" />
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-particle"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-30px)`,
            animationDelay: `${i * 0.03}s`,
          }}
        />
      ))}
    </div>
  );
}
