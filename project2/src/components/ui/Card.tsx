import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'dark';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-gradient-to-b from-stone-800 to-stone-900 border-2 border-stone-700',
      gold: 'bg-gradient-to-b from-amber-900/50 to-stone-900 border-2 border-amber-600',
      dark: 'bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, scale: 1.02 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'rounded-xl shadow-xl overflow-hidden',
          variants[variant],
          hover && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
