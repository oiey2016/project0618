import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pause, Play, RotateCcw } from 'lucide-react';
import { getSongById } from '@/data/songs';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useKeyboardInput, useTouchInput } from '@/hooks/useInput';
import { GameTrack } from '@/components/GameTrack';
import { StatusBar } from '@/components/StatusBar';
import { useGameStore } from '@/store/gameStore';
import { audioSystem } from '@/utils/audio';

function GamePage() {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();
  const song = getSongById(songId ?? '');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const { isPaused } = useGameStore();

  const {
    renderNotes,
    judgments,
    gameEnded,
    currentTime,
    startGame,
    restartGame,
    pauseGame,
    stopGame,
    handleHit,
  } = useGameEngine(song!);

  const handleTrackPress = useCallback(
    (track: number) => {
      if (!isStarted || isPaused || gameEnded) return;
      handleHit(track);
    },
    [isStarted, isPaused, gameEnded, handleHit]
  );

  const { pressedTracks } = useKeyboardInput({
    onTrackPress: handleTrackPress,
    onEscape: () => {
      if (isStarted) pauseGame();
    },
  });

  const { handleTouchStart, handleTouchEnd } = useTouchInput({
    onTrackPress: handleTrackPress,
  });

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(rect.height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const startWithCountdown = async () => {
    await audioSystem.init();
    setCountdown(3);
    setTimeout(() => setCountdown(2), 800);
    setTimeout(() => setCountdown(1), 1600);
    setTimeout(() => {
      setCountdown(null);
      setIsStarted(true);
      startGame();
    }, 2400);
  };

  const startImmediately = async () => {
    await audioSystem.init();
    setCountdown(null);
    setIsStarted(true);
    startGame();
  };

  useEffect(() => {
    startWithCountdown();

    return () => {
      stopGame();
    };
  }, []);

  const handleQuit = () => {
    stopGame();
    navigate('/');
  };

  const handleRestart = () => {
    setIsStarted(true);
    restartGame();
  };

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">歌曲未找到</p>
          <Link to="/" className="cute-btn-primary inline-block">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleQuit}
            className="glass-btn px-4 py-2 flex items-center gap-2 font-display font-bold text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            退出
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={isStarted ? pauseGame : handleRestart}
              className="glass-btn px-4 py-2 flex items-center gap-2 font-display font-bold text-gray-700"
            >
              {isStarted ? (
                <>
                  <Pause className="w-5 h-5" />
                  暂停
                </>
              ) : (
                <>
                  <RotateCcw className="w-5 h-5" />
                  重来
                </>
              )}
            </button>
          </div>
        </div>

        <StatusBar
          songTitle={song.title}
          currentTime={currentTime}
          duration={song.duration}
        />

        <div ref={containerRef} className="relative w-full" style={{ height: '65vh', minHeight: '500px' }}>
          <GameTrack
            renderNotes={renderNotes}
            judgments={judgments}
            pressedTracks={pressedTracks}
            onTrackPress={handleTrackPress}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            containerHeight={containerHeight}
          />

          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-3xl z-30">
              <div className="text-center">
                <div
                  key={countdown}
                  className="font-display font-black text-9xl text-white animate-pop"
                  style={{
                    textShadow: '0 0 40px rgba(244, 114, 182, 0.8)',
                  }}
                >
                  {countdown}
                </div>
                <p className="text-white text-2xl font-display mt-4 opacity-80">
                  准备好了吗？
                </p>
              </div>
            </div>
          )}

          {isPaused && isStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-3xl z-30 animate-fade-in">
              <div className="glass-card p-8 text-center max-w-sm">
                <Pause className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h3 className="font-display font-bold text-3xl text-gray-800 mb-6">
                  游戏暂停
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleRestart}
                    className="w-full cute-btn-secondary flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    重新开始
                  </button>
                  <button
                    onClick={handleQuit}
                    className="w-full cute-btn-primary flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    返回首页
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl z-30 animate-fade-in">
              <div className="text-center">
                <div className="font-display font-black text-6xl md:text-8xl text-white animate-bounce-slow mb-4">
                  🎉
                </div>
                <p className="text-white text-2xl font-display">歌曲完成！</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 glass-card p-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {['D', 'F', 'J', 'K'].map((key, i) => {
              const colors = [
                'from-pink-400 to-rose-500',
                'from-purple-400 to-violet-500',
                'from-cyan-400 to-sky-500',
                'from-emerald-400 to-green-500',
              ];
              const isPressed = pressedTracks.has(i);
              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      font-display font-black text-lg transition-all duration-100
                      ${isPressed ? 'scale-110 text-white' : 'text-gray-600 bg-white/50'}
                    `}
                    style={{
                      background: isPressed
                        ? `linear-gradient(135deg, var(--tw-gradient-stops))`
                        : undefined,
                    }}
                  >
                    <div className={`w-full h-full rounded-xl flex items-center justify-center ${isPressed ? `bg-gradient-to-br ${colors[i]}` : ''}`}>
                      {key}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
