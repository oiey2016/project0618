import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronRight } from 'lucide-react';
import { getLevelById } from '@/data/levels';
import { getQuestionsByIds } from '@/data/questions';
import { useGameStore } from '@/store/gameStore';
import { usePlayerStore } from '@/store/playerStore';
import CoinDisplay from '@/components/CoinDisplay';
import StarBackground from '@/components/StarBackground';

export default function QuizPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const level = levelId ? getLevelById(levelId) : undefined;
  const questions = level ? getQuestionsByIds(level.questionIds) : [];

  const {
    currentQuestionIndex,
    correctCount,
    totalQuestions,
    isAnswering,
    selectedAnswer,
    showExplanation,
    earnedGold,
    startQuiz,
    answerQuestion,
    nextQuestion,
    setShowExplanation,
  } = useGameStore();

  const addGold = usePlayerStore((state) => state.addGold);
  const addExp = usePlayerStore((state) => state.addExp);
  const completeLevel = usePlayerStore((state) => state.completeLevel);
  const unlockLevel = usePlayerStore((state) => state.unlockLevel);
  const getTotalStats = usePlayerStore((state) => state.getTotalStats);
  const unlockedLevels = usePlayerStore((state) => state.unlockedLevels);

  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [coinAmount, setCoinAmount] = useState(0);

  useEffect(() => {
    if (level && questions.length > 0) {
      startQuiz(level.id, questions.length);
    }
  }, [levelId]);

  if (!level || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>关卡不存在</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  const handleAnswer = (answerIndex: number) => {
    if (!isAnswering) return;

    const isCorrect = answerIndex === currentQuestion.correctIndex;
    const stats = getTotalStats();
    const baseGold = 10;
    const luckBonus = 1 + stats.luck * 0.02;
    const goldEarned = isCorrect ? Math.floor(baseGold * luckBonus) : 0;

    answerQuestion(answerIndex, isCorrect, goldEarned);

    if (isCorrect) {
      setCoinAmount(goldEarned);
      setShowCoinAnimation(true);
      setTimeout(() => setShowCoinAnimation(false), 1000);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const passRate = correctCount / totalQuestions;
      const passed = passRate >= 0.6;

      if (passed) {
        addGold(level.rewardGold + earnedGold);
        addExp(level.rewardExp);
        completeLevel(level.id);

        const levelIndex = parseInt(level.id.split('-')[1]);
        const nextLevelId = `level-${levelIndex + 1}`;
        if (!unlockedLevels.includes(nextLevelId)) {
          unlockLevel(nextLevelId);
        }
      } else {
        addGold(earnedGold);
      }

      navigate(`/result/${level.id}?passed=${passed}&earned=${level.rewardGold + earnedGold}`);
    } else {
      nextQuestion();
    }
  };

  const getOptionClass = (index: number) => {
    if (isAnswering) return '';
    if (index === currentQuestion.correctIndex) return 'option-correct';
    if (index === selectedAnswer && index !== currentQuestion.correctIndex) return 'option-wrong';
    return 'opacity-50';
  };

  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">返回地图</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <CoinDisplay size="sm" />
              {showCoinAnimation && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 font-bold animate-coin-fly">
                  +{coinAmount} 💰
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 关卡信息 */}
        <div className="text-center px-4 mb-4">
          <div className="text-2xl mb-2">{level.emoji}</div>
          <h2
            className="text-2xl font-bold text-gradient-gold"
            style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
          >
            {level.name}
          </h2>
        </div>

        {/* 进度条 */}
        <div className="px-4 md:px-8 mb-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>第 {currentQuestionIndex + 1} 题 / 共 {totalQuestions} 题</span>
              <span className="text-green-400">✓ {correctCount} 正确</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* 答题区域 */}
        <div className="flex-1 px-4 md:px-8 pb-8">
          <div className="max-w-2xl mx-auto">
            {/* 题目卡片 */}
            <div className="game-card mb-6 animate-pop">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle size={20} className="text-yellow-400" />
                <span className="text-sm text-yellow-400 font-medium">
                  {currentQuestion.category}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold leading-relaxed">
                {currentQuestion.question}
              </h3>
            </div>

            {/* 选项 */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={!isAnswering}
                  className={`option-btn ${getOptionClass(index)}`}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 mr-3 font-bold text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {/* 解析 */}
            {showExplanation && (
              <div className="game-card mb-6 animate-slide-up border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                  💡 知识解析
                </h4>
                <p className="text-gray-200">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* 下一题按钮 */}
            {!isAnswering && (
              <div className="text-center animate-slide-up">
                <button
                  onClick={handleNext}
                  className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
                >
                  {isLastQuestion ? '查看结果' : '下一题'}
                  <ChevronRight size={22} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
