import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { BLOCKS_INFO } from '@/data/blocks';
import { BlockType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const BlockToolbox: React.FC = () => {
  const selectedBlockType = useGameStore(s => s.selectedBlockType);
  const setSelectedBlock = useGameStore(s => s.setSelectedBlock);
  const getRemainingBlocks = useGameStore(s => s.getRemainingBlocks);
  const isSimulating = useGameStore(s => s.isSimulating);

  const remaining = getRemainingBlocks();
  const availableTypes = (Object.keys(remaining) as BlockType[]).filter(t => (remaining[t] ?? 0) >= 0);

  const handleSelect = (type: BlockType) => {
    if (isSimulating) return;
    const count = remaining[type] ?? 0;
    if (count <= 0) return;
    setSelectedBlock(selectedBlockType === type ? null : type);
  };

  return (
    <div className="pointer-events-auto">
      <div className="card-glass px-4 py-3 mx-4 mb-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {availableTypes.map((type, idx) => {
              const info = BLOCKS_INFO[type];
              const count = remaining[type] ?? 0;
              const isSelected = selectedBlockType === type;
              const isDisabled = count <= 0 || isSimulating;

              return (
                <motion.button
                  key={type}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: idx * 0.06, type: 'spring', stiffness: 260, damping: 22 }}
                  whileHover={!isDisabled ? { scale: 1.08, y: -4 } : {}}
                  whileTap={!isDisabled ? { scale: 0.96 } : {}}
                  onClick={() => handleSelect(type)}
                  disabled={isDisabled}
                  className={clsx(
                    'relative flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300',
                    'border-2',
                    isSelected
                      ? 'bg-gradient-to-br from-peach-100 to-peach-200 border-peach-400 shadow-pop -translate-y-1'
                      : 'bg-white/80 border-peach-200/60 shadow-cute hover:border-peach-300',
                    isDisabled && 'opacity-40 cursor-not-allowed grayscale'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selected-glow"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        boxShadow: '0 0 24px rgba(255, 154, 120, 0.5)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}

                  <span className="text-3xl z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                    {info.emoji}
                  </span>
                  <span className="font-cute text-sm text-cocoa-soft z-10">{info.name}</span>

                  <div
                    className={clsx(
                      'absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center font-cute text-xs border-2',
                      count > 0
                        ? 'bg-sunny-gold text-cocoa-soft border-white shadow-md'
                        : 'bg-gray-300 text-white border-gray-200'
                    )}
                  >
                    {count}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          <div className="flex-shrink-0 w-px h-16 bg-peach-200/50 mx-1" />

          <div className="flex-shrink-0 text-xs text-cocoa-light max-w-[140px] leading-relaxed">
            {selectedBlockType ? (
              <span className="text-peach-500 font-medium">
                💡 {BLOCKS_INFO[selectedBlockType].description}
                <br />
                <span className="text-cocoa-light/70">点击画布放置</span>
              </span>
            ) : (
              <span className="text-cocoa-light/60">
                👆 选择一个积木，<br />然后点击画布放置吧～
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
