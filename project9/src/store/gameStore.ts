import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  GameStore,
  ItemEffect,
  LogEntry,
  Planet,
  Item,
  Route,
  RiskLevel,
} from '../types';
import { PLANETS, ROUTES } from '../data/planets';
import { STARTING_INVENTORY, ITEMS } from '../data/items';
import { EVENTS } from '../data/events';
import {
  INTRO_NARRATIVE,
  getPlanetArrivalText,
  VICTORY_TEXT,
  DEFEAT_TEXT,
} from '../data/narratives';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getPlanetById(id: string): Planet | undefined {
  return PLANETS.find((p) => p.id === id);
}

function getItemById(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}

function getRouteById(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

function createLogEntry(
  day: number,
  type: LogEntry['type'],
  content: string
): LogEntry {
  return {
    day,
    type,
    content,
    timestamp: Date.now(),
  };
}

function createInitialState(): GameState {
  const startPlanet = PLANETS[0];
  const startPlanetId = startPlanet.id;
  const availableRoutes = ROUTES.filter((r) => r.fromId === startPlanetId);
  const currentPlanet = getPlanetById(startPlanetId);
  const inventoryFull =
    new Set(STARTING_INVENTORY.map((i) => i.itemId)).size >= 8;

  return {
    screen: 'start',
    daysRemaining: 80,
    currentDay: 1,
    stardust: 2000,
    fuel: 100,
    morale: 80,
    currentPlanetId: startPlanetId,
    visitedPlanetIds: [],
    inventory: [...STARTING_INVENTORY],
    storyLog: [createLogEntry(1, 'narrative', INTRO_NARRATIVE)],
    activeEvent: null,
    selectedRouteId: null,
    stats: {
      totalDaysUsed: 0,
      planetsVisited: 0,
      eventsResolved: 0,
      stardustEarned: 0,
      stardustSpent: 0,
      itemsUsed: 0,
    },
    isGameOver: false,
    isVictory: false,
    endReason: undefined,
    availableRoutes,
    currentPlanet,
    inventoryFull,
  };
}

function applyEffect(
  state: GameState,
  effect: ItemEffect
): { state: GameState; stardustEarned: number; stardustSpent: number } {
  let stardustEarned = 0;
  let stardustSpent = 0;

  if (effect.stardust !== undefined) {
    if (effect.stardust >= 0) {
      stardustEarned = effect.stardust;
    } else {
      stardustSpent = Math.abs(effect.stardust);
    }
    state.stardust = Math.max(0, state.stardust + effect.stardust);
  }
  if (effect.fuel !== undefined) {
    state.fuel = Math.max(0, state.fuel + effect.fuel);
  }
  if (effect.morale !== undefined) {
    state.morale = clamp(state.morale + effect.morale, 0, 100);
  }
  if (effect.days !== undefined) {
    state.daysRemaining = clamp(state.daysRemaining - effect.days, 0, 80);
    state.currentDay = Math.max(1, state.currentDay + effect.days);
    if (effect.days > 0) {
      state.stats.totalDaysUsed += effect.days;
    }
  }

  return { state, stardustEarned, stardustSpent };
}

function checkGameEnd(state: GameState): GameState {
  if (state.daysRemaining <= 0 || state.morale <= 0) {
    state.isGameOver = true;
    state.isVictory = false;
    state.screen = 'end';
    state.endReason = DEFEAT_TEXT;
  }
  return state;
}

function updateDerived(state: GameState): GameState {
  state.availableRoutes = ROUTES.filter(
    (r) => r.fromId === state.currentPlanetId
  );
  state.currentPlanet = getPlanetById(state.currentPlanetId);
  state.inventoryFull =
    new Set(state.inventory.map((i) => i.itemId)).size >= 8;
  return state;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      startNewGame: () => {
        const initial = createInitialState();
        set({
          ...initial,
          screen: 'game',
        });
      },

      restartGame: () => {
        const initial = createInitialState();
        localStorage.removeItem('interstellar80-save');
        set({
          ...initial,
          screen: 'game',
        });
      },

      loadGame: (): boolean => {
        const state = get();
        const hasData = state.storyLog.length > 1 || state.currentDay > 1;
        return hasData;
      },

      saveGame: () => {
        // persist middleware 自动处理
      },

      selectRoute: (routeId: string) => {
        if (routeId === '') {
          set({ selectedRouteId: null });
          return;
        }
        const state = get();
        const route = getRouteById(routeId);
        if (!route) return;

        if (state.fuel < route.fuelCost) return;
        if (state.stardust < route.stardustCost) return;
        if (state.daysRemaining < route.travelDays) return;

        set({ selectedRouteId: routeId });
      },

      switchScreen: (screen) => {
        set({ screen });
      },

      travel: () => {
        const state = { ...get() } as GameState;
        const { selectedRouteId } = state;
        if (!selectedRouteId) return;

        const route = getRouteById(selectedRouteId);
        if (!route) return;

        const travelDays = route.travelDays;
        state.daysRemaining = Math.max(0, state.daysRemaining - travelDays);
        state.currentDay += travelDays;
        state.fuel = Math.max(0, state.fuel - route.fuelCost);
        state.stardust = Math.max(0, state.stardust - route.stardustCost);
        state.stats.stardustSpent += route.stardustCost;

        const moraleDrop = Math.floor(Math.random() * 4) + 2;
        state.morale = clamp(state.morale - moraleDrop, 0, 100);

        state.stats.planetsVisited++;
        state.stats.totalDaysUsed += travelDays;

        const toPlanet = getPlanetById(route.toId);
        const toPlanetName = toPlanet?.name ?? route.toId;

        if (!state.visitedPlanetIds.includes(route.toId)) {
          state.visitedPlanetIds = [...state.visitedPlanetIds, route.toId];
        }
        state.currentPlanetId = route.toId;

        const routeLog = createLogEntry(
          state.currentDay,
          'route',
          `第${state.currentDay}天航行至${toPlanetName}，用时${travelDays}天，消耗燃料${route.fuelCost}。`
        );
        state.storyLog = [...state.storyLog, routeLog];

        const arrivalText = getPlanetArrivalText(toPlanetName);
        const arrivalLog = createLogEntry(
          state.currentDay,
          'narrative',
          arrivalText
        );
        state.storyLog = [...state.storyLog, arrivalLog];

        state.selectedRouteId = null;

        const startPlanetId = PLANETS[0].id;
        if (
          route.toId === startPlanetId &&
          state.visitedPlanetIds.length >= 10
        ) {
          state.isGameOver = true;
          state.isVictory = true;
          state.screen = 'end';
          state.endReason = VICTORY_TEXT;
        } else if (state.daysRemaining <= 0) {
          state.isGameOver = true;
          state.isVictory = false;
          state.screen = 'end';
          state.endReason = DEFEAT_TEXT;
        } else {
          const riskProb: Record<RiskLevel, number> = {
            low: 0.35,
            mid: 0.6,
            high: 0.85,
          };
          const prob = riskProb[route.riskLevel];
          if (Math.random() < prob) {
            const filtered = EVENTS.filter(
              (e) => e.triggerCondition === route.riskLevel
            );
            if (filtered.length > 0) {
              const event =
                filtered[Math.floor(Math.random() * filtered.length)];
              state.activeEvent = event;
              state.stats.eventsResolved++;
            }
          }
        }

        updateDerived(state);
        set(state);
      },

      triggerRandomEvent: (riskLevel?: RiskLevel) => {
        const state = { ...get() } as GameState;
        const level: RiskLevel = riskLevel ?? 'mid';
        const filtered = EVENTS.filter((e) => e.triggerCondition === level);
        if (filtered.length === 0) return;

        const event = filtered[Math.floor(Math.random() * filtered.length)];
        state.activeEvent = event;
        state.stats.eventsResolved++;

        set(state);
      },

      resolveEventOption: (optionIndex: number) => {
        const state = { ...get() } as GameState;
        if (!state.activeEvent) return;

        const option = state.activeEvent.options[optionIndex];
        if (!option) return;

        const eventTitle = state.activeEvent.title;

        const { state: newState, stardustEarned, stardustSpent } = applyEffect(
          state,
          option.effect
        );
        newState.stats.stardustEarned += stardustEarned;
        newState.stats.stardustSpent += stardustSpent;

        const eventLog = createLogEntry(
          newState.currentDay,
          'event',
          `【${eventTitle}】${option.resultText}`
        );
        newState.storyLog = [...newState.storyLog, eventLog];

        newState.activeEvent = null;

        const finalState = checkGameEnd(newState);
        updateDerived(finalState);

        set(finalState);
      },

      useItem: (itemId: string) => {
        const state = { ...get() } as GameState;
        const invIndex = state.inventory.findIndex(
          (i) => i.itemId === itemId
        );
        if (invIndex === -1) return;

        const invItem = state.inventory[invIndex];
        if (invItem.quantity <= 0) return;

        invItem.quantity--;
        if (invItem.quantity <= 0) {
          state.inventory = state.inventory.filter(
            (i) => i.itemId !== itemId
          );
        } else {
          state.inventory = [...state.inventory];
        }

        const item = getItemById(itemId);
        let effectLogText = `使用了 ${item?.name ?? itemId}`;

        if (item && item.consumable) {
          const { state: newState, stardustEarned, stardustSpent } =
            applyEffect(state, item.effect);
          Object.assign(state, newState);
          state.stats.stardustEarned += stardustEarned;
          state.stats.stardustSpent += stardustSpent;

          if (item.effect.stardust !== undefined) {
            effectLogText += `，星币${item.effect.stardust >= 0 ? '+' : ''}${item.effect.stardust}`;
          }
          if (item.effect.fuel !== undefined) {
            effectLogText += `，燃料${item.effect.fuel >= 0 ? '+' : ''}${item.effect.fuel}`;
          }
          if (item.effect.morale !== undefined) {
            effectLogText += `，士气${item.effect.morale >= 0 ? '+' : ''}${item.effect.morale}`;
          }
          if (item.effect.days !== undefined) {
            const dayChange = -item.effect.days;
            effectLogText += `，天数${dayChange >= 0 ? '+' : ''}${dayChange}`;
          }
        }

        state.stats.itemsUsed++;

        const itemLog = createLogEntry(
          state.currentDay,
          'item',
          effectLogText + '。'
        );
        state.storyLog = [...state.storyLog, itemLog];

        const finalState = checkGameEnd(state);
        updateDerived(finalState);

        set(finalState);
      },

      discardItem: (itemId: string) => {
        const state = { ...get() } as GameState;
        const invIndex = state.inventory.findIndex(
          (i) => i.itemId === itemId
        );
        if (invIndex === -1) return;

        const invItem = state.inventory[invIndex];
        const item = getItemById(itemId);
        const itemName = item?.name ?? itemId;

        invItem.quantity--;
        if (invItem.quantity <= 0) {
          state.inventory = state.inventory.filter(
            (i) => i.itemId !== itemId
          );
        } else {
          state.inventory = [...state.inventory];
        }

        const discardLog = createLogEntry(
          state.currentDay,
          'system',
          `丢弃了 ${itemName}。`
        );
        state.storyLog = [...state.storyLog, discardLog];

        updateDerived(state);
        set(state);
      },

      returnToTitle: () => {
        set({ screen: 'start' });
      },
    }),
    {
      name: 'interstellar80-save',
    }
  )
);

export default useGameStore;
