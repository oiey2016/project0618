const SUFFIXES = [
  { value: 1e18, suffix: 'Qi' },
  { value: 1e15, suffix: 'Qa' },
  { value: 1e12, suffix: 'T' },
  { value: 1e9, suffix: 'B' },
  { value: 1e6, suffix: 'M' },
  { value: 1e3, suffix: 'K' },
];

export const formatNumber = (num: number): string => {
  if (num < 1000) {
    return num.toFixed(num < 10 ? 1 : 0);
  }

  for (const { value, suffix } of SUFFIXES) {
    if (num >= value) {
      const formatted = (num / value).toFixed(2);
      return `${formatted}${suffix}`;
    }
  }

  return Math.floor(num).toString();
};

export const formatGold = (gold: number): string => {
  return `💰 ${formatNumber(gold)}`;
};

export const formatOre = (ore: number): string => {
  return formatNumber(ore);
};

export const formatPerSecond = (value: number): string => {
  return `${formatNumber(value)}/s`;
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.floor(seconds)}秒`;
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}分${secs}秒`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}小时${minutes}分`;
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  return formatTime(seconds);
};
