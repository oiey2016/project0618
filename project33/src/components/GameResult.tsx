import { Trophy, Star, RotateCcw, Home } from "lucide-react";

interface GameResultProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export default function GameResult({
  score,
  correctCount,
  totalQuestions,
  onPlayAgain,
  onGoHome,
}: GameResultProps) {
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  
  const getStars = () => {
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    if (accuracy >= 50) return 1;
    return 0;
  };

  const stars = getStars();

  const getMessage = () => {
    if (stars === 3) return "太棒了！你是地理小天才！🌟";
    if (stars === 2) return "很不错！继续加油！💪";
    if (stars === 1) return "还不错，多多练习哦！📚";
    return "别灰心，再来一次！🎯";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-pop">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce-slow">
            {stars === 3 ? "🏆" : stars === 2 ? "🎉" : stars === 1 ? "👍" : "💫"}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2 font-game">
            挑战完成!
          </h2>
          <p className="text-gray-500 mb-6">{getMessage()}</p>

          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                size={40}
                className={`transition-all duration-500 ${
                  i < stars
                    ? "text-accent-yellow fill-accent-yellow scale-110"
                    : "text-gray-200"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              />
            ))}
          </div>

          <div className="bg-cream rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">得分</p>
                <p className="text-2xl font-bold text-primary-500">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">正确</p>
                <p className="text-2xl font-bold text-accent-green">
                  {correctCount}/{totalQuestions}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">正确率</p>
                <p className="text-2xl font-bold text-accent-orange">
                  {accuracy}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onGoHome}
              className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-game-hover"
            >
              <Home size={22} />
              返回首页
            </button>
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-game"
            >
              <RotateCcw size={22} />
              再来一局
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
