import { create } from 'zustand';
import { GameState, Hero, Skill, Monster, DamageNumber, ClickEffect } from '../types/game';
import { HEROES, SKILLS, UPGRADES, MONSTER_TYPES, MONSTERS_PER_STAGE } from '../data/gameData';
import {
  calculateClickDamage,
  calculateTotalDPS,
  calculateGoldMultiplier,
  calculateHeroCost,
  calculateUpgradeCost,
  calculateSkillCost,
  generateMonster,
  isSkillOnCooldown,
  isSkillActive,
  calculateOfflineEarnings,
} from '../utils/calculator';
import { saveGame, loadGame, getOfflineSeconds } from '../utils/storage';
import { generateId } from '../utils/formatter';

function createInitialMonster(stage: number, monsterIndex: number): Monster {
  const data = generateMonster(stage, monsterIndex, MONSTER_TYPES);
  return {
    id: generateId(),
    name: data.name,
    maxHp: data.maxHp,
    currentHp: data.maxHp,
    goldReward: data.goldReward,
    isBoss: data.isBoss,
    type: data.type,
  };
}

function createInitialState(): GameState {
  const saved = loadGame();
  const initialMonster = createInitialMonster(saved?.stage || 1, saved?.monsterIndex || 0);

  return {
    gold: saved?.gold || 0,
    totalGold: saved?.totalGold || 0,
    stage: saved?.stage || 1,
    monsterIndex: saved?.monsterIndex || 0,
    clickDamage: saved?.clickDamage || 1,
    dps: 0,
    heroes: saved?.heroes || HEROES.map(h => ({ ...h })),
    skills: saved?.skills || SKILLS.map(s => ({ ...s })),
    upgrades: saved?.upgrades || UPGRADES.map(u => ({ ...u })),
    monster: initialMonster,
    lastSaveTime: saved?.lastSaveTime || Date.now(),
    activeTab: 'heroes',
    damageNumbers: [],
    clickEffects: [],
    screenShake: 0,
  };
}

export const useGameStore = create<GameState & {
  clickMonster: (x: number, y: number) => void;
  upgradeHero: (heroId: string) => void;
  upgradeSkill: (skillId: string) => void;
  upgradeUpgrade: (upgradeId: string) => void;
  useSkill: (skillId: string) => void;
  setActiveTab: (tab: 'heroes' | 'skills' | 'upgrades') => void;
  removeDamageNumber: (id: string) => void;
  removeClickEffect: (id: string) => void;
  save: () => void;
  tick: () => void;
  claimOfflineEarnings: () => number;
  resetGame: () => void;
  addGold: (amount: number) => void;
  setStage: (stage: number) => void;
  unlockAllHeroes: () => void;
  maxAllHeroes: () => void;
  maxAllSkills: () => void;
  maxAllUpgrades: () => void;
  debugPreset: (preset: 'early' | 'mid' | 'late') => void;
}>((set, get) => {
  const initialState = createInitialState();

  return {
    ...initialState,

    clickMonster: (x: number, y: number) => {
      const state = get();
      if (!state.monster || state.monster.currentHp <= 0) return;

      const { damage, isCrit } = calculateClickDamage(state);
      const newHp = state.monster.currentHp - damage;

      const damageNumber: DamageNumber = {
        id: generateId(),
        value: damage,
        x: x + (Math.random() - 0.5) * 40,
        y: y - 20,
        isCrit,
      };

      const clickEffect: ClickEffect = {
        id: generateId(),
        x,
        y,
      };

      if (newHp <= 0) {
        const goldMultiplier = calculateGoldMultiplier(state);
        const goldReward = Math.floor(state.monster.goldReward * goldMultiplier);

        let newMonsterIndex = state.monsterIndex + 1;
        let newStage = state.stage;

        if (newMonsterIndex >= MONSTERS_PER_STAGE) {
          newMonsterIndex = 0;
          newStage = state.stage + 1;
        }

        const updatedHeroes = state.heroes.map(hero => ({
          ...hero,
          unlocked: hero.unlocked || newStage >= hero.unlockStage,
        }));

        const newMonster = createInitialMonster(newStage, newMonsterIndex);

        set({
          gold: state.gold + goldReward,
          totalGold: state.totalGold + goldReward,
          monsterIndex: newMonsterIndex,
          stage: newStage,
          heroes: updatedHeroes,
          monster: newMonster,
          damageNumbers: [...state.damageNumbers, damageNumber],
          clickEffects: [...state.clickEffects, clickEffect],
          screenShake: state.monster?.isBoss ? 15 : 5,
        });
      } else {
        set({
          monster: {
            ...state.monster,
            currentHp: newHp,
          },
          damageNumbers: [...state.damageNumbers, damageNumber],
          clickEffects: [...state.clickEffects, clickEffect],
        });
      }
    },

    upgradeHero: (heroId: string) => {
      const state = get();
      const hero = state.heroes.find(h => h.id === heroId);
      if (!hero || !hero.unlocked) return;

      const cost = calculateHeroCost(hero);
      if (state.gold < cost) return;

      const updatedHeroes = state.heroes.map(h =>
        h.id === heroId ? { ...h, level: h.level + 1 } : h
      );

      set({
        gold: state.gold - cost,
        heroes: updatedHeroes,
      });
    },

    upgradeSkill: (skillId: string) => {
      const state = get();
      const skill = state.skills.find(s => s.id === skillId);
      if (!skill) return;

      const cost = calculateSkillCost(skill);
      if (state.gold < cost) return;

      const updatedSkills = state.skills.map(s =>
        s.id === skillId ? { ...s, level: s.level + 1 } : s
      );

      set({
        gold: state.gold - cost,
        skills: updatedSkills,
      });
    },

    upgradeUpgrade: (upgradeId: string) => {
      const state = get();
      const upgrade = state.upgrades.find(u => u.id === upgradeId);
      if (!upgrade) return;

      const cost = calculateUpgradeCost(upgrade);
      if (state.gold < cost) return;

      let clickDamage = state.clickDamage;
      const updatedUpgrades = state.upgrades.map(u => {
        if (u.id === upgradeId) {
          const newLevel = u.level + 1;
          if (u.effectType === 'click') {
            clickDamage = 1 * (1 + u.effectValue * newLevel);
          }
          return { ...u, level: newLevel };
        }
        return u;
      });

      set({
        gold: state.gold - cost,
        upgrades: updatedUpgrades,
        clickDamage,
      });
    },

    useSkill: (skillId: string) => {
      const state = get();
      const skill = state.skills.find(s => s.id === skillId);
      if (!skill || isSkillOnCooldown(skill)) return;

      const updatedSkills = state.skills.map(s =>
        s.id === skillId ? { ...s, lastUsed: Date.now() / 1000 } : s
      );

      set({
        skills: updatedSkills,
        screenShake: 10,
      });
    },

    setActiveTab: (tab: 'heroes' | 'skills' | 'upgrades') => {
      set({ activeTab: tab });
    },

    removeDamageNumber: (id: string) => {
      set(state => ({
        damageNumbers: state.damageNumbers.filter(d => d.id !== id),
      }));
    },

    removeClickEffect: (id: string) => {
      set(state => ({
        clickEffects: state.clickEffects.filter(c => c.id !== id),
      }));
    },

    save: () => {
      saveGame(get());
    },

    tick: () => {
      const state = get();
      if (!state.monster || state.monster.currentHp <= 0) {
        set({
          screenShake: Math.max(0, state.screenShake - 1),
        });
        return;
      }

      const dps = calculateTotalDPS(state);
      const damagePerTick = dps / 10;
      const newHp = state.monster.currentHp - damagePerTick;

      if (newHp <= 0) {
        const goldMultiplier = calculateGoldMultiplier(state);
        const goldReward = Math.floor(state.monster.goldReward * goldMultiplier);

        let newMonsterIndex = state.monsterIndex + 1;
        let newStage = state.stage;

        if (newMonsterIndex >= MONSTERS_PER_STAGE) {
          newMonsterIndex = 0;
          newStage = state.stage + 1;
        }

        const updatedHeroes = state.heroes.map(hero => ({
          ...hero,
          unlocked: hero.unlocked || newStage >= hero.unlockStage,
        }));

        const newMonster = createInitialMonster(newStage, newMonsterIndex);

        set({
          gold: state.gold + goldReward,
          totalGold: state.totalGold + goldReward,
          monsterIndex: newMonsterIndex,
          stage: newStage,
          heroes: updatedHeroes,
          monster: newMonster,
          dps,
          screenShake: Math.max(0, state.screenShake - 1),
        });
      } else {
        set({
          monster: {
            ...state.monster,
            currentHp: newHp,
          },
          dps,
          screenShake: Math.max(0, state.screenShake - 1),
        });
      }
    },

    claimOfflineEarnings: () => {
      const state = get();
      const offlineSeconds = getOfflineSeconds(state.lastSaveTime);
      const earnings = calculateOfflineEarnings(state, offlineSeconds);

      if (earnings > 0) {
        set({
          gold: state.gold + earnings,
          totalGold: state.totalGold + earnings,
          lastSaveTime: Date.now(),
        });
      }

      return earnings;
    },

    resetGame: () => {
      const newMonster = createInitialMonster(1, 0);
      set({
        gold: 0,
        totalGold: 0,
        stage: 1,
        monsterIndex: 0,
        clickDamage: 1,
        dps: 0,
        heroes: HEROES.map(h => ({ ...h })),
        skills: SKILLS.map(s => ({ ...s })),
        upgrades: UPGRADES.map(u => ({ ...u })),
        monster: newMonster,
        lastSaveTime: Date.now(),
        damageNumbers: [],
        clickEffects: [],
        screenShake: 0,
      });
    },

    addGold: (amount: number) => {
      const state = get();
      set({
        gold: state.gold + amount,
        totalGold: state.totalGold + amount,
      });
    },

    setStage: (stage: number) => {
      const state = get();
      const safeStage = Math.max(1, Math.floor(stage));
      const newMonster = createInitialMonster(safeStage, 0);
      const updatedHeroes = state.heroes.map(hero => ({
        ...hero,
        unlocked: hero.unlocked || safeStage >= hero.unlockStage,
      }));
      set({
        stage: safeStage,
        monsterIndex: 0,
        monster: newMonster,
        heroes: updatedHeroes,
      });
    },

    unlockAllHeroes: () => {
      const state = get();
      const updatedHeroes = state.heroes.map(hero => ({
        ...hero,
        unlocked: true,
      }));
      set({ heroes: updatedHeroes });
    },

    maxAllHeroes: () => {
      const state = get();
      const updatedHeroes = state.heroes.map(hero => ({
        ...hero,
        unlocked: true,
        level: hero.level + 50,
      }));
      set({ heroes: updatedHeroes });
    },

    maxAllSkills: () => {
      const state = get();
      const updatedSkills = state.skills.map(skill => ({
        ...skill,
        level: skill.level + 20,
      }));
      set({ skills: updatedSkills });
    },

    maxAllUpgrades: () => {
      const state = get();
      let clickDamage = state.clickDamage;
      const updatedUpgrades = state.upgrades.map(u => {
        const newLevel = u.level + 50;
        if (u.effectType === 'click') {
          clickDamage = 1 * (1 + u.effectValue * newLevel);
        }
        return { ...u, level: newLevel };
      });
      set({ upgrades: updatedUpgrades, clickDamage });
    },

    debugPreset: (preset: 'early' | 'mid' | 'late') => {
      const baseHeroes = HEROES.map(h => ({ ...h }));
      let gold: number, stage: number, heroes: typeof baseHeroes, skills: typeof SKILLS, upgrades: typeof UPGRADES, clickDamage: number;

      if (preset === 'early') {
        gold = 1000;
        stage = 5;
        heroes = baseHeroes.map(h => ({
          ...h,
          unlocked: h.unlockStage <= stage,
          level: h.unlockStage <= stage ? 10 : 0,
        }));
        skills = SKILLS.map(s => ({ ...s, level: 1 }));
        upgrades = UPGRADES.map(u => ({ ...u, level: 5 }));
        clickDamage = 50;
      } else if (preset === 'mid') {
        gold = 500000;
        stage = 30;
        heroes = baseHeroes.map(h => ({
          ...h,
          unlocked: h.unlockStage <= stage,
          level: h.unlockStage <= stage ? 50 : 0,
        }));
        skills = SKILLS.map(s => ({ ...s, level: 10 }));
        upgrades = UPGRADES.map(u => ({ ...u, level: 30 }));
        clickDamage = 5000;
      } else {
        gold = 1000000000;
        stage = 100;
        heroes = baseHeroes.map(h => ({
          ...h,
          unlocked: true,
          level: 200,
        }));
        skills = SKILLS.map(s => ({ ...s, level: 50 }));
        upgrades = UPGRADES.map(u => ({ ...u, level: 100 }));
        clickDamage = 500000;
      }

      const newMonster = createInitialMonster(stage, 0);

      set({
        gold,
        totalGold: gold,
        stage,
        monsterIndex: 0,
        clickDamage,
        heroes,
        skills,
        upgrades,
        monster: newMonster,
        dps: 0,
        damageNumbers: [],
        clickEffects: [],
        screenShake: 0,
        lastSaveTime: Date.now(),
      });
    },
  };
});

export function getMonsterEmoji(type: string): string {
  const found = MONSTER_TYPES.find(m => m.type === type);
  return found?.emoji || '👾';
}

export function isAnySkillActive(skills: Skill[]): boolean {
  return skills.some(s => isSkillActive(s));
}
