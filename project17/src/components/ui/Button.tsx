import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'wood';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-body font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blood-red/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blood-red text-bone-white hover:bg-blood-red/90 active:scale-95 shadow-lg',
    secondary: 'bg-aged-wood text-bone-white hover:bg-aged-wood/90 active:scale-95 border border-rust',
    ghost: 'bg-transparent text-bone-white hover:bg-bone-white/10 active:scale-95',
    wood: 'bg-gradient-to-b from-aged-wood to-old-brown text-bone-white border-2 border-rust hover:from-rust hover:to-aged-wood active:scale-95 shadow-inner',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
