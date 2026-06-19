import { GameState, SaveData } from '../types/game';
import { SAVE_KEY } from '../data/gameData';

export function saveGame(state: GameState): void {
  try {
    const saveData: SaveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      state: {
        gold: state.gold,
        totalGold: state.totalGold,
        stage: state.stage,
        monsterIndex: state.monsterIndex,
        clickDamage: state.clickDamage,
        heroes: state.heroes,
        skills: state.skills,
        upgrades: state.upgrades,
        lastSaveTime: Date.now(),
      },
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function loadGame(): Partial<GameState> | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return null;

    const saveData: SaveData = JSON.parse(saved);
    return saveData.state;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function getOfflineSeconds(lastSaveTime: number): number {
  return (Date.now() - lastSaveTime) / 1000;
}
