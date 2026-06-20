import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Check } from 'lucide-react';
import { levels } from '@/data/levels';
import { usePlayerStore } from '@/store/playerStore';
import CoinDisplay from '@/components/CoinDisplay';
import StarBackground from '@/components/StarBackground';

export default function MapPage() {
  const navigate = useNavigate();
  const unlockedLevels = usePlayerStore((state) => state.unlockedLevels);
  const completedLevels = usePlayerStore((state) => state.completedLevels);

  const getLevelStatus = (levelId: string) => {
    if (completedLevels.includes(levelId)) return 'completed';
    if (unlockedLevels.includes(levelId)) return 'unlocked';
    return 'locked';
  };

  const handleLevelClick = (levelId: string) => {
    const status = getLevelStatus(levelId);
    if (status === 'locked') return;
    navigate(`/quiz/${levelId}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarBackground />

      <div className="relative z-10">
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">返回</span>
          </button>
          <CoinDisplay size="md" />
        </div>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-gradient-gold text-shadow-glow"
            style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
          >
            🗺️ 冒险地图
          </h2>
          <p className="text-gray-300 mt-2">选择关卡开始你的知识探险吧！</p>
        </div>

        {/* 地图区域 */}
        <div className="relative w-full max-w-4xl mx-auto px-4" style={{ height: '500px' }}>
          {/* 路径连线 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {levels.slice(0, -1).map((level, index) => {
              const nextLevel = levels[index + 1];
              const isPathUnlocked = unlockedLevels.includes(nextLevel.id);
              return (
                <line
                  key={`path-${index}`}
                  x1={`${level.position.x}%`}
                  y1={`${level.position.y}%`}
                  x2={`${nextLevel.position.x}%`}
                  y2={`${nextLevel.position.y}%`}
                  stroke={isPathUnlocked ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)'}
                  strokeWidth="4"
                  strokeDasharray={isPathUnlocked ? '0' : '10,10'}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* 关卡节点 */}
          {levels.map((level, index) => {
            const status = getLevelStatus(level.id);
            return (
              <div
                key={level.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${level.position.x}%`,
                  top: `${level.position.y}%`,
                }}
              >
                {/* 关卡序号 */}
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold z-10 border-2 border-white">
                  {index + 1}
                </div>

                {/* 关卡节点 */}
                <button
                  onClick={() => handleLevelClick(level.id)}
                  disabled={status === 'locked'}
                  className={`level-node ${
                    status === 'completed'
                      ? 'level-completed'
                      : status === 'unlocked'
                      ? 'level-unlocked animate-pulse-slow'
                      : 'level-locked'
                  }`}
                >
                  {status === 'locked' ? (
                    <Lock size={28} className="text-gray-400" />
                  ) : status === 'completed' ? (
                    <div className="relative">
                      <span className="text-3xl">{level.emoji}</span>
                      <Check
                        size={20}
                        className="absolute -bottom-1 -right-1 text-white bg-green-500 rounded-full p-0.5"
                      />
                    </div>
                  ) : (
                    <span className="text-3xl">{level.emoji}</span>
                  )}
                </button>

                {/* 关卡名称 */}
                <div className="text-center mt-2">
                  <div
                    className={`font-bold text-sm ${
                      status === 'locked' ? 'text-gray-500' : 'text-white'
                    }`}
                  >
                    {level.name}
                  </div>
                  {status !== 'locked' && (
                    <div className="text-xs text-yellow-400 flex items-center justify-center gap-1">
                      <span>💰</span>
                      <span>{level.rewardGold}</span>
                    </div>
                  )}
                </div>

                {/* 悬浮提示卡 */}
                {status !== 'locked' && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-48 game-card p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <p className="text-xs text-gray-300">{level.description}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      共 {level.questionIds.length} 道题
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          已通关 {completedLevels.length} / {levels.length} 关
        </div>
      </div>
    </div>
  );
}
