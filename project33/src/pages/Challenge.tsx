import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import WorldMap from "@/components/WorldMap";
import QuestionCard from "@/components/QuestionCard";
import ScorePanel from "@/components/ScorePanel";
import GameResult from "@/components/GameResult";
import { useGameStore } from "@/store/gameStore";
import { Country } from "@/data/countries";

export default function Challenge() {
  const navigate = useNavigate();
  const {
    currentQuestion,
    questionType,
    score,
    combo,
    lives,
    answeredCount,
    correctCount,
    totalQuestions,
    isGameOver,
    showResult,
    feedbackState,
    selectedCountry,
    startGame,
    checkAnswer,
    resetGame,
    setShowResult,
  } = useGameStore();

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleCountryClick = (country: Country) => {
    if (feedbackState || isGameOver) return;
    checkAnswer(country.id);
  };

  const handlePlayAgain = () => {
    resetGame();
    setShowResult(false);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🌍</div>
          <p className="text-xl text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cream">
      <div className="container mx-auto px-4 py-6">
        <NavBar title="🎯 挑战模式" />

        <div className="mt-6 space-y-4">
          <ScorePanel score={score} combo={combo} lives={lives} />

          <QuestionCard
            country={currentQuestion}
            questionType={questionType}
            questionNumber={answeredCount + (feedbackState ? 0 : 1)}
            totalQuestions={totalQuestions}
          />

          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-card">
            <div className="h-[400px]">
              <WorldMap
                onCountryClick={handleCountryClick}
                selectedCountryId={selectedCountry?.id || null}
                highlightCountryId={
                  feedbackState === "wrong" ? currentQuestion.id : null
                }
                feedbackState={feedbackState}
                interactive={!feedbackState && !isGameOver}
              />
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm">
            💡 根据题目提示，在地图上点击正确的国家吧！
          </div>
        </div>
      </div>

      {showResult && (
        <GameResult
          score={score}
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
