const STORAGE_KEY = 'xingluo_town_save';

export function saveToStorage<T>(data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

export function loadFromStorage<T>(): T | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (e) {
    console.error('Failed to load game:', e);
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportSave(): string {
  const data = localStorage.getItem(STORAGE_KEY);
  return data || '';
}

export function importSave(saveString: string): boolean {
  try {
    JSON.parse(saveString);
    localStorage.setItem(STORAGE_KEY, saveString);
    return true;
  } catch (e) {
    console.error('Failed to import save:', e);
    return false;
  }
}
