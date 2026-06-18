import type { GameState } from './types';
import { UPGRADES, STAGES, ACHIEVEMENTS } from './config';
import { calculateUpgradeCost, calculateUpgradeEffect } from './utils';

export const recalculateStats = (state: GameState): GameState => {
  let eggsPerClick = 1;
  let eggsPerSecond = 0;
  let multiplier = 1;

  for (const upgrade of UPGRADES) {
    const level = state.upgrades[upgrade.id] || 0;
    if (level === 0) continue;

    const effect = calculateUpgradeEffect(upgrade.baseEffect, level);
    
    if (upgrade.effectType === 'click') {
      eggsPerClick += effect;
    } else if (upgrade.effectType === 'auto') {
      eggsPerSecond += effect;
    } else if (upgrade.effectType === 'multiplier') {
      multiplier += effect;
    }
  }

  return {
    ...state,
    eggsPerClick: Math.floor(eggsPerClick * multiplier),
    eggsPerSecond: eggsPerSecond * multiplier,
    multiplier,
  };
};

export const canBuyUpgrade = (state: GameState, upgradeId: string): boolean => {
  const upgrade = UPGRADES.find((u) => u.id === upgradeId);
  if (!upgrade) return false;
  if (upgrade.unlockStage > state.currentStage) return false;
  
  const level = state.upgrades[upgradeId] || 0;
  const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.costMultiplier, level);
  return state.eggs >= cost;
};

export const buyUpgrade = (state: GameState, upgradeId: string): GameState => {
  const upgrade = UPGRADES.find((u) => u.id === upgradeId);
  if (!upgrade) return state;
  if (!canBuyUpgrade(state, upgradeId)) return state;

  const level = state.upgrades[upgradeId] || 0;
  const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.costMultiplier, level);

  const newState: GameState = {
    ...state,
    eggs: state.eggs - cost,
    upgrades: {
      ...state.upgrades,
      [upgradeId]: level + 1,
    },
  };

  return recalculateStats(newState);
};

export const checkStageAdvancement = (state: GameState): number => {
  let newStage = state.currentStage;
  for (const stage of STAGES) {
    if (state.totalEggs >= stage.requiredEggs) {
      newStage = stage.id;
    } else {
      break;
    }
  }
  return newStage;
};

export const checkAchievements = (state: GameState): string[] => {
  const newAchievements: string[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
      newAchievements.push(achievement.id);
    }
  }
  
  return newAchievements;
};

export const getAchievementReward = (achievementId: string): number => {
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
  return achievement?.reward || 0;
};

export const calculateOfflineEarnings = (
  state: GameState,
  offlineSeconds: number
): number => {
  const maxOfflineHours = 8;
  const cappedSeconds = Math.min(offlineSeconds, maxOfflineHours * 3600);
  const efficiency = 0.5;
  return Math.floor(state.eggsPerSecond * cappedSeconds * efficiency);
};

export const getNextStage = (state: GameState) => {
  const nextStageId = state.currentStage + 1;
  return STAGES.find((s) => s.id === nextStageId) || null;
};

export const getCurrentStage = (state: GameState) => {
  return STAGES[state.currentStage] || STAGES[0];
};

export const getAvailableUpgrades = (state: GameState) => {
  return UPGRADES.filter((u) => u.unlockStage <= state.currentStage);
};
