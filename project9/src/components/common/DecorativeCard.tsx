import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecorativeCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: LucideIcon;
  scrollable?: boolean;
}

export const DecorativeCard: React.FC<DecorativeCardProps> = ({
  children,
  className,
  title,
  icon: Icon,
  scrollable = true,
}) => {
  return (
    <div
      className={cn(
        'ornate-border rounded-sm flex flex-col relative',
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-stardust-400/30 bg-gradient-to-r from-stardust-500/10 via-stardust-400/5 to-transparent">
          <span className="w-1.5 h-1.5 rotate-45 bg-stardust-400" />
          {Icon && <Icon className="w-4 h-4 text-stardust-300 shrink-0" />}
          <h3 className="font-display text-stardust-200 tracking-widest text-sm uppercase">
            {title}
          </h3>
          <span className="w-1.5 h-1.5 rotate-45 bg-stardust-400 ml-auto" />
        </div>
      )}
      <div
        className={cn(
          'p-4 flex-1 min-h-0',
          scrollable && 'overflow-y-auto scrollbar-gold'
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default DecorativeCard;
