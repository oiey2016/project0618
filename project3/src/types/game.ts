export interface SkillEffect {
  type: 'damage_multiplier' | 'gold_multiplier' | 'attack_speed' | 'damage_over_time';
  value: number;
}

export interface Hero {
  id: string;
  name: string;
  description: string;
  level: number;
  baseDamage: number;
  attackSpeed: number;
  baseCost: number;
  unlocked: boolean;
  unlockStage: number;
  icon: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  cooldown: number;
  duration: number;
  effect: SkillEffect;
  baseCost: number;
  lastUsed: number;
  icon: string;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  effectType: 'click' | 'dps' | 'gold' | 'crit';
  effectValue: number;
  baseCost: number;
  icon: string;
}

export interface Monster {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  goldReward: number;
  isBoss: boolean;
  type: string;
}

export interface DamageNumber {
  id: string;
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
}

export interface ClickEffect {
  id: string;
  x: number;
  y: number;
}

export interface GameState {
  gold: number;
  totalGold: number;
  stage: number;
  monsterIndex: number;
  clickDamage: number;
  dps: number;
  heroes: Hero[];
  skills: Skill[];
  upgrades: Upgrade[];
  monster: Monster | null;
  lastSaveTime: number;
  activeTab: 'heroes' | 'skills' | 'upgrades';
  damageNumbers: DamageNumber[];
  clickEffects: ClickEffect[];
  screenShake: number;
}

export interface SaveData {
  version: string;
  timestamp: number;
  state: Partial<GameState>;
}
