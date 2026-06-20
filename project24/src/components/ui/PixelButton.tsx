import React from 'react';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-candy-pink text-white hover:bg-pink-500',
  secondary: 'bg-candy-teal text-white hover:bg-teal-500',
  success: 'bg-green-400 text-white hover:bg-green-500',
  danger: 'bg-red-400 text-white hover:bg-red-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        'pixel-btn font-bold select-none',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-pixel',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
