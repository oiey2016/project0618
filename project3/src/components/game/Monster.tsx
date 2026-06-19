import { useState, useCallback, useEffect } from 'react';
import { useGameStore, getMonsterEmoji } from '../../store/useGameStore';
import { HealthBar } from './HealthBar';
import { DamageNumber } from './DamageNumber';
import { ClickEffect } from './ClickEffect';

export function Monster() {
  const monster = useGameStore(state => state.monster);
  const clickMonster = useGameStore(state => state.clickMonster);
  const damageNumbers = useGameStore(state => state.damageNumbers);
  const clickEffects = useGameStore(state => state.clickEffects);
  const screenShake = useGameStore(state => state.screenShake);

  const [isHit, setIsHit] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    clickMonster(x, y);

    setIsHit(true);
    setTimeout(() => setIsHit(false), 100);
  }, [clickMonster]);

  useEffect(() => {
    const monsterEl = document.querySelector('.animate-float, .animate-boss-float');
    const handleTouch = (e: TouchEvent) => {
      e.stopPropagation();
    };
    if (monsterEl) {
      monsterEl.addEventListener('touchstart', handleTouch, { passive: true });
      return () => monsterEl.removeEventListener('touchstart', handleTouch);
    }
  }, []);

  if (!monster) return null;

  const emoji = getMonsterEmoji(monster.type);
  const shakeX = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
  const shakeY = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;

  return (
    <div
      className="relative h-full w-full flex flex-col items-center justify-center"
      style={{
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        transition: 'transform 0.05s',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-indigo-900/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-4 lg:gap-8 p-4 lg:p-8 w-full max-w-xl mx-auto">
        <div
          className={`text-center mb-2 ${monster.isBoss ? 'animate-pulse' : ''}`}
        >
          <h2
            className={`text-xl lg:text-2xl font-bold ${
              monster.isBoss ? 'text-red-400' : 'text-gray-200'
            }`}
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {monster.isBoss && <span className="mr-2">👑</span>}
            {monster.name}
          </h2>
          {monster.isBoss && (
            <div className="text-yellow-500 text-sm mt-1 font-semibold">
              BOSS
            </div>
          )}
        </div>

        <div className="w-full max-w-md px-4">
          <HealthBar
            currentHp={monster.currentHp}
            maxHp={monster.maxHp}
            isBoss={monster.isBoss}
          />
        </div>

        <div
          onClick={handleClick}
          className={`relative cursor-pointer select-none transition-transform duration-100 touch-manipulation ${
            isHit ? 'scale-95' : 'hover:scale-105'
          } ${monster.isBoss ? 'animate-boss-float' : 'animate-float'}`}
          style={{
            fontSize: monster.isBoss ? 'clamp(100px, 20vw, 180px)' : 'clamp(80px, 15vw, 140px)',
            textShadow: monster.isBoss
              ? '0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.4)'
              : '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
            filter: isHit ? 'brightness(2) saturate(2)' : 'none',
            lineHeight: 1,
          }}
        >
          <span className="block select-none">{emoji}</span>

          {isHit && (
            <div className="absolute inset-0 bg-white/30 rounded-full animate-flash" />
          )}
        </div>

        <p className="text-gray-500 text-xs lg:text-sm">点击攻击怪物</p>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {damageNumbers.map(dmg => (
          <DamageNumber key={dmg.id} damage={dmg} />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {clickEffects.map(effect => (
          <ClickEffect key={effect.id} effect={effect} />
        ))}
      </div>

      {monster.isBoss && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent animate-pulse" />
        </div>
      )}
    </div>
  );
}
