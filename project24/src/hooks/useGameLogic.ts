import { useState, useCallback, useEffect, useRef } from 'react';
import { Level, PixelBlock, ColorKey } from '@/types';
import { generateBlocksFromPattern, createEmptyGrid } from '@/utils/helpers';
import { playSuccessSound, playErrorSound, playCompleteSound } from '@/utils/sound';

interface UseGameLogicProps {
  level: Level;
  soundEnabled: boolean;
}

export const useGameLogic = ({ level, soundEnabled }: UseGameLogicProps) => {
  const [blocks, setBlocks] = useState<PixelBlock[]>([]);
  const [grid, setGrid] = useState<(ColorKey | null)[][]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hintCell, setHintCell] = useState<{ row: number; col: number } | null>(null);
  const [animatingCell, setAnimatingCell] = useState<{ row: number; col: number; type: 'success' | 'error' } | null>(null);
  
  const mistakesRef = useRef(0);

  const initGame = useCallback(() => {
    const newBlocks = generateBlocksFromPattern(level.pattern);
    const newGrid = createEmptyGrid(level.gridSize);
    setBlocks(newBlocks);
    setGrid(newGrid);
    setMistakes(0);
    mistakesRef.current = 0;
    setIsComplete(false);
    setHintCell(null);
    setAnimatingCell(null);
  }, [level]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const checkCompletion = useCallback((currentBlocks: PixelBlock[]) => {
    const allPlaced = currentBlocks.every(block => block.isPlaced);
    if (allPlaced) {
      setIsComplete(true);
      playCompleteSound(soundEnabled);
      return true;
    }
    return false;
  }, [soundEnabled]);

  const validateAndPlaceBlock = useCallback((blockId: string, row: number, col: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.isPlaced || isComplete) return false;

    const targetColor = level.pattern[row][col];
    
    if (targetColor === 'empty') {
      setAnimatingCell({ row, col, type: 'error' });
      setTimeout(() => setAnimatingCell(null), 400);
      playErrorSound(soundEnabled);
      setMistakes(prev => {
        const next = prev + 1;
        mistakesRef.current = next;
        return next;
      });
      return false;
    }

    if (block.targetRow === row && block.targetCol === col) {
      let completed = false;
      
      setBlocks(prev => {
        const updated = prev.map(b => 
          b.id === blockId ? { ...b, isPlaced: true } : b
        );
        
        setTimeout(() => {
          if (checkCompletion(updated)) {
            completed = true;
          }
        }, 300);
        
        return updated;
      });

      setGrid(prev => {
        const newGrid = prev.map(r => [...r]);
        newGrid[row][col] = block.color;
        return newGrid;
      });

      setAnimatingCell({ row, col, type: 'success' });
      setTimeout(() => setAnimatingCell(null), 300);
      playSuccessSound(soundEnabled);
      
      return true;
    } else {
      setAnimatingCell({ row, col, type: 'error' });
      setTimeout(() => setAnimatingCell(null), 400);
      playErrorSound(soundEnabled);
      setMistakes(prev => {
        const next = prev + 1;
        mistakesRef.current = next;
        return next;
      });
      return false;
    }
  }, [blocks, level.pattern, isComplete, soundEnabled, checkCompletion]);

  const showHint = useCallback(() => {
    const unplacedBlock = blocks.find(b => !b.isPlaced);
    if (unplacedBlock) {
      setHintCell({ row: unplacedBlock.targetRow, col: unplacedBlock.targetCol });
      setTimeout(() => setHintCell(null), 2000);
    }
  }, [blocks]);

  const remainingBlocks = blocks.filter(b => !b.isPlaced);
  const placedCount = blocks.filter(b => b.isPlaced).length;
  const totalBlocks = blocks.length;
  const progress = totalBlocks > 0 ? (placedCount / totalBlocks) * 100 : 0;

  return {
    blocks,
    grid,
    remainingBlocks,
    mistakes,
    mistakesRef,
    isComplete,
    hintCell,
    animatingCell,
    placedCount,
    totalBlocks,
    progress,
    validateAndPlaceBlock,
    showHint,
    resetGame: initGame,
  };
};
