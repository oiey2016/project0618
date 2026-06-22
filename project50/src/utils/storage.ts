import { Settings } from '@/game/types';

const STORAGE_KEY = 'spin-rhythm-settings';

const defaultSettings: Settings = {
  sensitivity: 1.0,
  musicVolume: 0.7,
  sfxVolume: 0.5,
  highScore: 0
};

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return { ...defaultSettings };
}

export function saveSettings(settings: Partial<Settings>): void {
  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getHighScore(): number {
  return loadSettings().highScore;
}

export function setHighScore(score: number): void {
  const current = getHighScore();
  if (score > current) {
    saveSettings({ highScore: score });
  }
}
