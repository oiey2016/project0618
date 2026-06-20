import { create } from 'zustand';
import type { QuizState } from '@/types';

interface GameStore extends QuizState {
  startQuiz: (levelId: string, totalQuestions: number) => void;
  answerQuestion: (answerIndex: number, isCorrect: boolean, goldEarned: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  setShowExplanation: (show: boolean) => void;
}

const initialState: QuizState = {
  currentLevelId: null,
  currentQuestionIndex: 0,
  correctCount: 0,
  totalQuestions: 0,
  isAnswering: true,
  selectedAnswer: null,
  showExplanation: false,
  earnedGold: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  startQuiz: (levelId: string, totalQuestions: number) => {
    set({
      currentLevelId: levelId,
      currentQuestionIndex: 0,
      correctCount: 0,
      totalQuestions,
      isAnswering: true,
      selectedAnswer: null,
      showExplanation: false,
      earnedGold: 0,
    });
  },

  answerQuestion: (answerIndex: number, isCorrect: boolean, goldEarned: number) => {
    set((state) => ({
      isAnswering: false,
      selectedAnswer: answerIndex,
      correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
      earnedGold: isCorrect ? state.earnedGold + goldEarned : state.earnedGold,
    }));
  },

  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
      isAnswering: true,
      selectedAnswer: null,
      showExplanation: false,
    }));
  },

  resetQuiz: () => {
    set(initialState);
  },

  setShowExplanation: (show: boolean) => {
    set({ showExplanation: show });
  },
}));
