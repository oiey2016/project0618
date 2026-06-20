import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLevelById, getTotalLevels } from '@/data/levels';
import { useGameStore } from '@/store/useGameStore';
import { useTimer } from '@/hooks/useTimer';
import { useGameLogic } from '@/hooks/useGameLogic';
import { TargetPreview } from '@/components/game/TargetPreview';
import { PixelGrid } from '@/components/game/PixelGrid';
import { BlockTray } from '@/components/game/BlockTray';
import { GameStatus } from '@/components/game/GameStatus';
import { CompletionModal } from '@/components/CompletionModal';
import { Confetti } from '@/components/ui/Confetti';
import { calculateStars } from '@/utils/helpers';

const GamePage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { soundEnabled, completeLevel } = useGameStore();
  
  const level = getLevelById(Number(levelId));
  const timer = useTimer(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completionResult, setCompletionResult] = useState<{ stars: number; time: number } | null>(null);
  const hasCompletedRef = useRef(false);

  const gameLogic = useGameLogic({
    level: level!,
    soundEnabled,
  });

  useEffect(() => {
    if (!level) {
      navigate('/');
    }
  }, [level, navigate]);

  useEffect(() => {
    if (gameLogic.isComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      timer.stop();
      const stars = calculateStars(timer.time, gameLogic.mistakes);
      completeLevel(Number(levelId), stars, timer.time);
      setCompletionResult({ stars, time: timer.time });
      setShowConfetti(true);
    }
  }, [gameLogic.isComplete, gameLogic.mistakes, timer, completeLevel, levelId]);

  const handleDrop = useCallback((blockId: string, row: number, col: number) => {
    gameLogic.validateAndPlaceBlock(blockId, row, col);
  }, [gameLogic]);

  const handleReset = useCallback(() => {
    hasCompletedRef.current = false;
    gameLogic.resetGame();
    timer.restart();
    setCompletionResult(null);
    setShowConfetti(false);
  }, [gameLogic, timer]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleNextLevel = useCallback(() => {
    const nextLevelId = Number(levelId) + 1;
    if (nextLevelId <= getTotalLevels()) {
      navigate(`/game/${nextLevelId}`);
    } else {
      navigate('/');
    }
  }, [levelId, navigate]);

  const handleReplay = useCallback(() => {
    handleReset();
  }, [handleReset]);

  const handleHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">关卡不存在...</div>
      </div>
    );
  }

  const hasNextLevel = Number(levelId) < getTotalLevels();
  const cellSize = level.gridSize <= 8 ? 48 : level.gridSize <= 10 ? 42 : 36;
  const blockSize = level.gridSize <= 8 ? 44 : level.gridSize <= 10 ? 38 : 32;

  return (
    <div className="min-h-screen py-4 px-4">
      <Confetti active={showConfetti} pieces={80} />
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <GameStatus
            levelName={level.name}
            time={timer.time}
            mistakes={gameLogic.mistakes}
            progress={gameLogic.progress}
            onHint={gameLogic.showHint}
            onReset={handleReset}
            onBack={handleBack}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start justify-center">
          <div className="flex-shrink-0">
            <TargetPreview pattern={level.pattern} />
          </div>

          <div className="flex-1 flex flex-col items-center gap-4 w-full">
            <div className="flex justify-center">
              <PixelGrid
                gridSize={level.gridSize}
                pattern={level.pattern}
                filledGrid={gameLogic.grid}
                hintCell={gameLogic.hintCell}
                animatingCell={gameLogic.animatingCell}
                onDrop={handleDrop}
                cellSize={cellSize}
              />
            </div>

            <div className="w-full max-w-xl">
              <BlockTray
                blocks={gameLogic.remainingBlocks}
                blockSize={blockSize}
              />
            </div>
          </div>
        </div>
      </div>

      <CompletionModal
        isOpen={!!completionResult && !showConfetti}
        levelName={level.name}
        stars={completionResult?.stars || calculateStars(timer.time, gameLogic.mistakes)}
        time={completionResult?.time || timer.time}
        mistakes={gameLogic.mistakes}
        pattern={level.pattern}
        onNextLevel={handleNextLevel}
        onReplay={handleReplay}
        onHome={handleHome}
        hasNextLevel={hasNextLevel}
      />

      {showConfetti && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30" onClick={() => setShowConfetti(false)}>
          <div className="text-center animate-pop" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-2 pixel-glow">完成啦！</h2>
            <p className="text-white text-xl">点击任意位置查看结果</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
