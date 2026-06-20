import type { Player } from '../game/types';

interface HealthBarProps {
  players: Player[];
}

export function HealthBar({ players }: HealthBarProps) {
  return (
    <div className="absolute top-4 left-0 right-0 flex justify-center gap-6 z-10 pointer-events-none">
      {players.map((player) => (
        <div
          key={player.id}
          className={`flex flex-col items-center transition-opacity duration-300 ${
            player.isAlive ? 'opacity-100' : 'opacity-40'
          }`}
          style={{ minWidth: '180px' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                backgroundColor: player.colorHex,
                boxShadow: `0 0 15px ${player.colorHex}`,
              }}
            >
              P{player.id}
            </div>
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: player.colorHex }}
            >
              {player.isAlive ? 'ALIVE' : 'DEFEATED'}
            </span>
          </div>

          <div className="w-full h-5 bg-gray-900/80 rounded-full overflow-hidden border-2 border-gray-700 relative">
            <div
              className="h-full transition-all duration-200 ease-out"
              style={{
                width: `${(player.hp / player.maxHp) * 100}%`,
                background: `linear-gradient(90deg, ${player.colorHex}dd, ${player.colorHex})`,
                boxShadow: `0 0 10px ${player.colorHex}`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {player.hp} / {player.maxHp}
              </span>
            </div>
          </div>

          {player.weapon && (
            <div className="mt-1 px-2 py-0.5 bg-orange-500/30 rounded text-xs text-orange-300 border border-orange-500/50">
              🔫 {player.weapon.type.toUpperCase()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
