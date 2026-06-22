import type { Player, Monster } from '../types/game';

export function calculateDamage(
  attackerAttack: number,
  defenderDefense: number,
  critRate: number,
  critDamage: number
): { damage: number; isCrit: boolean } {
  const baseDamage = Math.max(1, attackerAttack - defenderDefense * 0.5);
  const variance = 0.9 + Math.random() * 0.2;
  const isCrit = Math.random() < critRate;
  const critMultiplier = isCrit ? 1 + critDamage : 1;
  const finalDamage = Math.floor(baseDamage * variance * critMultiplier);
  
  return {
    damage: Math.max(1, finalDamage),
    isCrit,
  };
}

export function calculateMonsterDamage(
  monster: Monster,
  player: Player
): number {
  const baseDamage = Math.max(1, monster.attack - player.defense * 0.5);
  const variance = 0.9 + Math.random() * 0.2;
  return Math.floor(baseDamage * variance);
}

export function calculateExpToNextLevel(currentLevel: number): number {
  const baseExp = 50;
  return Math.floor(baseExp * Math.pow(currentLevel, 1.5));
}

export function calculateLevelUpStats(level: number): Partial<Player> {
  return {
    maxHp: 10 + level * 2,
    attack: 2 + Math.floor(level * 0.5),
    defense: 1 + Math.floor(level * 0.3),
  };
}

export function calculateOfflineRewards(
  offlineMs: number,
  avgGoldPerSecond: number,
  avgExpPerSecond: number
): { gold: number; exp: number } {
  const offlineSeconds = Math.min(offlineMs / 1000, 8 * 60 * 60);
  const efficiency = 0.5;
  
  return {
    gold: Math.floor(avgGoldPerSecond * offlineSeconds * efficiency),
    exp: Math.floor(avgExpPerSecond * offlineSeconds * efficiency),
  };
}
