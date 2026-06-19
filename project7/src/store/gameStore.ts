import { create } from "zustand";
import type { Card, StatChange, StatKey, Stats } from "@/types";
import { CARDS, STAT_META, shuffle } from "@/data/cards";

interface GameState {
  stats: Stats;
  year: number;
  deckIndex: number;
  shuffledDeck: Card[];
  isGameOver: boolean;
  deathReason: string;
  deathStat: StatKey | null;
  lastChange: Partial<Record<StatKey, number>>;
  animatingOut: null | "left" | "right";
  kingName: string;
}

interface GameActions {
  startNewGame: () => void;
  makeChoice: (side: "left" | "right") => void;
  setAnimatingOut: (side: null | "left" | "right") => void;
}

const KING_FIRST = ["阿尔", "亨利", "理查", "乔治", "威廉", "路易", "腓力", "查理", "费迪南", "马克西米"];
const KING_LAST = ["斯塔德", "蒙德", "三世", "五世", "大帝", "逊王", "勇王", "贤王", "烈王", "都铎"];

function randomKing(): string {
  const f = KING_FIRST[Math.floor(Math.random() * KING_FIRST.length)];
  const l = KING_LAST[Math.floor(Math.random() * KING_LAST.length)];
  return `${f}·${l}`;
}

function initialStats(): Stats {
  return { church: 50, people: 50, army: 50, wealth: 50 };
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  stats: initialStats(),
  year: 1,
  deckIndex: 0,
  shuffledDeck: shuffle(CARDS),
  isGameOver: false,
  deathReason: "",
  deathStat: null,
  lastChange: {},
  animatingOut: null,
  kingName: randomKing(),

  startNewGame: () => {
    set({
      stats: initialStats(),
      year: 1,
      deckIndex: 0,
      shuffledDeck: shuffle(CARDS),
      isGameOver: false,
      deathReason: "",
      deathStat: null,
      lastChange: {},
      animatingOut: null,
      kingName: randomKing(),
    });
  },

  setAnimatingOut: (side) => set({ animatingOut: side }),

  makeChoice: (side) => {
    const { shuffledDeck, deckIndex, animatingOut } = get();
    if (animatingOut) return;
    const card = shuffledDeck[deckIndex % shuffledDeck.length];
    if (!card) return;

    const effect: StatChange = side === "left" ? card.leftChoice.effect : card.rightChoice.effect;

    set({ animatingOut: side });

    window.setTimeout(() => {
      const { stats } = get();
      const nextStats: Stats = { ...stats };
      const delta: Partial<Record<StatKey, number>> = {};
      const keys: StatKey[] = ["church", "people", "army", "wealth"];
      for (const k of keys) {
        const v = effect[k] ?? 0;
        if (v !== 0) {
          delta[k] = v;
          nextStats[k] = Math.max(0, Math.min(100, nextStats[k] + v));
        }
      }

      const deadKey = keys.find((k) => nextStats[k] <= 0 || nextStats[k] >= 100);
      if (deadKey) {
        const meta = STAT_META[deadKey];
        const isLow = nextStats[deadKey] <= 0;
        set({
          stats: nextStats,
          lastChange: delta,
          isGameOver: true,
          deathStat: deadKey,
          deathReason: isLow ? meta.deathLow : meta.deathHigh,
          animatingOut: null,
        });
      } else {
        set((s) => ({
          stats: nextStats,
          lastChange: delta,
          year: s.year + 1,
          deckIndex: s.deckIndex + 1,
          animatingOut: null,
        }));
      }
    }, 380);
  },
}));

export function currentCardSelector(s: GameState): Card {
  return s.shuffledDeck[s.deckIndex % s.shuffledDeck.length];
}
