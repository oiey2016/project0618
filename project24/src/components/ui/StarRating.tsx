import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: number;
  animate?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  maxStars = 3,
  size = 32,
  animate = false,
}) => {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: maxStars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'transition-all duration-300',
            animate && i < stars && 'animate-bounce-slow',
            animate && `delay-${i * 150}`
          )}
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <Star
            size={size}
            className={cn(
              'transition-all duration-300',
              i < stars
                ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                : 'text-gray-300'
            )}
          />
        </div>
      ))}
    </div>
  );
};
