import { getMinerTypeById } from '@/data/miners';
import { getMinerEfficiency } from '@/data/miners';
import { getLogisticsUpgradeById } from '@/data/upgrades';
import { getCurrentOre, getAvailableOres } from '@/data/ores';
import type { Miner, GameState } from '@/types/game';

export const calculateClickValue = (depth: number): number => {
  const ore = getCurrentOre(depth);
  const depthBonus = 1 + (depth - 1) * 0.1;
  return ore.baseValue * depthBonus;
};

export const calculateMinerEfficiency = (miner: Miner): number => {
  const minerType = getMinerTypeById(miner.typeId);
  if (!minerType) return 0;
  return getMinerEfficiency(
    minerType.baseEfficiency,
    miner.level,
    miner.count
  );
};

export const calculateTotalMinerEfficiency = (miners: Miner[]): number => {
  return miners.reduce((total, miner) => {
    return total + calculateMinerEfficiency(miner);
  }, 0);
};

export const calculateLogisticsSpeed = (
  logistics: Record<string, number>
): number => {
  const transportLevel = logistics['transport'] || 0;
  const upgrade = getLogisticsUpgradeById('transport');
  if (!upgrade) return 1;
  return 1 + transportLevel * upgrade.effect;
};

export const calculateStorageCapacity = (
  logistics: Record<string, number>
): number => {
  const storageLevel = logistics['storage'] || 0;
  const upgrade = getLogisticsUpgradeById('storage');
  if (!upgrade) return 100;
  return 100 * (1 + storageLevel * upgrade.effect);
};

export const calculateAutomationRate = (
  logistics: Record<string, number>
): number => {
  const automationLevel = logistics['automation'] || 0;
  const upgrade = getLogisticsUpgradeById('automation');
  if (!upgrade) return 0;
  return automationLevel * upgrade.effect;
};

export const calculateOfflineEfficiency = (
  logistics: Record<string, number>
): number => {
  const offlineLevel = logistics['offline'] || 0;
  const upgrade = getLogisticsUpgradeById('offline');
  const baseEfficiency = 0.5;
  if (!upgrade) return baseEfficiency;
  return Math.min(1, baseEfficiency + offlineLevel * upgrade.effect);
};

export const calculateOrePerSecond = (state: GameState): number => {
  const minerEfficiency = calculateTotalMinerEfficiency(state.miners);
  const logisticsSpeed = calculateLogisticsSpeed(state.logistics);
  return minerEfficiency * logisticsSpeed;
};

export const calculateGoldPerSecond = (state: GameState): number => {
  const orePerSecond = calculateOrePerSecond(state);
  const ore = getCurrentOre(state.mineDepth);
  return orePerSecond * ore.baseValue;
};

export const calculateOfflineEarnings = (
  state: GameState,
  offlineMs: number
): { gold: number; duration: number } => {
  const maxOfflineMs = 8 * 60 * 60 * 1000;
  const actualOfflineMs = Math.min(offlineMs, maxOfflineMs);
  const offlineSeconds = actualOfflineMs / 1000;

  const goldPerSecond = calculateGoldPerSecond(state);
  const offlineEfficiency = calculateOfflineEfficiency(state.logistics);

  const gold = goldPerSecond * offlineSeconds * offlineEfficiency;

  return {
    gold: Math.floor(gold),
    duration: actualOfflineMs,
  };
};

export const calculateRandomOreDrop = (depth: number): string => {
  const availableOres = getAvailableOres(depth);
  const weights = availableOres.map((_, index) => {
    return Math.pow(0.5, availableOres.length - 1 - index);
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < availableOres.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return availableOres[i].id;
    }
  }

  return availableOres[availableOres.length - 1].id;
};
