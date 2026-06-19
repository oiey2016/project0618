import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    const baseStyles = 'relative font-bold rounded-lg transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden';
    
    const variants = {
      primary: 'bg-gradient-to-b from-amber-500 to-amber-700 text-white shadow-lg hover:from-amber-400 hover:to-amber-600 hover:shadow-xl border-2 border-amber-800',
      secondary: 'bg-gradient-to-b from-stone-600 to-stone-800 text-white shadow-lg hover:from-stone-500 hover:to-stone-700 hover:shadow-xl border-2 border-stone-900',
      success: 'bg-gradient-to-b from-green-500 to-green-700 text-white shadow-lg hover:from-green-400 hover:to-green-600 hover:shadow-xl border-2 border-green-800',
      danger: 'bg-gradient-to-b from-red-500 to-red-700 text-white shadow-lg hover:from-red-400 hover:to-red-600 hover:shadow-xl border-2 border-red-800',
      ghost: 'bg-transparent text-amber-400 hover:bg-amber-900/30 border border-amber-700/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
