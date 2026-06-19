import { useEffect, useRef } from 'react';
import { BookOpen, Scroll, AlertCircle, MapPin, Package, Settings, Compass } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { LogType } from '@/types';
import { cn } from '@/lib/utils';
import DecorativeCard from '@/components/common/DecorativeCard';

const logTypeConfig: Record<LogType, { icon: typeof Compass; color: string; label: string; border: string }> = {
  narrative: {
    icon: Scroll,
    color: 'text-parchment-300',
    label: '叙事',
    border: 'border-parchment-300',
  },
  event: {
    icon: AlertCircle,
    color: 'text-plasma-300',
    label: '事件',
    border: 'border-plasma-400',
  },
  route: {
    icon: MapPin,
    color: 'text-stardust-300',
    label: '航线',
    border: 'border-stardust-400',
  },
  item: {
    icon: Package,
    color: 'text-emerald-300',
    label: '物品',
    border: 'border-emerald-400',
  },
  system: {
    icon: Settings,
    color: 'text-space-100',
    label: '系统',
    border: 'border-space-300',
  },
};

export const StoryLog: React.FC = () => {
  const { storyLog } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [storyLog.length, storyLog]);

  const latestTimestamp = storyLog.length > 0 ? storyLog[storyLog.length - 1].timestamp : 0;

  return (
    <DecorativeCard
      title="舰长日志"
      icon={BookOpen}
      className="h-full flex flex-col"
      scrollable={false}
    >
      <div
        ref={containerRef}
        className="parchment-bg rounded-sm p-4 overflow-y-auto scrollbar-gold h-full min-h-0"
      >
        <div className="relative space-y-3">
          {storyLog.map((entry, idx) => {
            const cfg = logTypeConfig[entry.type];
            const Icon = cfg.icon;
            const isLatest = entry.timestamp === latestTimestamp && idx === storyLog.length - 1;

            return (
              <div
                key={`${entry.timestamp}-${idx}`}
                className={cn(
                  'relative pl-4',
                  isLatest && 'animate-slide-up'
                )}
              >
                {isLatest && (
                  <div
                    className={cn(
                      'absolute left-0 top-0 bottom-0 w-1 rounded-full',
                      cfg.border,
                      'bg-gradient-to-b from-transparent via-current to-transparent opacity-80'
                    )}
                    style={{ color: 'rgba(0, 212, 255, 0.7)' }}
                  />
                )}
                <div className="flex items-start gap-2 mb-1">
                  <div className={cn(
                    'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm',
                    'text-[10px] uppercase tracking-widest font-display font-semibold shrink-0',
                    'bg-space-900/40',
                    cfg.color
                  )}>
                    <Icon className="w-3 h-3" />
                    第{entry.day}天
                  </div>
                  <div className={cn(
                    'text-[10px] uppercase tracking-widest font-display opacity-70 pt-0.5',
                    cfg.color
                  )}>
                    · {cfg.label}
                  </div>
                </div>
                <div
                  className={cn(
                    'font-serif leading-relaxed text-sm',
                    'text-space-900/90',
                    entry.type === 'narrative' && 'italic text-[15px] text-space-900'
                  )}
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                >
                  {entry.content.split('\n\n').map((p, pi) => (
                    <p key={pi} className={pi > 0 ? 'mt-2' : ''}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DecorativeCard>
  );
};

export default StoryLog;
