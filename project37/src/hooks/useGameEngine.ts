import { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLevelById } from '../utils/levelData';
import { updateBall, checkWallCollision, checkGoalCollision, checkHoleCollision } from '../utils/physics';

interface UseGameEngineProps {
  gravity: { x: number; y: number };
}

export const useGameEngine = ({ gravity }: UseGameEngineProps) => {
  const {
    currentLevel,
    isPlaying,
    isPaused,
    ball,
    updateBall: setBall,
    updateTime,
    setVictory,
    setGameOver,
  } = useGameStore();

  const level = getLevelById(currentLevel);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const gameLoop = useCallback(() => {
    if (!isPlaying || isPaused || !level) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    updateTime(Math.round(elapsedTime * 100) / 100);

    let newBall = updateBall(ball, gravity);
    newBall = checkWallCollision(newBall, level.walls);

    if (checkGoalCollision(newBall, level.goal)) {
      setVictory();
      return;
    }

    if (checkHoleCollision(newBall, level.holes)) {
      setGameOver();
      return;
    }

    setBall(newBall);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, isPaused, level, ball, gravity, setBall, updateTime, setVictory, setGameOver]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isPaused, gameLoop]);
};