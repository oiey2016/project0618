import type { MinerType } from '@/types/game';

export const MINER_TYPES: MinerType[] = [
  {
    id: 'apprentice',
    name: '学徒矿工',
    emoji: '👷',
    baseCost: 10,
    baseEfficiency: 0.1,
    description: '刚入行的新手，效率不高但价格便宜',
  },
  {
    id: 'miner',
    name: '熟练矿工',
    emoji: '⛏️',
    baseCost: 100,
    baseEfficiency: 1,
    description: '有经验的矿工，挖矿效率稳定',
  },
  {
    id: 'foreman',
    name: '矿工领班',
    emoji: '🧔',
    baseCost: 1100,
    baseEfficiency: 8,
    description: '负责监督工作，效率是普通矿工的8倍',
  },
  {
    id: 'driller',
    name: '钻机操作员',
    emoji: '🤖',
    baseCost: 12000,
    baseEfficiency: 50,
    description: '操作大型钻机，大幅提升产出',
  },
  {
    id: 'engineer',
    name: '采矿工程师',
    emoji: '👨‍🔬',
    baseCost: 130000,
    baseEfficiency: 300,
    description: '运用科学方法开采，效率惊人',
  },
  {
    id: 'executive',
    name: '矿业高管',
    emoji: '👨‍💼',
    baseCost: 1400000,
    baseEfficiency: 2000,
    description: '管理整个采矿团队，带来海量收益',
  },
  {
    id: 'robot',
    name: '采矿机器人',
    emoji: '🦾',
    baseCost: 20000000,
    baseEfficiency: 15000,
    description: '全自动化采矿，不知疲倦',
  },
  {
    id: 'quantum',
    name: '量子采矿机',
    emoji: '🔮',
    baseCost: 330000000,
    baseEfficiency: 100000,
    description: '使用量子技术开采，突破物理极限',
  },
];

export const getMinerTypeById = (id: string): MinerType | undefined => {
  return MINER_TYPES.find((m) => m.id === id);
};

export const COST_MULTIPLIER = 1.15;

export const getMinerCost = (baseCost: number, count: number): number => {
  return Math.floor(baseCost * Math.pow(COST_MULTIPLIER, count));
};

export const getMinerEfficiency = (
  baseEfficiency: number,
  level: number,
  count: number
): number => {
  const levelBonus = 1 + (level - 1) * 0.5;
  return baseEfficiency * count * levelBonus;
};
