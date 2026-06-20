import { useGameStore } from '@/store/gameStore';

export default function StatusBar() {
  const health = useGameStore((state) => state.player.health);
  const hunger = useGameStore((state) => state.player.hunger);
  const position = useGameStore((state) => state.player.position);

  const healthHearts = Math.ceil(health / 2);
  const hungerDrumsticks = Math.ceil(hunger / 2);

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 10; i++) {
      const isFull = i < healthHearts;
      const isHalf = !isFull && i < Math.ceil(health / 2) && health % 2 !== 0;
      hearts.push(
        <span
          key={i}
          className={`text-2xl ${
            isFull ? 'text-red-500' : isHalf ? 'text-red-300' : 'text-gray-400'
          }`}
        >
          {isFull ? '❤' : isHalf ? '💔' : '🤍'}
        </span>
      );
    }
    return hearts;
  };

  const renderDrumsticks = () => {
    const drumsticks = [];
    for (let i = 0; i < 10; i++) {
      const isFull = i < hungerDrumsticks;
      drumsticks.push(
        <span
          key={i}
          className={`text-2xl ${isFull ? 'text-amber-500' : 'text-gray-400'}`}
        >
          {isFull ? '🍗' : '🦴'}
        </span>
      );
    }
    return drumsticks;
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          {renderHearts()}
        </div>
        <div className="flex items-center gap-1">
          {renderDrumsticks()}
        </div>
        <div className="text-white/80 text-sm font-mono">
          X: {position.x.toFixed(1)} Y: {position.y.toFixed(1)} Z: {position.z.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
