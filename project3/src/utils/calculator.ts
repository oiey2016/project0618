import { GameState, Hero, Skill, Upgrade } from '../types/game';

export function isSkillActive(skill: Skill): boolean {
  const now = Date.now() / 1000;
  return now - skill.lastUsed < skill.duration;
}

export function isSkillOnCooldown(skill: Skill): boolean {
  const now = Date.now() / 1000;
  return now - skill.lastUsed < skill.cooldown;
}

export function getSkillCooldownRemaining(skill: Skill): number {
  const now = Date.now() / 1000;
  const elapsed = now - skill.lastUsed;
  return Math.max(0, skill.cooldown - elapsed);
}

export function getSkillDurationRemaining(skill: Skill): number {
  const now = Date.now() / 1000;
  const elapsed = now - skill.lastUsed;
  return Math.max(0, skill.duration - elapsed);
}

export function calculateClickDamage(state: GameState): { damage: number; isCrit: boolean } {
  let damage = state.clickDamage;

  const berserk = state.skills.find(s => s.id === 'berserk');
  if (berserk && isSkillActive(berserk)) {
    damage *= Math.pow(berserk.effect.value, berserk.level);
  }

  const clickUpgrade = state.upgrades.find(u => u.id === 'click_power');
  if (clickUpgrade) {
    damage *= (1 + clickUpgrade.effectValue * clickUpgrade.level);
  }

  const critUpgrade = state.upgrades.find(u => u.id === 'crit');
  let critChance = 0.05;
  if (critUpgrade) {
    critChance += critUpgrade.effectValue * critUpgrade.level;
  }
  const critMultiplier = 2;
  const isCrit = Math.random() < critChance;
  if (isCrit) {
    damage *= critMultiplier;
  }

  return { damage: Math.floor(damage), isCrit };
}

export function calculateHeroDPS(hero: Hero, state: GameState): number {
  if (!hero.unlocked || hero.level <= 0) return 0;

  let damage = hero.baseDamage * hero.level;
  let attackSpeed = hero.attackSpeed;

  const haste = state.skills.find(s => s.id === 'haste');
  if (haste && isSkillActive(haste)) {
    attackSpeed *= Math.pow(haste.effect.value, haste.level);
  }

  const dpsUpgrade = state.upgrades.find(u => u.id === 'dps_power');
  if (dpsUpgrade) {
    damage *= (1 + dpsUpgrade.effectValue * dpsUpgrade.level);
  }

  return Math.floor(damage * attackSpeed);
}

export function calculateTotalDPS(state: GameState): number {
  let total = 0;
  state.heroes.forEach(hero => {
    total += calculateHeroDPS(hero, state);
  });

  const shadowRain = state.skills.find(s => s.id === 'shadow_rain');
  if (shadowRain && isSkillActive(shadowRain)) {
    total += state.clickDamage * shadowRain.effect.value * shadowRain.level / 100;
  }

  return total;
}

export function calculateGoldMultiplier(state: GameState): number {
  let multiplier = 1;

  const goldRush = state.skills.find(s => s.id === 'gold_rush');
  if (goldRush && isSkillActive(goldRush)) {
    multiplier *= Math.pow(goldRush.effect.value, goldRush.level);
  }

  const goldUpgrade = state.upgrades.find(u => u.id === 'gold_finder');
  if (goldUpgrade) {
    multiplier *= (1 + goldUpgrade.effectValue * goldUpgrade.level);
  }

  return multiplier;
}

export function calculateHeroCost(hero: Hero): number {
  return Math.floor(hero.baseCost * Math.pow(hero.level + 1, 1.5));
}

export function calculateUpgradeCost(upgrade: Upgrade): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.level + 1, 2));
}

export function calculateSkillCost(skill: Skill): number {
  return Math.floor(skill.baseCost * Math.pow(skill.level + 1, 1.8));
}

export function generateMonster(stage: number, index: number, monsterTypes: Array<{ type: string; name: string; emoji: string }>): {
  maxHp: number;
  goldReward: number;
  isBoss: boolean;
  type: string;
  name: string;
  emoji: string;
} {
  const isBoss = index === 9 && stage % 10 === 0;
  const baseHp = 10 * Math.pow(1.15, stage - 1);
  const hpMultiplier = isBoss ? 10 : 1;
  const maxHp = Math.floor(baseHp * hpMultiplier);
  const goldReward = Math.floor(maxHp * 0.2);

  const typeIndex = Math.floor(Math.random() * monsterTypes.length);
  const monsterType = monsterTypes[typeIndex];

  return {
    maxHp,
    goldReward,
    isBoss,
    type: monsterType.type,
    name: isBoss ? `Boss ${monsterType.name}` : monsterType.name,
    emoji: monsterType.emoji,
  };
}

export function calculateOfflineEarnings(state: GameState, offlineSeconds: number): number {
  const dps = calculateTotalDPS(state);
  const goldMultiplier = calculateGoldMultiplier(state);
  const damagePerGold = 5;
  const maxOfflineTime = 8 * 60 * 60;
  const effectiveTime = Math.min(offlineSeconds, maxOfflineTime);
  
  return Math.floor(dps * effectiveTime / damagePerGold * goldMultiplier);
}
