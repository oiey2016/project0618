import { create } from 'zustand';
import type {
  GameState,
  Resources,
  PlayerStatus,
  Building,
  Weapon,
  ActivePanel,
  Zombie,
} from '../types/game';
import { INITIAL_RESOURCES } from '../data/resources';
import { getBuildingConfig, getBuildingCost } from '../data/buildings';
import { getWeaponConfig } from '../data/weapons';
import { getLocationConfig } from '../data/locations';

const DAY_DURATION = 60;
const NIGHT_DURATION = 30;

const getInitialPlayer = (): PlayerStatus => ({
  health: 100,
  maxHealth: 100,
  hunger: 100,
  thirst: 100,
  baseAttack: 5,
  baseDefense: 2,
});

const getInitialBuildings = (): Building[] => [
  { id: 'shelter', level: 1 },
  { id: 'storage', level: 1 },
];

const getInitialState = (): GameState => ({
  day: 1,
  phase: 'day',
  phaseProgress: 0,
  dayDuration: DAY_DURATION,
  nightDuration: NIGHT_DURATION,
  resources: { ...INITIAL_RESOURCES },
  player: getInitialPlayer(),
  buildings: getInitialBuildings(),
  weapons: [],
  equippedWeaponId: null,
  isExploring: false,
  exploreProgress: 0,
  currentLocationId: null,
  isUnderAttack: false,
  gameOver: false,
  gameStarted: false,
  activePanel: 'none',
  battleLog: [],
  notification: null,
  showGameplay: false,
  hasSeenGameplay: false,
});

interface GameStore extends GameState {
  zombies: Zombie[];
  craftingWeapon: { weaponId: string; progress: number } | null;

  startGame: () => void;
  restartGame: () => void;
  toggleGameplay: () => void;
  closeGameplay: () => void;
  setActivePanel: (panel: ActivePanel) => void;
  addNotification: (msg: string) => void;

  tick: (deltaTime: number) => void;

  hasResources: (cost: Partial<Resources>) => boolean;
  consumeResources: (cost: Partial<Resources>) => boolean;
  addResources: (rewards: Partial<Resources>) => void;

  getBuildingLevel: (buildingId: string) => number;
  upgradeBuilding: (buildingId: string) => boolean;
  getStorageCapacity: () => number;
  getPlayerAttack: () => number;
  getPlayerDefense: () => number;

  craftWeapon: (weaponId: string) => boolean;
  equipWeapon: (weaponId: string) => void;
  getEquippedWeapon: () => Weapon | null;

  startExplore: (locationId: string) => boolean;
  cancelExplore: () => void;

  startNightAttack: () => void;
  generateZombies: (count: number, day: number) => void;
  battleTick: (deltaTime: number) => void;
  endBattle: (victory: boolean) => void;

  eatFood: () => void;
  drinkWater: () => void;
  useMedicine: () => void;

  addBattleLog: (message: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),
  zombies: [],
  craftingWeapon: null,

  startGame: () => {
    const initial = getInitialState();
    set({ ...initial, gameStarted: true, showGameplay: true });
  },

  restartGame: () => {
    const initial = getInitialState();
    set({ ...initial, gameStarted: true, showGameplay: true });
  },

  toggleGameplay: () => {
    set((state) => ({ showGameplay: !state.showGameplay, hasSeenGameplay: true }));
  },

  closeGameplay: () => {
    set({ showGameplay: false, hasSeenGameplay: true });
  },

  setActivePanel: (panel: ActivePanel) => {
    set({ activePanel: panel });
  },

  addNotification: (msg: string) => {
    set({ notification: msg });
    setTimeout(() => {
      set({ notification: null });
    }, 2500);
  },

  tick: (deltaTime: number) => {
    const state = get();
    if (state.gameOver || !state.gameStarted) return;

    if (state.phase === 'day') {
      tickDay(deltaTime);
    } else if (state.phase === 'night') {
      tickNight(deltaTime);
    }

    if (get().craftingWeapon) {
      tickCrafting(deltaTime);
    }

    if (get().isExploring) {
      tickExplore(deltaTime);
    }
  },

  hasResources: (cost: Partial<Resources>) => {
    const state = get();
    for (const [resource, amount] of Object.entries(cost)) {
      if ((state.resources[resource as keyof Resources] || 0) < (amount as number)) {
        return false;
      }
    }
    return true;
  },

  consumeResources: (cost: Partial<Resources>) => {
    const state = get();
    if (!state.hasResources(cost)) return false;

    const newResources = { ...state.resources };
    for (const [resource, amount] of Object.entries(cost)) {
      newResources[resource as keyof Resources] -= amount as number;
    }
    set({ resources: newResources });
    return true;
  },

  addResources: (rewards: Partial<Resources>) => {
    const state = get();
    const capacity = state.getStorageCapacity();
    const newResources = { ...state.resources };

    for (const [resource, amount] of Object.entries(rewards)) {
      const key = resource as keyof Resources;
      newResources[key] = Math.min(capacity, newResources[key] + (amount as number));
    }
    set({ resources: newResources });
  },

  getBuildingLevel: (buildingId: string) => {
    const building = get().buildings.find((b) => b.id === buildingId);
    return building ? building.level : 0;
  },

  upgradeBuilding: (buildingId: string) => {
    const state = get();
    const config = getBuildingConfig(buildingId);
    if (!config) return false;

    const currentLevel = state.getBuildingLevel(buildingId);
    if (currentLevel >= config.maxLevel) {
      state.addNotification('建筑已达最高等级！');
      return false;
    }

    const cost = getBuildingCost(config, currentLevel);
    if (!state.consumeResources(cost)) {
      state.addNotification('资源不足！');
      return false;
    }

    let newBuildings: Building[];
    if (currentLevel === 0) {
      newBuildings = [...state.buildings, { id: buildingId, level: 1 }];
    } else {
      newBuildings = state.buildings.map((b) =>
        b.id === buildingId ? { ...b, level: b.level + 1 } : b
      );
    }

    set({ buildings: newBuildings });

    if (buildingId === 'shelter') {
      const newMaxHealth = 100 + (currentLevel + 1) * 20;
      set((s) => ({
        player: {
          ...s.player,
          maxHealth: newMaxHealth,
          health: Math.min(s.player.health + 20, newMaxHealth),
        },
      }));
    }

    state.addNotification(`${config.name} ${currentLevel === 0 ? '建造' : '升级'}成功！`);
    return true;
  },

  getStorageCapacity: () => {
    const level = get().getBuildingLevel('storage');
    return 100 + level * 100;
  },

  getPlayerAttack: () => {
    const state = get();
    let attack = state.player.baseAttack;

    const equipped = state.getEquippedWeapon();
    if (equipped) {
      const config = getWeaponConfig(equipped.configId);
      if (config) {
        attack += config.attack;
      }
    }

    return attack;
  },

  getPlayerDefense: () => {
    const state = get();
    let defense = state.player.baseDefense;

    const shelterLevel = state.getBuildingLevel('shelter');
    defense += shelterLevel * 2;

    const wallLevel = state.getBuildingLevel('wall');
    defense += wallLevel * 5;

    const towerLevel = state.getBuildingLevel('tower');
    defense += towerLevel * 3;

    return defense;
  },

  craftWeapon: (weaponId: string) => {
    const state = get();
    const config = getWeaponConfig(weaponId);
    if (!config || config.tier === 0) return false;

    const workbenchLevel = state.getBuildingLevel('workbench');
    if (workbenchLevel < config.tier) {
      state.addNotification('需要更高级的工作台！');
      return false;
    }

    if (state.craftingWeapon) {
      state.addNotification('正在制作其他武器！');
      return false;
    }

    if (!state.consumeResources(config.cost)) {
      state.addNotification('资源不足！');
      return false;
    }

    set({ craftingWeapon: { weaponId, progress: 0 } });
    state.addNotification(`开始制作 ${config.name}...`);
    return true;
  },

  equipWeapon: (weaponId: string) => {
    const state = get();
    const weapon = state.weapons.find((w) => w.id === weaponId);
    if (!weapon) return;

    const config = getWeaponConfig(weapon.configId);
    set({ equippedWeaponId: weaponId });
    if (config) {
      state.addNotification(`装备了 ${config.name}`);
    }
  },

  getEquippedWeapon: () => {
    const state = get();
    if (!state.equippedWeaponId) return null;
    return state.weapons.find((w) => w.id === state.equippedWeaponId) || null;
  },

  startExplore: (locationId: string) => {
    const state = get();
    const config = getLocationConfig(locationId);
    if (!config) return false;

    if (state.isExploring) {
      state.addNotification('已经在探索中了！');
      return false;
    }

    if (state.phase !== 'day') {
      state.addNotification('只能在白天探索！');
      return false;
    }

    set({
      isExploring: true,
      exploreProgress: 0,
      currentLocationId: locationId,
    });
    state.addNotification(`出发前往 ${config.name}...`);
    return true;
  },

  cancelExplore: () => {
    set({
      isExploring: false,
      exploreProgress: 0,
      currentLocationId: null,
    });
    get().addNotification('探索已取消');
  },

  startNightAttack: () => {
    const state = get();
    const day = state.day;
    const zombieCount = Math.min(10, 2 + Math.floor(day / 2));

    state.generateZombies(zombieCount, day);
    set({
      isUnderAttack: true,
      battleLog: [`第 ${day} 天夜晚 - 僵尸来袭！`],
    });
  },

  generateZombies: (count: number, day: number) => {
    const zombies: Zombie[] = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let type: 'normal' | 'fast' | 'tank' = 'normal';
      let health = 20 + day * 5;
      let attack = 5 + day * 2;

      if (day >= 3 && rand < 0.2) {
        type = 'fast';
        health = 15 + day * 3;
        attack = 8 + day * 2;
      } else if (day >= 5 && rand < 0.15) {
        type = 'tank';
        health = 40 + day * 8;
        attack = 6 + day * 2;
      }

      zombies.push({
        health,
        maxHealth: health,
        attack,
        type,
      });
    }
    set({ zombies });
  },

  battleTick: (deltaTime: number) => {
    const state = get();
    if (!state.isUnderAttack || state.zombies.length === 0) return;

    const playerAttack = state.getPlayerAttack();
    const playerDefense = state.getPlayerDefense();

    const trapLevel = state.getBuildingLevel('trap');
    const trapDamage = trapLevel * 10;

    const updatedZombies = [...state.zombies];

    if (trapDamage > 0 && updatedZombies.length > 0) {
      updatedZombies[0].health -= (trapDamage * deltaTime) / 10;
      if (updatedZombies[0].health <= 0) {
        updatedZombies.shift();
        state.addBattleLog('陷阱击杀了一只僵尸！');
      }
    }

    if (updatedZombies.length > 0) {
      const damage = Math.max(1, playerAttack);
      updatedZombies[0].health -= damage * deltaTime * 0.8;

      if (updatedZombies[0].health <= 0) {
        updatedZombies.shift();
        state.addBattleLog('你击杀了一只僵尸！');

        const equipped = state.getEquippedWeapon();
        if (equipped) {
          const newDurability = equipped.durability - 1;
          if (newDurability <= 0) {
            const weaponConfig = getWeaponConfig(equipped.configId);
            set((s) => ({
              weapons: s.weapons.filter((w) => w.id !== equipped.id),
              equippedWeaponId: null,
            }));
            state.addBattleLog(`${weaponConfig?.name || '武器'}损坏了！`);
          } else {
            set((s) => ({
              weapons: s.weapons.map((w) =>
                w.id === equipped.id ? { ...w, durability: newDurability } : w
              ),
            }));
          }
        }
      }
    }

    let totalDamage = 0;
    for (const zombie of updatedZombies.slice(0, 3)) {
      totalDamage += Math.max(1, zombie.attack - playerDefense);
    }

    const newHealth = state.player.health - totalDamage * deltaTime * 0.3;

    if (newHealth <= 0) {
      set({
        player: { ...state.player, health: 0 },
        gameOver: true,
        isUnderAttack: false,
      });
      return;
    }

    set({
      player: { ...state.player, health: newHealth },
      zombies: updatedZombies,
    });

    if (updatedZombies.length === 0) {
      state.endBattle(true);
    }
  },

  endBattle: (victory: boolean) => {
    const state = get();
    if (victory) {
      state.addBattleLog('胜利！击退了所有僵尸！');
      const scrapReward = 5 + state.day * 2;
      state.addResources({ scrap: scrapReward });
      state.addBattleLog(`获得 ${scrapReward} 废料`);
    }

    setTimeout(() => {
      set((s) => ({
        isUnderAttack: false,
        phase: 'day',
        phaseProgress: 0,
        day: s.day + 1,
        zombies: [],
        battleLog: [],
      }));

      const newState = get();
      const farmLevel = newState.getBuildingLevel('farm');
      const wellLevel = newState.getBuildingLevel('well');
      const medbayLevel = newState.getBuildingLevel('medbay');

      if (farmLevel > 0) {
        newState.addResources({ food: farmLevel * 5 });
      }
      if (wellLevel > 0) {
        newState.addResources({ water: wellLevel * 5 });
      }
      if (medbayLevel > 0) {
        set((s) => ({
          player: {
            ...s.player,
            health: Math.min(s.player.maxHealth, s.player.health + medbayLevel * 10),
          },
        }));
      }

      newState.addNotification(`第 ${newState.day} 天开始了！`);
    }, 2000);
  },

  eatFood: () => {
    const state = get();
    if (state.resources.food <= 0) {
      state.addNotification('没有食物了！');
      return;
    }
    set({
      resources: { ...state.resources, food: state.resources.food - 1 },
      player: { ...state.player, hunger: Math.min(100, state.player.hunger + 20) },
    });
  },

  drinkWater: () => {
    const state = get();
    if (state.resources.water <= 0) {
      state.addNotification('没有水了！');
      return;
    }
    set({
      resources: { ...state.resources, water: state.resources.water - 1 },
      player: { ...state.player, thirst: Math.min(100, state.player.thirst + 20) },
    });
  },

  useMedicine: () => {
    const state = get();
    if (state.resources.medicine <= 0) {
      state.addNotification('没有药品了！');
      return;
    }
    set({
      resources: { ...state.resources, medicine: state.resources.medicine - 1 },
      player: {
        ...state.player,
        health: Math.min(state.player.maxHealth, state.player.health + 30),
      },
    });
    state.addNotification('使用了药品，恢复30点生命');
  },

  addBattleLog: (message: string) => {
    set((state) => ({
      battleLog: [...state.battleLog.slice(-19), message],
    }));
  },
}));

function tickDay(deltaTime: number) {
  const state = useGameStore.getState();
  const newProgress = state.phaseProgress + (deltaTime / state.dayDuration) * 100;

  if (newProgress >= 100) {
    useGameStore.setState({ phase: 'night', phaseProgress: 0 });
    state.startNightAttack();
    return;
  }

  const hungerDecrease = deltaTime * 0.5;
  const thirstDecrease = deltaTime * 0.7;

  const s = useGameStore.getState();
  let newHunger = s.player.hunger - hungerDecrease;
  let newThirst = s.player.thirst - thirstDecrease;
  let newHealth = s.player.health;

  if (newHunger <= 0 || newThirst <= 0) {
    newHealth -= deltaTime * 2;
    newHunger = Math.max(0, newHunger);
    newThirst = Math.max(0, newThirst);
  }

  if (newHealth <= 0) {
    useGameStore.setState({
      player: { ...s.player, hunger: newHunger, thirst: newThirst, health: 0 },
      gameOver: true,
    });
    return;
  }

  useGameStore.setState({
    phaseProgress: newProgress,
    player: { ...s.player, hunger: newHunger, thirst: newThirst, health: newHealth },
  });
}

function tickNight(deltaTime: number) {
  const state = useGameStore.getState();

  if (state.isUnderAttack) {
    state.battleTick(deltaTime);
    return;
  }

  const newProgress = state.phaseProgress + (deltaTime / state.nightDuration) * 100;

  if (newProgress >= 100) {
    const newDay = state.day + 1;
    const farmLevel = state.getBuildingLevel('farm');
    const wellLevel = state.getBuildingLevel('well');
    const medbayLevel = state.getBuildingLevel('medbay');

    if (farmLevel > 0) {
      state.addResources({ food: farmLevel * 5 });
    }
    if (wellLevel > 0) {
      state.addResources({ water: wellLevel * 5 });
    }

    const s = useGameStore.getState();
    useGameStore.setState({
      phase: 'day',
      phaseProgress: 0,
      day: newDay,
      player: {
        ...s.player,
        health: medbayLevel > 0
          ? Math.min(s.player.maxHealth, s.player.health + medbayLevel * 10)
          : s.player.health,
      },
    });

    useGameStore.getState().addNotification(`第 ${newDay} 天开始了！`);
  } else {
    useGameStore.setState({ phaseProgress: newProgress });
  }
}

function tickCrafting(deltaTime: number) {
  const state = useGameStore.getState();
  if (!state.craftingWeapon) return;

  const config = getWeaponConfig(state.craftingWeapon.weaponId);
  if (!config) return;

  const workbenchLevel = state.getBuildingLevel('workbench');
  const speedMultiplier = 1 + workbenchLevel * 0.2;

  const newProgress = state.craftingWeapon.progress + (deltaTime / config.craftTime) * 100 * speedMultiplier;

  if (newProgress >= 100) {
    const weaponId = `weapon_${Date.now()}`;
    const newWeapon: Weapon = {
      id: weaponId,
      configId: state.craftingWeapon.weaponId,
      durability: config.maxDurability,
    };

    const s = useGameStore.getState();
    useGameStore.setState({
      weapons: [...s.weapons, newWeapon],
      craftingWeapon: null,
    });

    useGameStore.getState().addNotification(`制作完成：${config.name}！`);
  } else {
    const s = useGameStore.getState();
    useGameStore.setState({
      craftingWeapon: s.craftingWeapon ? { ...s.craftingWeapon, progress: newProgress } : null,
    });
  }
}

function tickExplore(deltaTime: number) {
  const state = useGameStore.getState();
  if (!state.isExploring || !state.currentLocationId) return;

  const config = getLocationConfig(state.currentLocationId);
  if (!config) return;

  const towerLevel = state.getBuildingLevel('tower');
  const speedBonus = 1 + towerLevel * 0.1;

  const newProgress = state.exploreProgress + (deltaTime / config.duration) * 100 * speedBonus;

  if (newProgress >= 100) {
    const encounterChance = Math.random();
    if (encounterChance < config.zombieChance) {
      state.generateZombies(config.zombieCount, state.day);
      useGameStore.setState({
        isUnderAttack: true,
        isExploring: false,
        exploreProgress: 0,
        battleLog: [`在 ${config.name} 遭遇僵尸！`],
      });
    } else {
      const rewards: Record<string, number> = {};
      for (const [key, value] of Object.entries(config.baseRewards)) {
        if (value) {
          rewards[key] = Math.floor(value * (0.8 + Math.random() * 0.4));
        }
      }
      state.addResources(rewards);

      const rewardText = Object.entries(rewards)
        .filter(([, v]) => v && v > 0)
        .map(([k, v]) => `${v} ${k}`)
        .join(', ');

      state.addNotification(`探索成功！获得: ${rewardText}`);

      useGameStore.setState({
        isExploring: false,
        exploreProgress: 0,
        currentLocationId: null,
      });
    }
  } else {
    useGameStore.setState({ exploreProgress: newProgress });
  }
}
