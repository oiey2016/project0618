import React from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const PixelCard: React.FC<PixelCardProps> = ({ 
  children, 
  className,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'pixel-border bg-white p-4 transition-all duration-200',
        hoverable && 'hover:shadow-pixel-hover hover:-translate-y-1 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
