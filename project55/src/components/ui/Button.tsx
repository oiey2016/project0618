import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, disabled, children, whileTap, ...props }, ref) => {
    const baseStyles = 'font-bold rounded-xl transition-all duration-200 transform active:scale-95 active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
    
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-gradient-to-br from-mint-300 to-mint-400 text-white shadow-md hover:shadow-lg hover:from-mint-400 hover:to-mint-500',
      secondary: 'bg-gradient-to-br from-coral-300 to-coral-400 text-white shadow-md hover:shadow-lg hover:from-coral-400 hover:to-coral-500',
      ghost: 'bg-cream-100 text-coffee-500 hover:bg-cream-200 shadow-sm',
      danger: 'bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md hover:shadow-lg hover:from-red-500 hover:to-red-600',
    };
    
    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled}
        whileTap={!disabled ? (whileTap || { scale: 0.95 }) : undefined}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
