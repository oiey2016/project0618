export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toLocaleString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num < 1000000000000000) return (num / 1000000000000).toFixed(1) + 'T';
  return (num / 1000000000000000).toFixed(1) + 'Q';
};

export const formatNumberPrecise = (num: number): string => {
  if (num < 1) return num.toFixed(2);
  if (num < 1000) return Math.floor(num).toLocaleString();
  return formatNumber(num);
};

export const calculateUpgradeCost = (
  baseCost: number,
  costMultiplier: number,
  currentLevel: number
): number => {
  return Math.floor(baseCost * Math.pow(costMultiplier, currentLevel));
};

export const calculateUpgradeEffect = (
  baseEffect: number,
  currentLevel: number
): number => {
  return baseEffect * currentLevel;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  }
  return `${secs}秒`;
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
