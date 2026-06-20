import React from 'react';
import { motion } from 'framer-motion';
import { StarsCount } from '@/types';

interface StarRatingProps {
  stars: StarsCount;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ stars, size = 'md', animated = true }) => {
  const sizeMap = { sm: 20, md: 32, lg: 52 };
  const starSize = sizeMap[size];

  return (
    <div className="flex items-center gap-1.5 justify-center">
      {[1, 2, 3].map((i) => {
        const filled = i <= stars;
        return (
          <motion.div
            key={i}
            initial={animated ? { scale: 0, rotate: -180 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
              delay: animated ? i * 0.15 : 0,
            }}
            style={{ width: starSize, height: starSize }}
          >
            <svg viewBox="0 0 24 24" width={starSize} height={starSize}>
              <defs>
                <linearGradient id={`star-grad-${i}-${filled}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={filled ? '#FFE5A0' : '#E8E0D4'} />
                  <stop offset="100%" stopColor={filled ? '#FFB84D' : '#D4C8B8'} />
                </linearGradient>
                <filter id={`shadow-${i}-${filled}`}>
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={filled ? '#FFB84D' : '#CCC'} floodOpacity="0.4" />
                </filter>
              </defs>
              <path
                d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8 5.9 21l1.5-6.8L2.2 9.5l6.9-.7L12 2.5z"
                fill={`url(#star-grad-${i}-${filled})`}
                stroke={filled ? '#FFA64D' : '#C8BCAC'}
                strokeWidth="1.2"
                strokeLinejoin="round"
                filter={`url(#shadow-${i}-${filled})`}
              />
              {filled && (
                <path
                  d="M12 5l1.8 3.9 4.3.4-3.2 2.9.9 4.2-3.8-2.2-3.8 2.2.9-4.2L5.9 9.3l4.3-.4L12 5z"
                  fill="white"
                  opacity="0.35"
                />
              )}
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};
