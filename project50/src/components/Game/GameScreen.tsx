import { useEffect, useRef, useCallback, useState } from 'react';
import { Pause, Heart } from 'lucide-react';
import { GameRenderer } from '@/game/renderer';
import { useGameStore } from '@/store/gameStore';
import { useGyroscope, requestGyroscopePermission } from '@/hooks/useGyroscope';
import { useAudio } from '@/hooks/useAudio';
import { getAngleFromPoint, normalizeAngle } from '@/utils/math';
import { demoSong } from '@/data/songs';
import { loadSettings } from '@/utils/storage';
import { audioManager } from '@/utils/audioManager';

interface GameScreenProps {
  onPause: () => void;
  onEnd: () => void;
}

export default function GameScreen({ onPause, onEnd }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isDragging = useRef(false);
  const gameEndedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const initializedRef = useRef(false);
  const lastHitEffectCountRef = useRef(0);

  const status = useGameStore(state => state.status);
  const score = useGameStore(state => state.score);
  const combo = useGameStore(state => state.combo);
  const health = useGameStore(state => state.health);
  const maxHealth = useGameStore(state => state.maxHealth);
  const currentTime = useGameStore(state => state.currentTime);
  const songDuration = useGameStore(state => state.songDuration);

  const setSong = useGameStore(state => state.setSong);
  const startGame = useGameStore(state => state.startGame);
  const pauseGame = useGameStore(state => state.pauseGame);
  const resumeGame = useGameStore(state => state.resumeGame);
  const endGame = useGameStore(state => state.endGame);
  const setPointerAngle = useGameStore(state => state.setPointerAngle);
  const update = useGameStore(state => state.update);
  const checkHit = useGameStore(state => state.checkHit);

  const { angle: gyroAngle, isSupported, calibrate } = useGyroscope({
    enabled: status === 'playing',
  });

  const savedSettings = loadSettings();
  const { playHitSound, stopMetronome, startBackgroundMusic, stopBackgroundMusic, pauseBackgroundMusic, resumeBackgroundMusic, setMusicVolume, setSfxVolume } = useAudio({
    musicVolume: savedSettings.musicVolume,
    sfxVolume: savedSettings.sfxVolume,
  });

  useEffect(() => {
    setMusicVolume(savedSettings.musicVolume);
    setSfxVolume(savedSettings.sfxVolume);
  }, [savedSettings.musicVolume, savedSettings.sfxVolume, setMusicVolume, setSfxVolume]);

  const renderFrame = useCallback(() => {
    if (!rendererRef.current) return;

    const state = useGameStore.getState();
    rendererRef.current.render(
      state.pointerAngle,
      state.notes,
      state.hitEffects,
      state.particles,
      0
    );
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = timestamp;

    update(deltaTime);

    const state = useGameStore.getState();
    const currentEffectCount = state.hitEffects.length;
    if (currentEffectCount > lastHitEffectCountRef.current) {
      for (let i = lastHitEffectCountRef.current; i < currentEffectCount; i++) {
        const effect = state.hitEffects[i];
        if (effect && effect.type) {
          playHitSound(effect.type as 'perfect' | 'great' | 'good' | 'miss');
        }
      }
      lastHitEffectCountRef.current = currentEffectCount;
    }

    if (rendererRef.current) {
      rendererRef.current.render(
        state.pointerAngle,
        state.notes,
        state.hitEffects,
        state.particles,
        deltaTime
      );
    }

    if (isPlayingRef.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [update, playHitSound]);

  const startGameLoop = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    lastTimeRef.current = 0;
    gameEndedRef.current = false;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const stopGameLoop = useCallback(() => {
    isPlayingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);

  const beginGame = useCallback(() => {
    audioManager.ensureContext();
    setSong(demoSong);
    startGame();
    startGameLoop();
    lastHitEffectCountRef.current = 0;
    startBackgroundMusic();
  }, [setSong, startGame, startGameLoop, startBackgroundMusic]);

  const initGame = useCallback(async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let hasGyro = false;
    if (isSupported) {
      try {
        hasGyro = await requestGyroscopePermission();
      } catch {
        hasGyro = false;
      }
    }

    if (hasGyro) {
      calibrate();
      beginGame();
    } else {
      beginGame();
    }
  }, [isSupported, calibrate, beginGame]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new GameRenderer({ canvas: canvasRef.current });
    rendererRef.current = renderer;

    renderFrame();

    const handleResize = () => {
      renderer.resize();
      renderFrame();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      stopGameLoop();
      stopMetronome();
    };
  }, [renderFrame, stopGameLoop, stopMetronome]);

  useEffect(() => {
    if (rendererRef.current) {
      initGame();
    }
  }, [initGame]);

  useEffect(() => {
    if (status === 'playing') {
      if (!isPlayingRef.current) {
        startGameLoop();
      }
      resumeBackgroundMusic();
    } else if (status === 'paused') {
      if (isPlayingRef.current) {
        stopGameLoop();
        renderFrame();
      }
      pauseBackgroundMusic();
    } else {
      if (isPlayingRef.current) {
        stopGameLoop();
        renderFrame();
      }
    }
  }, [status, startGameLoop, stopGameLoop, renderFrame, pauseBackgroundMusic, resumeBackgroundMusic]);

  useEffect(() => {
    if (status === 'playing') {
      setPointerAngle(gyroAngle);
    }
  }, [gyroAngle, status, setPointerAngle]);

  useEffect(() => {
    if (status === 'ended' && !gameEndedRef.current) {
      gameEndedRef.current = true;
      stopMetronome();
      stopBackgroundMusic();
      setTimeout(onEnd, 1500);
    }
  }, [status, onEnd, stopMetronome, stopBackgroundMusic]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!canvasRef.current || !rendererRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const { x: cx, y: cy } = rendererRef.current.getCenter();

    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const angle = getAngleFromPoint(cx, cy, px, py);
    setPointerAngle(normalizeAngle(angle));

    if (!isPlayingRef.current) {
      renderFrame();
    }
  }, [setPointerAngle, renderFrame]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!canvasRef.current || !rendererRef.current) return;

    audioManager.activateInGesture();
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const rect = canvasRef.current.getBoundingClientRect();
    const { x: cx, y: cy } = rendererRef.current.getCenter();

    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const angle = getAngleFromPoint(cx, cy, px, py);
    setPointerAngle(normalizeAngle(angle));

    if (status === 'playing') {
      checkHit();
    }
  }, [status, setPointerAngle, checkHit]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }, []);

  const handlePause = () => {
    if (status === 'playing') {
      pauseGame();
    } else if (status === 'paused') {
      resumeGame();
    }
    onPause();
  };

  const progress = songDuration > 0 ? (currentTime / songDuration) * 100 : 0;
  const healthPercent = (health / maxHealth) * 100;

  return (
    <div className="fixed inset-0 bg-game-bg">
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="glass-card px-4 py-2 pointer-events-auto">
            <div className="text-xs text-white/50 mb-0.5">得分</div>
            <div className="text-2xl font-light text-white glow-text">
              {score.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handlePause}
            className="glass-card p-3 pointer-events-auto hover:bg-white/10 transition-colors"
          >
            <Pause size={20} className="text-white/70" />
          </button>
        </div>

        {combo > 0 && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center">
            <div className="text-5xl font-extralight text-white glow-text">
              {combo}
            </div>
            <div className="text-xs text-primary-light/70 tracking-widest">COMBO</div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={14} className="text-accent-pink" />
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${healthPercent}%`,
                  background: healthPercent > 50
                    ? 'linear-gradient(90deg, #81C784, #4FC3F7)'
                    : healthPercent > 25
                    ? 'linear-gradient(90deg, #FFD54F, #FFB74D)'
                    : 'linear-gradient(90deg, #F48FB1, #E57373)',
                  boxShadow: healthPercent > 50
                    ? '0 0 10px rgba(129, 199, 132, 0.5)'
                    : '0 0 10px rgba(244, 143, 177, 0.5)',
                }}
              />
            </div>
          </div>

          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(songDuration)}</span>
          </div>
        </div>
      </div>

      {status === 'paused' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="glass-card p-8 text-center">
            <div className="text-2xl font-light text-white mb-6">游戏暂停</div>
            <div className="flex flex-col gap-3">
              <button onClick={handlePause} className="glass-button py-3 px-8">
                继续游戏
              </button>
              <button
                onClick={endGame}
                className="glass-button py-3 px-8 bg-white/5 border-white/10"
              >
                结束游戏
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
