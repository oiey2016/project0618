import { useMemo } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { EVOLUTION_STAGES } from '@/data/evolutionTree';

export default function BackgroundLayer() {
  const currentStage = useGameStore(state => state.currentStage);

  const stage = useMemo(() => {
    return EVOLUTION_STAGES.find(s => s.id === currentStage) || EVOLUTION_STAGES[0];
  }, [currentStage]);

  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 3,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`,
    }));
  }, []);

  const nebulaClouds = useMemo(() => {
    const colors = [
      'rgba(110, 40, 217, 0.3)',
      'rgba(16, 185, 129, 0.2)',
      'rgba(251, 191, 36, 0.2)',
      'rgba(14, 165, 233, 0.2)',
      'rgba(249, 115, 22, 0.2)',
    ];
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${200 + Math.random() * 300}px`,
      height: `${200 + Math.random() * 300}px`,
      color: colors[i % colors.length],
      delay: `${i * 4}s`,
    }));
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden transition-all duration-1500 ${stage.bgClass}`}>
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {nebulaClouds.map(cloud => (
          <div
            key={cloud.id}
            className="nebula-cloud"
            style={{
              left: cloud.left,
              top: cloud.top,
              width: cloud.width,
              height: cloud.height,
              backgroundColor: cloud.color,
              animationDelay: cloud.delay,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
