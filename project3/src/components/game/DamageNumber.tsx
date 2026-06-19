import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { formatNumber } from '../../utils/formatter';
import { DamageNumber as DamageNumberType } from '../../types/game';

interface DamageNumberProps {
  damage: DamageNumberType;
}

export function DamageNumber({ damage }: DamageNumberProps) {
  const removeDamageNumber = useGameStore(state => state.removeDamageNumber);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeDamageNumber(damage.id);
    }, 1000);

    return () => clearTimeout(timer);
  }, [damage.id, removeDamageNumber]);

  return (
    <div
      className={`absolute pointer-events-none font-bold text-2xl animate-float-up ${
        damage.isCrit ? 'text-yellow-400 text-3xl' : 'text-white'
      }`}
      style={{
        left: `${damage.x}px`,
        top: `${damage.y}px`,
        textShadow: damage.isCrit
          ? '0 0 10px #ffd700, 0 0 20px #ffd700, 2px 2px 4px rgba(0,0,0,0.8)'
          : '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5)',
        fontFamily: 'Cinzel, serif',
      }}
    >
      {damage.isCrit && <span className="text-xs mr-1">暴击!</span>}
      -{formatNumber(damage.value)}
    </div>
  );
}
