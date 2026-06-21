import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { levels } from '../utils/levelData';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'hard':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return '未知';
  }
};

export const HomePage = () => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  const handleLevelSelect = (levelId: number) => {
    navigate(`/game/${levelId}`);
  };

  const getBestTime = (levelId: number): string => {
    const stored = localStorage.getItem(`best_time_${levelId}`);
    if (!stored) return '--';
    const time = parseFloat(stored);
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(2);
    return `${minutes}:${parseFloat(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wider">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            摇摇晃晃
          </span>
        </h1>
        <p className="text-lg text-gray-300">
          控制小球穿越迷宫，到达终点！
        </p>
        <button
          onClick={() => setShowHelp(true)}
          className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 border border-white/30 hover:border-white/50 flex items-center gap-2 mx-auto"
        >
          <span className="text-xl">❓</span>
          <span>玩法说明</span>
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">选择关卡</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level.id)}
              className="group bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-xl p-5 text-left transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-bold text-yellow-400">{level.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(level.difficulty)}`}>
                  {getDifficultyText(level.difficulty)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{level.name}</h3>
              <div className="flex items-center text-gray-400 text-sm">
                <span className="mr-2">🏆</span>
                <span>最佳时间: {getBestTime(level.id)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 玩法说明弹窗 */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">📖</span>
                <span>游戏玩法</span>
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-gray-300">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-yellow-400">🎯</span>
                  <span>游戏目标</span>
                </h3>
                <p className="text-sm">引导金色小球安全到达绿色终点区域，同时避开红色陷阱和障碍物。</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-green-400">🖱️</span>
                  <span>桌面端操作</span>
                </h3>
                <p className="text-sm">移动鼠标控制迷宫倾斜方向，鼠标位置决定了重力方向。屏幕中央为零点。</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-blue-400">📱</span>
                  <span>移动端操作</span>
                </h3>
                <p className="text-sm">倾斜你的设备，陀螺仪会检测设备角度并转化为重力方向，操控小球移动。</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-pink-400">⭐</span>
                  <span>游戏元素</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600"></span>
                    <span>金色小球（你的角色）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600"></span>
                    <span>绿色终点（到达获胜）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></span>
                    <span>紫色墙壁（阻挡物）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-800"></span>
                    <span>红色陷阱（危险！避开）</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-purple-400">🏆</span>
                  <span>挑战目标</span>
                </h3>
                <p className="text-sm">尽量用最短时间完成每个关卡，打破你的最佳记录！最佳成绩会自动保存。</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300"
            >
              开始游戏 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};