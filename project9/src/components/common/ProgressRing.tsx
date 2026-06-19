import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  size: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  icon?: LucideIcon;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size,
  strokeWidth = 4,
  color = '#d4af37',
  label,
  icon: Icon,
  className,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashOffset = circumference - (clampedValue / 100) * circumference;

  const centerSize = size * 0.42;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${color}80)`,
          }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color }}
      >
        {Icon ? (
          <Icon size={centerSize} strokeWidth={2} />
        ) : (
          <>
            {label && (
              <span
                className="font-display uppercase tracking-widest leading-none"
                style={{ fontSize: size * 0.12 }}
              >
                {label}
              </span>
            )}
            <span
              className="font-display font-bold leading-tight"
              style={{ fontSize: size * 0.22 }}
            >
              {Math.round(clampedValue)}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
