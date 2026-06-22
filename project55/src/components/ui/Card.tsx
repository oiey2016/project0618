import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  hover?: boolean;
  gradient?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, gradient = false, children, whileHover, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-cream-200 p-4',
          gradient && 'bg-gradient-to-br from-white/90 to-cream-50/80',
          hover && 'hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-pointer',
          className
        )}
        whileHover={hover ? (whileHover || { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }) : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
