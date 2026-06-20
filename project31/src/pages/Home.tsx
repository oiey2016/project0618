import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ResourceBar } from '../components/ResourceBar';
import { EraTimeline } from '../components/EraTimeline';
import { CivilizationScene } from '../components/CivilizationScene';
import { BuildPanel } from '../components/BuildPanel';
import { QuizModal } from '../components/QuizModal';
import { Notifications } from '../components/Notifications';
import { GameCompleteOverlay } from '../components/GameCompleteOverlay';
import type { Quiz } from '../types/game';

export default function Home() {
  const { eras, currentEraId, startQuiz, answerQuiz, loadGame } = useGameStore();
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentEra = eras.find(e => e.id === currentEraId) || eras[0];

  useEffect(() => {
    loadGame();
    setIsLoaded(true);
  }, [loadGame]);

  const handleStartQuiz = () => {
    const quiz = startQuiz();
    if (quiz) {
      setActiveQuiz(quiz);
    }
  };

  const handleCloseQuiz = () => {
    setActiveQuiz(null);
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <CivilizationScene key={currentEra.id} era={currentEra} />
      </AnimatePresence>

      <ResourceBar />
      <EraTimeline />
      <BuildPanel era={currentEra} onStartQuiz={handleStartQuiz} />

      <AnimatePresence>
        {activeQuiz && (
          <QuizModal
            quiz={activeQuiz}
            onClose={handleCloseQuiz}
            onAnswer={answerQuiz}
            eraTheme={currentEra.theme}
          />
        )}
      </AnimatePresence>

      <Notifications />
      <GameCompleteOverlay />
    </div>
  );
}
