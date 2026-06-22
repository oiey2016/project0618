import React from 'react';
import { Exit } from '../../types/game';
import { useGameStore } from '../../store/useGameStore';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface NavButtonsProps {
  exits: Exit[];
}

export const NavButtons: React.FC<NavButtonsProps> = ({ exits }) => {
  const { changeScene, getFlag, selectedItem, selectItem } = useGameStore();

  const conditionMet = (condition?: string): boolean => {
    if (!condition) return true;
    if (condition.startsWith('!')) {
      return !getFlag(condition.slice(1));
    }
    return getFlag(condition);
  };

  const handleExitClick = (exit: Exit) => {
    if (selectedItem) {
      selectItem(null);
      return;
    }
    if (conditionMet(exit.condition)) {
      changeScene(exit.targetScene);
    }
  };

  const getButtonPosition = (direction: string) => {
    switch (direction) {
      case 'left':
        return 'left-4 top-1/2 -translate-y-1/2';
      case 'right':
        return 'right-4 top-1/2 -translate-y-1/2';
      case 'up':
        return 'top-4 left-1/2 -translate-x-1/2 mt-8';
      case 'down':
        return 'bottom-28 left-1/2 -translate-x-1/2';
      default:
        return '';
    }
  };

  const getIcon = (direction: string) => {
    switch (direction) {
      case 'left':
        return <ChevronLeft size={32} />;
      case 'right':
        return <ChevronRight size={32} />;
      case 'up':
        return <ChevronUp size={32} />;
      case 'down':
        return <ChevronDown size={32} />;
      default:
        return null;
    }
  };

  return (
    <>
      {exits.map((exit) => {
        if (!conditionMet(exit.condition)) return null;
        
        return (
          <button
            key={`${exit.direction}-${exit.targetScene}`}
            className={`absolute z-20 flex flex-col items-center gap-1 text-parchment/70 hover:text-parchment transition-all duration-200 hover:scale-110 ${getButtonPosition(exit.direction)}`}
            onClick={() => handleExitClick(exit)}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-shadow-black/50 backdrop-blur-sm border border-rust-mid/50 hover:border-candle-orange/50 hover:bg-shadow-black/80 transition-all duration-300">
              {getIcon(exit.direction)}
            </div>
            {exit.label && (
              <span className="text-xs font-serif-old bg-shadow-black/60 px-2 py-0.5 rounded">
                {exit.label}
              </span>
            )}
          </button>
        );
      })}
    </>
  );
};
