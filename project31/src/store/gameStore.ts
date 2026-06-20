import { create } from 'zustand';
import type { GameState, Quiz, QuizResult, Notification } from '../types/game';
import { ERAS, QUIZZES, POINTS_PER_CORRECT, POINTS_PER_WRONG } from '../data/gameData';

const STORAGE_KEY = 'civilization-epic-save';

interface GameActions {
  startQuiz: () => Quiz | null;
  answerQuiz: (quiz: Quiz, selectedIndex: number) => QuizResult;
  buildLandmark: (landmarkId: string) => boolean;
  checkEraProgress: () => void;
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  resetGame: () => void;
  loadGame: () => void;
  saveGame: () => void;
}

const initialState: Omit<GameState, 'notifications'> = {
  knowledgePoints: 0,
  currentEraId: 'primitive',
  eras: JSON.parse(JSON.stringify(ERAS)),
  quizzes: QUIZZES,
  answeredQuizIds: [],
  totalAnswered: 0,
  totalCorrect: 0,
  gameCompleted: false,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,
  notifications: [],

  startQuiz: () => {
    const state = get();
    const currentEraId = state.currentEraId;
    const eraQuizzes = state.quizzes.filter(q => q.eraId === currentEraId);

    let unansweredQuizzes = eraQuizzes.filter(q => !state.answeredQuizIds.includes(q.id));

    if (unansweredQuizzes.length === 0) {
      unansweredQuizzes = eraQuizzes;
    }

    if (unansweredQuizzes.length === 0) {
      unansweredQuizzes = state.quizzes.filter(q => !state.answeredQuizIds.includes(q.id));
    }

    if (unansweredQuizzes.length === 0) {
      unansweredQuizzes = state.quizzes;
    }

    const randomIndex = Math.floor(Math.random() * unansweredQuizzes.length);
    return unansweredQuizzes[randomIndex];
  },

  answerQuiz: (quiz, selectedIndex) => {
    const state = get();
    const correct = selectedIndex === quiz.correctIndex;
    const pointsEarned = correct ? POINTS_PER_CORRECT : POINTS_PER_WRONG;

    const newAnsweredIds = state.answeredQuizIds.includes(quiz.id)
      ? state.answeredQuizIds
      : [...state.answeredQuizIds, quiz.id];

    set({
      knowledgePoints: state.knowledgePoints + pointsEarned,
      answeredQuizIds: newAnsweredIds,
      totalAnswered: state.totalAnswered + 1,
      totalCorrect: state.totalCorrect + (correct ? 1 : 0),
    });

    if (correct) {
      get().addNotification('success', `答对了！获得 ${pointsEarned} 知识点数`);
    } else {
      get().addNotification('info', `很遗憾，获得 ${pointsEarned} 鼓励点`);
    }

    get().saveGame();

    return {
      correct,
      explanation: quiz.explanation,
      correctAnswer: quiz.options[quiz.correctIndex],
      pointsEarned,
    };
  },

  buildLandmark: (landmarkId) => {
    const state = get();
    const currentEra = state.eras.find(e => e.id === state.currentEraId);
    if (!currentEra) return false;

    const landmark = currentEra.landmarks.find(l => l.id === landmarkId);
    if (!landmark || landmark.built) return false;
    if (state.knowledgePoints < landmark.cost) {
      get().addNotification('warning', `知识点数不足！需要 ${landmark.cost} 点`);
      return false;
    }

    const updatedEras = state.eras.map(era => {
      if (era.id !== state.currentEraId) return era;
      return {
        ...era,
        landmarks: era.landmarks.map(l =>
          l.id === landmarkId ? { ...l, built: true } : l
        ),
      };
    });

    set({
      knowledgePoints: state.knowledgePoints - landmark.cost,
      eras: updatedEras,
    });

    get().addNotification('success', `🏗️ 建造完成：${landmark.name}！`);
    get().checkEraProgress();
    get().saveGame();

    return true;
  },

  checkEraProgress: () => {
    const state = get();
    const currentEra = state.eras.find(e => e.id === state.currentEraId);
    if (!currentEra) return;

    const allBuilt = currentEra.landmarks.every(l => l.built);
    if (allBuilt) {
      const currentIndex = state.eras.findIndex(e => e.id === state.currentEraId);
      if (currentIndex < state.eras.length - 1) {
        const nextEra = state.eras[currentIndex + 1];
        const updatedEras = state.eras.map((era, idx) =>
          idx === currentIndex + 1 ? { ...era, unlocked: true } : era
        );

        set({
          eras: updatedEras,
          currentEraId: nextEra.id,
        });

        get().addNotification('success', `🎉 新时代解锁：${nextEra.emoji} ${nextEra.name}！`);
      } else if (!state.gameCompleted) {
        set({ gameCompleted: true });
        get().addNotification('success', `🏆 恭喜你！完成了文明史诗，见证了人类的全部征程！`);
      }
    }
  },

  addNotification: (type, message) => {
    const id = Date.now().toString() + Math.random();
    const notification: Notification = {
      id,
      type,
      message,
      timestamp: Date.now(),
    };
    set(state => ({
      notifications: [...state.notifications, notification],
    }));

    setTimeout(() => {
      get().removeNotification(id);
    }, 3500);
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  resetGame: () => {
    set({
      ...JSON.parse(JSON.stringify(initialState)),
      notifications: [],
    });
    localStorage.removeItem(STORAGE_KEY);
    get().addNotification('info', '游戏已重置，从原始部落重新开始！');
  },

  saveGame: () => {
    const state = get();
    const saveData = {
      knowledgePoints: state.knowledgePoints,
      currentEraId: state.currentEraId,
      eras: state.eras,
      answeredQuizIds: state.answeredQuizIds,
      totalAnswered: state.totalAnswered,
      totalCorrect: state.totalCorrect,
      gameCompleted: state.gameCompleted,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  },

  loadGame: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        set(state => ({
          ...state,
          knowledgePoints: data.knowledgePoints ?? 0,
          currentEraId: data.currentEraId ?? 'primitive',
          eras: data.eras ?? JSON.parse(JSON.stringify(ERAS)),
          answeredQuizIds: data.answeredQuizIds ?? [],
          totalAnswered: data.totalAnswered ?? 0,
          totalCorrect: data.totalCorrect ?? 0,
          gameCompleted: data.gameCompleted ?? false,
        }));
      } catch (e) {
        console.error('Failed to load game save', e);
      }
    }
  },
}));
