import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GameCanvas } from './GameCanvas';
import { useGameStore } from '../store/gameStore';
import { useOrientation } from '../hooks/useOrientation';
import { useGameEngine } from '../hooks/useGameEngine';
import { getLevelById } from '../utils/levelData';

export const GamePage = () => {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  const { gravity, isUsingGyro, setUseGyro } = useOrientation();
  
  const {
    currentLevel,
    setCurrentLevel,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    isPlaying,
    isPaused,
    isGameOver,
    isVictory,
    time,
    bestTime,
  } = useGameStore();

  useGameEngine({ gravity });

  useEffect(() => {
    if (levelId) {
      const numLevel = parseInt(levelId, 10);
      if (!isNaN(numLevel)) {
        setCurrentLevel(numLevel);
      }
    }
  }, [levelId, setCurrentLevel]);

  const level = getLevelById(currentLevel);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${parseFloat(secs) < 10 ? '0' : ''}${secs}`;
  };

  const handleStart = () => {
    startGame();
  };

  const handlePause = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const handleReset = () => {
    resetGame();
  };

  const handleBack = () => {
    resetGame();
    navigate('/');
  };

  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (getLevelById(nextLevel)) {
      setCurrentLevel(nextLevel);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            ← 返回
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">
              关卡 {currentLevel}: {level?.name}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseGyro(!isUsingGyro)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  isUsingGyro
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {isUsingGyro ? '🎮 陀螺仪' : '🖱️ 鼠标'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="bg-white/10 rounded-xl px-6 py-3 text-center">
            <div className="text-gray-400 text-sm">当前时间</div>
            <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
          </div>
          <div className="bg-white/10 rounded-xl px-6 py-3 text-center">
            <div className="text-gray-400 text-sm">最佳时间</div>
            <div className="text-2xl font-bold text-yellow-400">
              {bestTime ? formatTime(bestTime) : '--'}
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <GameCanvas gravity={gravity} />
        </div>

        <div className="flex justify-center gap-4">
          {!isPlaying && !isGameOver && !isVictory && (
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              🚀 开始游戏
            </button>
          )}
          
          {isPlaying && (
            <button
              onClick={handlePause}
              className={`px-6 py-3 font-bold rounded-xl transition-all duration-300 hover:scale-105 ${
                isPaused
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
              }`}
            >
              {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
            </button>
          )}
          
          {(isPlaying || isGameOver || isVictory) && (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
            >
              🔄 重新开始
            </button>
          )}
        </div>

        {isGameOver && (
          <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">💀</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">小球掉落了！</h3>
            <p className="text-gray-300">再试一次吧，小心避开陷阱！</p>
          </div>
        )}

        {isVictory && (
          <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">恭喜过关！</h3>
            <p className="text-gray-300 mb-4">完成时间: {formatTime(time)}</p>
            {bestTime === time && time > 0 && (
              <div className="text-yellow-400 font-semibold mb-4">🏆 新纪录！</div>
            )}
            <button
              onClick={handleNextLevel}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
            >
              {getLevelById(currentLevel + 1) ? '→ 下一关' : '🏠 返回首页'}
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-gray-400 text-sm">
          {isUsingGyro ? (
            <p>📱 倾斜设备控制小球移动</p>
          ) : (
            <p>🖱️ 移动鼠标控制迷宫倾斜</p>
          )}
        </div>
      </div>
    </div>
  );
};