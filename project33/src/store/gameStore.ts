import { create } from "zustand";
import { countries, Country, getCountryById } from "@/data/countries";

type GameMode = "home" | "explore" | "challenge";
type QuestionType = "country" | "capital";

interface GameState {
  mode: GameMode;
  selectedCountry: Country | null;
  score: number;
  combo: number;
  lives: number;
  currentQuestion: Country | null;
  questionType: QuestionType;
  answeredCount: number;
  correctCount: number;
  isGameOver: boolean;
  totalQuestions: number;
  feedbackState: "correct" | "wrong" | null;
  showResult: boolean;

  setMode: (mode: GameMode) => void;
  selectCountry: (countryId: string | null) => void;
  startGame: () => void;
  checkAnswer: (countryId: string) => boolean;
  nextQuestion: () => void;
  resetGame: () => void;
  setShowResult: (show: boolean) => void;
}

const getRandomQuestion = (): { country: Country; type: QuestionType } => {
  const randomIndex = Math.floor(Math.random() * countries.length);
  const country = countries[randomIndex];
  const type: QuestionType = Math.random() > 0.5 ? "country" : "capital";
  return { country, type };
};

export const useGameStore = create<GameState>((set, get) => ({
  mode: "home",
  selectedCountry: null,
  score: 0,
  combo: 0,
  lives: 3,
  currentQuestion: null,
  questionType: "country",
  answeredCount: 0,
  correctCount: 0,
  isGameOver: false,
  totalQuestions: 10,
  feedbackState: null,
  showResult: false,

  setMode: (mode) => {
    set({ mode });
    if (mode === "challenge") {
      get().startGame();
    }
  },

  selectCountry: (countryId) => {
    if (countryId === null) {
      set({ selectedCountry: null });
    } else {
      const country = getCountryById(countryId);
      set({ selectedCountry: country || null });
    }
  },

  startGame: () => {
    const { country, type } = getRandomQuestion();
    set({
      score: 0,
      combo: 0,
      lives: 3,
      currentQuestion: country,
      questionType: type,
      answeredCount: 0,
      correctCount: 0,
      isGameOver: false,
      feedbackState: null,
      showResult: false,
    });
  },

  checkAnswer: (countryId) => {
    const { currentQuestion, combo, lives, score, correctCount, answeredCount, totalQuestions } = get();
    
    if (!currentQuestion || get().isGameOver) return false;

    const isCorrect = countryId === currentQuestion.id;

    if (isCorrect) {
      const newCombo = combo + 1;
      const comboBonus = Math.min(newCombo - 1, 5) * 10;
      const pointsEarned = 100 + comboBonus;
      
      set({
        score: score + pointsEarned,
        combo: newCombo,
        correctCount: correctCount + 1,
        answeredCount: answeredCount + 1,
        feedbackState: "correct",
        selectedCountry: currentQuestion,
      });
    } else {
      set({
        combo: 0,
        lives: lives - 1,
        answeredCount: answeredCount + 1,
        feedbackState: "wrong",
      });
    }

    setTimeout(() => {
      const state = get();
      const shouldEnd = state.lives <= 0 || state.answeredCount >= totalQuestions;
      
      if (shouldEnd) {
        set({ isGameOver: true, showResult: true, feedbackState: null });
      } else {
        state.nextQuestion();
      }
    }, 1000);

    return isCorrect;
  },

  nextQuestion: () => {
    const { country, type } = getRandomQuestion();
    set({
      currentQuestion: country,
      questionType: type,
      feedbackState: null,
      selectedCountry: null,
    });
  },

  resetGame: () => {
    get().startGame();
  },

  setShowResult: (show) => {
    set({ showResult: show });
  },
}));
