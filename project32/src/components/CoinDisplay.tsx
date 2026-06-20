import { usePlayerStore } from '@/store/playerStore';
import { Coins } from 'lucide-react';

export default function CoinDisplay({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const gold = usePlayerStore((state) => state.gold);

  const sizeClasses = {
    sm: 'text-base px-3 py-1',
    md: 'text-lg px-4 py-2',
    lg: 'text-xl px-6 py-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-full font-bold text-yellow-900 ${sizeClasses[size]}`}
      style={{
        background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 50%, #f59e0b 100%)',
        boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
      }}
    >
      <Coins size={iconSizes[size]} className="text-yellow-700" />
      <span>{gold.toLocaleString()}</span>
    </div>
  );
}
