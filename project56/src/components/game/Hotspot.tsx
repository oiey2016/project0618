import React from 'react';
import { Hotspot as HotspotType } from '../../types/game';
import { useGameStore } from '../../store/useGameStore';
import { getPuzzleById } from '../../data/puzzles';
import { getGuestById } from '../../data/guests';
import { getItemById } from '../../data/items';
import { inspectTexts } from '../../data/scenes';

interface HotspotProps {
  hotspot: HotspotType;
}

export const Hotspot: React.FC<HotspotProps> = ({ hotspot }) => {
  const {
    selectedItem,
    collectedItems,
    solvedPuzzles,
    servedGuests,
    getFlag,
    collectItem,
    selectItem,
    useItem,
    openPuzzle,
    showDialogue,
    serveDish,
  } = useGameStore();

  const conditionMet = (condition?: string): boolean => {
    if (!condition) return true;
    if (condition.startsWith('!')) {
      return !getFlag(condition.slice(1));
    }
    return getFlag(condition);
  };

  if (!conditionMet(hotspot.condition)) {
    return null;
  }

  const isCollected = hotspot.type === 'item' && collectedItems.includes(hotspot.targetId);
  const isSolved = hotspot.type === 'puzzle' && solvedPuzzles.includes(hotspot.targetId);
  const isServed = hotspot.type === 'npc' && servedGuests.includes(hotspot.targetId);

  if (isCollected) {
    return null;
  }

  const handleClick = () => {
    if (hotspot.type === 'item') {
      if (selectedItem) {
        selectItem(null);
      } else {
        collectItem(hotspot.targetId);
      }
    } else if (hotspot.type === 'puzzle') {
      if (selectedItem) {
        const puzzle = getPuzzleById(hotspot.targetId);
        if (puzzle?.type === 'item_use' && puzzle.requiredItem === selectedItem) {
          useItem(selectedItem, hotspot.targetId);
        } else {
          showDialogue('这个东西好像用在这里不太对...', '系统');
          selectItem(null);
        }
      } else {
        openPuzzle(hotspot.targetId);
      }
    } else if (hotspot.type === 'npc') {
      const guest = getGuestById(hotspot.targetId);
      if (guest) {
        if (selectedItem && selectedItem === guest.requiredDish) {
          serveDish(hotspot.targetId);
        } else {
          const dialogues = isServed ? guest.servedDialogue : guest.dialogue;
          const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
          showDialogue(randomDialogue, guest.name);
        }
      }
    } else if (hotspot.type === 'inspect') {
      const text = inspectTexts[hotspot.targetId];
      if (text) {
        showDialogue(text, '观察');
      }
    }
  };

  const getCursorStyle = () => {
    if (selectedItem) {
      return 'cursor-crosshair';
    }
    return 'cursor-pointer';
  };

  return (
    <div
      className={`absolute ${getCursorStyle} transition-all duration-200 hover:scale-105`}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.width}%`,
        height: `${hotspot.height}%`,
      }}
      onClick={handleClick}
      title={hotspot.hint}
    >
      <div className="w-full h-full relative group">
        <div className="absolute inset-0 border-2 border-transparent rounded group-hover:border-candle-orange/50 group-hover:bg-candle-orange/10 transition-all duration-300 rounded" />
        
        {hotspot.type === 'item' && (
          <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse-slow">
            {getItemById(hotspot.targetId)?.icon || '✨'}
          </div>
        )}
        
        {hotspot.type === 'npc' && (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            {getGuestById(hotspot.targetId)?.portrait || '👤'}
          </div>
        )}
        
        {hotspot.type === 'puzzle' && !isSolved && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-candle-orange/60 animate-pulse" />
          </div>
        )}

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs text-parchment/80 bg-shadow-black/80 px-2 py-1 rounded">
            {hotspot.hint}
          </span>
        </div>
      </div>
    </div>
  );
};
