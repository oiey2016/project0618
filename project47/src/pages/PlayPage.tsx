import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pause, Play, Home, RotateCcw, Volume2, Library } from 'lucide-react';
import { GameEngine, type GameStats } from '@/engine/GameEngine';
import { getSongById } from '@/data/songs';
import { useSaveStore } from '@/store/saveStore';
import { calculateRank, getMaxScore } from '@/utils/saveManager';
import type { JudgeType, StorySegment, ScenePhase } from '@/types';
import { clsx } from 'clsx';
import { audioEngine } from '@/audio/AudioEngine';

const KEY_MAP: Record<string, number> = {
  d: 0, D: 0,
  f: 1, F: 1,
  g: 2, G: 2,
  h: 3, H: 3,
  j: 4, J: 4,
  k: 5, K: 5,
};

const SCENE_CLASS: Record<ScenePhase, string> = {
  dawn: 'scene-dawn',
  noon: 'scene-noon',
  dusk: 'scene-dusk',
  night: 'scene-night',
};

export default function PlayPage() {
  const navigate = useNavigate();
  const { songId = '' } = useParams();
  const song = getSongById(songId);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const touchKeyRef = useRef<Map<number, number>>(new Map());

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    judges: { perfect: 0, great: 0, good: 0, miss: 0 },
    progress: 0,
  });
  const [scenePhase, setScenePhase] = useState<ScenePhase>('dawn');
  const [paused, setPaused] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [currentStory, setCurrentStory] = useState<StorySegment | null>(null);
  const [storyAlpha, setStoryAlpha] = useState(0);
  const storyTimeoutRef = useRef<number | null>(null);

  const completeSong = useSaveStore((s) => s.completeSong);
  const unlockNextSong = useSaveStore((s) => s.unlockNextSong);
  const addPlayTime = useSaveStore((s) => s.addPlayTime);
  const noteSpeed = useSaveStore((s) => s.saveData.settings.noteSpeed);
  const volume = useSaveStore((s) => s.saveData.settings.volume);
  const updateSettings = useSaveStore((s) => s.updateSettings);

  const handleStatsUpdate = useCallback((newStats: GameStats) => {
    setStats(newStats);
  }, []);

  const handleJudge = useCallback(
    (type: JudgeType, x: number, y: number) => {
      engineRef.current?.addJudgeDisplay(type, x, y);
    },
    [],
  );

  const handleStory = useCallback((segment: StorySegment | null) => {
    setCurrentStory(segment);
    if (storyTimeoutRef.current) {
      cancelAnimationFrame(storyTimeoutRef.current);
      storyTimeoutRef.current = null;
    }

    if (segment) {
      const start = performance.now();
      const animateIn = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(1, elapsed / 600);
        setStoryAlpha(t * (2 - t));
        if (t < 1) {
          storyTimeoutRef.current = requestAnimationFrame(animateIn);
        }
      };
      storyTimeoutRef.current = requestAnimationFrame(animateIn);
    } else {
      const start = performance.now();
      const startAlpha = 0;
      setStoryAlpha((prev) => {
        const animateOut = () => {
          const elapsed = performance.now() - start;
          const t = Math.min(1, elapsed / 500);
          setStoryAlpha(Math.max(0, startAlpha + (prev - startAlpha) * (1 - t)));
          if (t < 1 && prev > 0) {
            storyTimeoutRef.current = requestAnimationFrame(animateOut);
          } else {
            setStoryAlpha(0);
          }
        };
        storyTimeoutRef.current = requestAnimationFrame(animateOut);
        return prev;
      });
    }
  }, []);

  const handleSceneChange = useCallback((phase: ScenePhase) => {
    setScenePhase(phase);
  }, []);

  const handleComplete = useCallback(() => {
    if (!song || !engineRef.current) return;
    const finalStats = engineRef.current.getStats();
    const maxScore = getMaxScore(song.notes.length);
    const rank = calculateRank(finalStats.score, maxScore);
    if (rank) {
      completeSong(song.id, finalStats.score, rank);
      unlockNextSong(song.id);
      addPlayTime(song.duration);
    }
    setTimeout(() => {
      navigate(`/result/${song.id}`);
    }, 1500);
  }, [song, completeSong, unlockNextSong, addPlayTime, navigate]);

  useEffect(() => {
    if (!song || !canvasRef.current) return;

    const engine = new GameEngine(
      canvasRef.current,
      song,
      {
        onStatsUpdate: handleStatsUpdate,
        onJudge: handleJudge,
        onStory: handleStory,
        onComplete: handleComplete,
        onScenePhaseChange: handleSceneChange,
      },
      noteSpeed,
    );
    engineRef.current = engine;

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const keyIdx = KEY_MAP[e.key];
      if (keyIdx !== undefined) {
        e.preventDefault();
        engine.pressKey(keyIdx);
      }
      if (e.key === 'Escape') {
        setPaused((p) => {
          const np = !p;
          if (np) engine.pause();
          else engine.resume();
          return np;
        });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const keyIdx = KEY_MAP[e.key];
      if (keyIdx !== undefined) {
        e.preventDefault();
        engine.releaseKey(keyIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    setTimeout(() => {
      setShowCountdown(false);
    }, 3000);

    engine.start();

    return () => {
      engine.stop();
      audioEngine.stopAll();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (storyTimeoutRef.current) cancelAnimationFrame(storyTimeoutRef.current);
    };
  }, [song, noteSpeed, handleStatsUpdate, handleJudge, handleStory, handleComplete, handleSceneChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!engineRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const width = rect.width;
    const laneWidth = width / 6;

    for (const touch of Array.from(e.changedTouches)) {
      const x = touch.clientX - rect.left;
      const keyIdx = Math.max(0, Math.min(5, Math.floor(x / laneWidth)));
      touchKeyRef.current.set(touch.identifier, keyIdx);
      engineRef.current.pressKey(keyIdx);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!engineRef.current) return;
    for (const touch of Array.from(e.changedTouches)) {
      const keyIdx = touchKeyRef.current.get(touch.identifier);
      if (keyIdx !== undefined) {
        engineRef.current.releaseKey(keyIdx);
        touchKeyRef.current.delete(touch.identifier);
      }
    }
  };

  const togglePause = () => {
    if (!engineRef.current) return;
    setPaused((p) => {
      const np = !p;
      if (np) engineRef.current!.pause();
      else engineRef.current!.resume();
      return np;
    });
  };

  if (!song) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-forest-600">曲目不存在</p>
      </div>
    );
  }

  const comboVisible = stats.combo >= 5;

  return (
    <div
      className={clsx(
        'relative w-full h-full overflow-hidden transition-all duration-[2000ms] ease-in-out',
        SCENE_CLASS[scenePhase],
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />

      <div className="grain-overlay opacity-60 pointer-events-none" />

      <div className="relative z-20 pointer-events-none">
        <header className="flex items-start justify-between px-5 md:px-8 pt-5 md:pt-6">
          <div className="glass-card rounded-2xl px-4 py-3 md:px-5 md:py-3.5 pointer-events-auto backdrop-blur-md">
            <p className="font-serif-sc text-xs md:text-sm text-warm-600 tracking-wide">
              {song.storyTitle}
            </p>
            <h2 className="font-serif-sc font-bold text-forest-800 text-lg md:text-xl mt-0.5">
              {song.title}
            </h2>
          </div>

          <div className="glass-card rounded-2xl px-5 py-3 md:px-6 md:py-3.5 pointer-events-auto backdrop-blur-md text-center min-w-[120px] md:min-w-[150px]">
            <p className="text-[10px] md:text-xs text-forest-500 tracking-widest uppercase">
              Score
            </p>
            <p className="font-serif-sc font-bold text-shimmer text-2xl md:text-3xl leading-none mt-1">
              {stats.score.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => {
                const newVol = volume > 0 ? 0 : 0.8;
                audioEngine.setVolume(newVol);
                updateSettings({ volume: newVol });
              }}
              className={clsx(
                'w-10 h-10 md:w-11 md:h-11 rounded-xl glass-card flex items-center justify-center transition-all backdrop-blur-md',
                volume > 0
                  ? 'text-forest-600 hover:bg-white/80'
                  : 'text-rose-400 hover:bg-rose-50/50 bg-rose-50/30',
              )}
            >
              <Volume2 className={clsx('w-4 h-4 md:w-5 md:h-5', volume === 0 && 'line-through')} />
            </button>
            <button
              onClick={togglePause}
              className="w-10 h-10 md:w-11 md:h-11 rounded-xl glass-card flex items-center justify-center text-forest-600 hover:bg-white/80 transition-all backdrop-blur-md"
            >
              {paused ? (
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              ) : (
                <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              )}
            </button>
          </div>
        </header>

        <div className="absolute left-0 right-0 top-20 md:top-24 px-6 md:px-10">
          <div className="h-1.5 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-warm-400 via-warm-500 to-note-glow shadow-glow-soft transition-all duration-300 rounded-full relative"
              style={{ width: `${stats.progress * 100}%` }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md"
              />
            </div>
          </div>
        </div>

        {comboVisible && (
          <div
            className={clsx(
              'absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none',
              scenePhase === 'night' ? 'top-28 md:top-32' : 'top-28 md:top-32',
            )}
          >
            <div
              className={clsx(
                'text-center transition-all duration-150',
                stats.combo >= 30 ? 'scale-110' : stats.combo >= 15 ? 'scale-105' : 'scale-100',
              )}
            >
              <p
                className={clsx(
                  'font-serif-sc font-black tracking-wider text-5xl md:text-7xl drop-shadow-lg',
                  stats.combo >= 50
                    ? 'text-yellow-300'
                    : stats.combo >= 30
                      ? 'text-warm-400'
                      : scenePhase === 'night'
                        ? 'text-white/90'
                        : 'text-warm-600',
                )}
                style={{ textShadow: stats.combo >= 30 ? '0 0 25px rgba(255,179,71,0.7)' : 'none' }}
              >
                {stats.combo}
              </p>
              <p
                className={clsx(
                  'text-xs md:text-sm tracking-[0.3em] font-bold uppercase mt-1',
                  scenePhase === 'night' ? 'text-white/70' : 'text-forest-500/80',
                )}
              >
                Combo
              </p>
            </div>
          </div>
        )}
      </div>

      {currentStory && storyAlpha > 0 && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center px-8 pointer-events-none"
          style={{
            background:
              scenePhase === 'night'
                ? `rgba(15, 12, 41, ${0.55 * storyAlpha})`
                : `rgba(255, 251, 242, ${0.45 * storyAlpha})`,
            backdropFilter: `blur(${4 * storyAlpha}px)`,
          }}
        >
          <p
            className={clsx(
              'font-serif-sc text-center text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-loose max-w-3xl font-medium',
              scenePhase === 'night' ? 'text-warm-100' : 'text-forest-800',
            )}
            style={{
              opacity: storyAlpha,
              textShadow:
                scenePhase === 'night'
                  ? '0 4px 30px rgba(0,0,0,0.6)'
                  : '0 4px 20px rgba(255,255,255,0.8)',
            }}
          >
            {currentStory.text}
          </p>
        </div>
      )}

      {paused && (
        <div className="absolute inset-0 z-40 bg-forest-900/60 backdrop-blur-md flex items-center justify-center px-6">
          <div className="glass-card rounded-3xl p-8 md:p-10 max-w-sm w-full text-center">
            <h3 className="font-serif-sc text-2xl md:text-3xl font-bold text-forest-800 mb-2">
              已暂停
            </h3>
            <p className="text-forest-500 mb-8 text-sm md:text-base">
              调整呼吸，准备好再继续吧
            </p>

            <div className="space-y-3">
              <button
                onClick={togglePause}
                className="w-full btn-warm flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                继续演奏
              </button>
              <button
                onClick={() => navigate(0)}
                className="w-full btn-ghost flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重新演奏
              </button>
              <button
                onClick={() => navigate('/select')}
                className="w-full btn-ghost flex items-center justify-center gap-2 text-dusk-600/80 hover:text-dusk-700"
              >
                <Library className="w-4 h-4" />
                返回曲目列表
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full btn-ghost flex items-center justify-center gap-2 text-rose-500/80 hover:text-rose-500"
              >
                <Home className="w-4 h-4" />
                返回开始页面
              </button>
            </div>
          </div>
        </div>
      )}

      {showCountdown && (
        <div className="absolute bottom-36 md:bottom-44 left-0 right-0 z-10 text-center pointer-events-none">
          <p className="font-serif-sc text-forest-600/70 text-sm md:text-base animate-fade-in">
            键盘 D / F / G / H / J / K · 或触摸琴键
          </p>
        </div>
      )}
    </div>
  );
}
