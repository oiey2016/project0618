import type { Resources } from '../types/game';

export const RESOURCE_INFO: Record<keyof Resources, { name: string; icon: string; color: string }> = {
  wood: { name: '木材', icon: '🪵', color: 'text-amber-600' },
  stone: { name: '石头', icon: '🪨', color: 'text-gray-400' },
  metal: { name: '金属', icon: '⚙️', color: 'text-slate-300' },
  food: { name: '食物', icon: '🍖', color: 'text-red-400' },
  water: { name: '水', icon: '💧', color: 'text-blue-400' },
  medicine: { name: '药品', icon: '💊', color: 'text-green-400' },
  scrap: { name: '废料', icon: '🔩', color: 'text-yellow-600' },
};

export const INITIAL_RESOURCES: Resources = {
  wood: 50,
  stone: 30,
  metal: 10,
  food: 30,
  water: 30,
  medicine: 5,
  scrap: 20,
};
