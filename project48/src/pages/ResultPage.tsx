import { Link, useNavigate } from 'react-router-dom';
import { Home, RotateCcw, Star, Zap, Target, Trophy, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { Grade } from '@/types/game';

const gradeConfig: Record<Grade, { bg: string; text: string; glow: string; message: string }> = {
  S: {
    bg: 'from-yellow-300 via-amber-400 to-orange-500',
    text: 'S',
    glow: 'rgba(251, 191, 36, 0.6)',
    message: '完美表现！你就是节奏大师！✨',
  },
  A: {
    bg: 'from-pink-400 via-rose-500 to-red-500',
    text: 'A',
    glow: 'rgba(244, 114, 182, 0.6)',
    message: '太棒了！继续保持！🎉',
  },
  B: {
    bg: 'from-purple-400 via-violet-500 to-indigo-500',
    text: 'B',
    glow: 'rgba(192, 132, 252, 0.6)',
    message: '不错的成绩！再挑战一下！💪',
  },
  C: {
    bg: 'from-cyan-400 via-sky-500 to-blue-500',
    text: 'C',
    glow: 'rgba(56, 189, 248, 0.6)',
    message: '及格啦！多加练习会更好！🎯',
  },
  D: {
    bg: 'from-gray-400 via-slate-500 to-gray-600',
    text: 'D',
    glow: 'rgba(156, 163, 175, 0.6)',
    message: '别灰心！再来一次试试！🐱',
  },
};

function ResultPage() {
  const navigate = useNavigate();
  const { result, resetGame } = useGameStore();

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">还没有游戏记录哦~</p>
          <Link to="/" className="cute-btn-primary inline-block">
            返回首页开始游戏
          </Link>
        </div>
      </div>
    );
  }

  const grade = gradeConfig[result.grade];
  const totalNotes = result.perfect + result.great + result.good + result.miss;

  const handleRestart = () => {
    resetGame();
    navigate(`/game/${result.song.id}`);
  };

  const handleHome = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 md:py-12">
      <div className="paw-decoration top-8 left-12 animate-float">⭐</div>
      <div className="paw-decoration top-16 right-16 animate-float" style={{ animationDelay: '0.5s' }}>🌟</div>
      <div className="paw-decoration bottom-24 left-8 animate-float" style={{ animationDelay: '1s' }}>✨</div>

      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display font-black text-4xl md:text-5xl mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            演奏完成！
          </h1>
          <p className="text-gray-600 font-display">{result.song.title} · {result.song.subtitle}</p>
        </div>

        <div className="glass-card p-8 mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col items-center mb-8">
            <div
              className={`
                relative w-40 h-40 md:w-48 md:h-48 rounded-full
                bg-gradient-to-br ${grade.bg}
                flex items-center justify-center
                shadow-2xl animate-bounce-slow
              `}
              style={{
                boxShadow: `0 0 60px ${grade.glow}`,
              }}
            >
              <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="font-display font-black text-7xl md:text-8xl text-white drop-shadow-2xl">
                  {grade.text}
                </span>
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <p className="mt-6 font-display font-bold text-xl text-gray-700 text-center">
              {grade.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">总分</span>
              </div>
              <p className="font-display font-black text-4xl bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {result.score.toLocaleString()}
              </p>
            </div>

            <div className="glass-card p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-cyan-500" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">准确率</span>
              </div>
              <p className="font-display font-black text-4xl bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
                {result.accuracy}%
              </p>
            </div>
          </div>

          <div className="glass-card p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-pink-500 fill-pink-500" />
                <span className="font-display font-bold text-gray-700">最高连击</span>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-3xl text-pink-500">
                  {result.maxCombo}
                </span>
                <span className="text-gray-400 text-sm ml-1">Combo</span>
              </div>
            </div>
            <div className="mt-4 w-full h-3 rounded-full bg-white/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 transition-all duration-1000"
                style={{ width: `${totalNotes > 0 ? ((result.maxCombo / Math.max(totalNotes * 0.5, 1)) * 100) : 0}%`, maxWidth: '100%' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Perfect', count: result.perfect, color: 'yellow', emoji: '✨', score: 100 },
              { label: 'Great', count: result.great, color: 'green', emoji: '🌟', score: 70 },
              { label: 'Good', count: result.good, color: 'blue', emoji: '👍', score: 30 },
              { label: 'Miss', count: result.miss, color: 'gray', emoji: '💔', score: 0 },
            ].map((item) => {
              const percentage = totalNotes > 0 ? (item.count / totalNotes) * 100 : 0;
              const colors: Record<string, string> = {
                yellow: 'from-yellow-300 to-amber-500',
                green: 'from-green-300 to-emerald-500',
                blue: 'from-blue-300 to-cyan-500',
                gray: 'from-gray-300 to-slate-400',
              };
              const textColors: Record<string, string> = {
                yellow: 'text-amber-600',
                green: 'text-emerald-600',
                blue: 'text-cyan-600',
                gray: 'text-gray-500',
              };
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <span className={`font-display font-bold ${textColors[item.color]}`}>
                        {item.label}
                      </span>
                      {item.score > 0 && (
                        <span className="text-xs text-gray-400">+{item.score}分</span>
                      )}
                    </div>
                    <span className="font-display font-black text-xl text-gray-700">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colors[item.color]} transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 animate-slide-down" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleRestart}
            className="cute-btn-secondary flex items-center justify-center gap-2 w-full"
          >
            <RotateCcw className="w-5 h-5" />
            再来一次
          </button>
          <button
            onClick={handleHome}
            className="cute-btn-primary flex items-center justify-center gap-2 w-full"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
        </div>

        <div className="mt-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-card px-6 py-3">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="font-display font-bold text-gray-600">
              全部音符: {totalNotes} 个
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
