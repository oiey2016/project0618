import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Trophy, XCircle, Home, RotateCcw, ShoppingBag } from 'lucide-react';
import { getLevelById } from '@/data/levels';
import { useGameStore } from '@/store/gameStore';
import StarBackground from '@/components/StarBackground';
import CoinDisplay from '@/components/CoinDisplay';
import { useEffect } from 'react';

export default function ResultPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const level = levelId ? getLevelById(levelId) : undefined;
  const { correctCount, totalQuestions, earnedGold, resetQuiz } = useGameStore();

  const passed = searchParams.get('passed') === 'true';
  const totalEarned = parseInt(searchParams.get('earned') || '0');

  useEffect(() => {
    return () => {
      resetQuiz();
    };
  }, []);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>关卡不存在</p>
      </div>
    );
  }

  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <StarBackground />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="game-card text-center animate-pop">
          {/* 结果图标 */}
          <div className="mb-6">
            {passed ? (
              <div className="text-8xl animate-bounce-slow">🎉</div>
            ) : (
              <div className="text-8xl">😢</div>
            )}
          </div>

          {/* 标题 */}
          <h2
            className={`text-4xl font-bold mb-2 ${
              passed ? 'text-yellow-400' : 'text-gray-400'
            }`}
            style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
          >
            {passed ? '恭喜通关！' : '挑战失败'}
          </h2>

          <p className="text-gray-300 mb-8">
            {level.emoji} {level.name}
          </p>

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">{correctCount}</div>
              <div className="text-sm text-gray-400">答对题数</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">{accuracy}%</div>
              <div className="text-sm text-gray-400">正确率</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-yellow-400">💰</div>
              <div className="text-sm text-yellow-400">{totalEarned} 金币</div>
            </div>
          </div>

          {/* 通关奖励 */}
          {passed && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 mb-8 border border-yellow-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="text-yellow-400" size={24} />
                <span className="font-bold text-yellow-400">通关奖励</span>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span>💰 {level.rewardGold} 金币</span>
                <span>⭐ {level.rewardExp} 经验</span>
              </div>
            </div>
          )}

          {/* 失败提示 */}
          {!passed && (
            <div className="bg-red-500/10 rounded-xl p-4 mb-8 border border-red-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="text-red-400" size={24} />
                <span className="font-bold text-red-400">再接再厉</span>
              </div>
              <p className="text-sm text-gray-300">
                需要答对 60% 以上的题目才能通关哦，再试一次吧！
              </p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="space-y-3">
            {passed && (
              <button
                onClick={() => navigate('/map')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Home size={20} />
                返回地图
              </button>
            )}
            {!passed && (
              <button
                onClick={() => navigate(`/quiz/${levelId}`)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                再试一次
              </button>
            )}
            <button
              onClick={() => navigate('/shop')}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              去商店看看
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors"
            >
              返回主菜单
            </button>
          </div>
        </div>

        {/* 当前金币 */}
        <div className="flex justify-center mt-6">
          <CoinDisplay size="md" />
        </div>
      </div>
    </div>
  );
}
