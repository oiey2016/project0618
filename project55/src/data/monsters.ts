import type { Monster } from '../types/game';

export interface MonsterTemplate {
  id: string;
  name: string;
  icon: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseGoldDrop: number;
  baseExpDrop: number;
  minStage: number;
  maxStage: number;
}

export const monsterTemplates: MonsterTemplate[] = [
  {
    id: 'slime',
    name: '史莱姆',
    icon: '🟢',
    baseHp: 30,
    baseAttack: 5,
    baseDefense: 2,
    baseGoldDrop: 8,
    baseExpDrop: 10,
    minStage: 1,
    maxStage: 5,
  },
  {
    id: 'goblin',
    name: '哥布林',
    icon: '👺',
    baseHp: 50,
    baseAttack: 8,
    baseDefense: 4,
    baseGoldDrop: 15,
    baseExpDrop: 18,
    minStage: 3,
    maxStage: 8,
  },
  {
    id: 'wolf',
    name: '野狼',
    icon: '🐺',
    baseHp: 70,
    baseAttack: 12,
    baseDefense: 5,
    baseGoldDrop: 25,
    baseExpDrop: 28,
    minStage: 6,
    maxStage: 12,
  },
  {
    id: 'skeleton',
    name: '骷髅兵',
    icon: '💀',
    baseHp: 90,
    baseAttack: 15,
    baseDefense: 8,
    baseGoldDrop: 38,
    baseExpDrop: 40,
    minStage: 10,
    maxStage: 16,
  },
  {
    id: 'ghost',
    name: '幽灵',
    icon: '👻',
    baseHp: 110,
    baseAttack: 20,
    baseDefense: 6,
    baseGoldDrop: 52,
    baseExpDrop: 55,
    minStage: 14,
    maxStage: 20,
  },
  {
    id: 'orc',
    name: '兽人',
    icon: '👹',
    baseHp: 150,
    baseAttack: 25,
    baseDefense: 12,
    baseGoldDrop: 70,
    baseExpDrop: 72,
    minStage: 18,
    maxStage: 25,
  },
  {
    id: 'dark_knight',
    name: '暗黑骑士',
    icon: '🤖',
    baseHp: 200,
    baseAttack: 32,
    baseDefense: 18,
    baseGoldDrop: 95,
    baseExpDrop: 98,
    minStage: 23,
    maxStage: 30,
  },
  {
    id: 'dragon',
    name: '幼龙',
    icon: '🐉',
    baseHp: 300,
    baseAttack: 45,
    baseDefense: 25,
    baseGoldDrop: 150,
    baseExpDrop: 150,
    minStage: 28,
    maxStage: 40,
  },
  {
    id: 'demon',
    name: '恶魔',
    icon: '😈',
    baseHp: 450,
    baseAttack: 60,
    baseDefense: 35,
    baseGoldDrop: 220,
    baseExpDrop: 220,
    minStage: 38,
    maxStage: 55,
  },
  {
    id: 'elder_dragon',
    name: '上古巨龙',
    icon: '🐲',
    baseHp: 800,
    baseAttack: 100,
    baseDefense: 50,
    baseGoldDrop: 500,
    baseExpDrop: 500,
    minStage: 50,
    maxStage: 100,
  },
];

export function generateMonster(stage: number): Monster {
  const available = monsterTemplates.filter(
    (m) => stage >= m.minStage && stage <= m.maxStage
  );
  
  const template = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : monsterTemplates[monsterTemplates.length - 1];
  
  const stageMultiplier = 1 + (stage - 1) * 0.12;
  const randomVariance = 0.9 + Math.random() * 0.2;
  
  const hp = Math.floor(template.baseHp * stageMultiplier * randomVariance);
  const attack = Math.floor(template.baseAttack * stageMultiplier * randomVariance);
  const defense = Math.floor(template.baseDefense * stageMultiplier * randomVariance);
  const goldDrop = Math.floor(template.baseGoldDrop * stageMultiplier * (0.8 + Math.random() * 0.4));
  const expDrop = Math.floor(template.baseExpDrop * stageMultiplier);
  
  return {
    id: `${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    icon: template.icon,
    level: stage,
    hp,
    maxHp: hp,
    attack,
    defense,
    goldDrop,
    expDrop,
  };
}
