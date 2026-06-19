interface HealthBarProps {
  currentHp: number;
  maxHp: number;
  isBoss: boolean;
}

export function HealthBar({ currentHp, maxHp, isBoss }: HealthBarProps) {
  const percentage = Math.max(0, (currentHp / maxHp) * 100);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between text-sm mb-1">
        <span className={`font-bold ${isBoss ? 'text-red-400' : 'text-gray-300'}`}>
          HP
        </span>
        <span className="text-gray-400">
          {Math.floor(currentHp).toLocaleString()} / {maxHp.toLocaleString()}
        </span>
      </div>
      <div className="h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-600 shadow-inner">
        <div
          className={`h-full transition-all duration-100 ease-out ${
            isBoss
              ? 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600'
              : 'bg-gradient-to-r from-green-600 via-emerald-400 to-green-600'
          }`}
          style={{
            width: `${percentage}%`,
            boxShadow: isBoss
              ? '0 0 20px rgba(239, 68, 68, 0.6), inset 0 0 10px rgba(255,255,255,0.3)'
              : '0 0 10px rgba(52, 211, 153, 0.5), inset 0 0 10px rgba(255,255,255,0.3)',
          }}
        />
      </div>
    </div>
  );
}
