import { X, MapPin, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { LOCATION_CONFIGS, getLocationConfig } from '../data/locations';
import { RESOURCE_INFO } from '../data/resources';

interface ExplorePanelProps {
  onClose: () => void;
}

export const ExplorePanel = ({ onClose }: ExplorePanelProps) => {
  const { isExploring, exploreProgress, currentLocationId, startExplore, cancelExplore, phase, day } = useGameStore();

  const currentLocation = currentLocationId ? getLocationConfig(currentLocationId) : null;

  const handleExplore = (locationId: string) => {
    startExplore(locationId);
  };

  const getDangerColor = (level: number) => {
    if (level <= 2) return 'text-green-400';
    if (level <= 3) return 'text-yellow-400';
    if (level <= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getDangerBg = (level: number) => {
    if (level <= 2) return 'bg-green-900/30 border-green-700';
    if (level <= 3) return 'bg-yellow-900/30 border-yellow-700';
    if (level <= 4) return 'bg-orange-900/30 border-orange-700';
    return 'bg-red-900/30 border-red-700';
  };

  return (
    <div className="card-wasteland p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-rust-400 flex items-center gap-2">
          <span>🗺️</span>
          <span>探索</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-wasteland-surface2 transition-colors"
        >
          <X className="w-5 h-5 text-wasteland-muted" />
        </button>
      </div>

      {phase !== 'day' && !isExploring && (
        <div className="mb-3 p-3 bg-warning-900/30 border border-warning-700 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning-400" />
            <span className="text-sm text-warning-300">只能在白天外出探索</span>
          </div>
        </div>
      )}

      {isExploring && currentLocation && (
        <div className="mb-3 p-4 bg-military-900/30 border border-military-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentLocation.icon}</span>
              <div>
                <div className="font-bold text-military-300">正在探索 {currentLocation.name}</div>
                <div className="text-xs text-wasteland-muted">请稍候...</div>
              </div>
            </div>
            <button
              onClick={cancelExplore}
              className="px-3 py-1.5 bg-red-900/30 border border-red-700 text-red-400 rounded text-sm hover:bg-red-900/50 transition-colors"
            >
              取消
            </button>
          </div>
          <div className="h-3 bg-wasteland-bg rounded-full overflow-hidden border border-wasteland-border">
            <div
              className="h-full bg-gradient-to-r from-military-500 to-military-400 transition-all duration-300"
              style={{ width: `${exploreProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-wasteland-muted">
            <span>进度</span>
            <span>{Math.floor(exploreProgress)}%</span>
          </div>
        </div>
      )}

      <div className="text-sm text-wasteland-muted mb-2">
        当前第 <span className="text-rust-400 font-bold">{day}</span> 天 - 选择探索地点
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {LOCATION_CONFIGS.map(location => {
          const isCurrent = currentLocationId === location.id;
          const disabled = isExploring || phase !== 'day';

          return (
            <div
              key={location.id}
              className={`
                p-3 rounded-lg border transition-all cursor-pointer
                ${isCurrent
                  ? 'bg-military-900/40 border-military-500'
                  : disabled
                    ? 'bg-wasteland-bg/50 border-wasteland-border/50 opacity-60'
                    : 'bg-wasteland-surface border-wasteland-border hover:border-rust-600 hover:bg-wasteland-surface2'
                }
              `}
              onClick={() => !disabled && handleExplore(location.id)}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{location.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-wasteland-text">{location.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getDangerBg(location.dangerLevel)} ${getDangerColor(location.dangerLevel)}`}>
                      危险 {'★'.repeat(location.dangerLevel)}{'☆'.repeat(5 - location.dangerLevel)}
                    </span>
                  </div>
                  <p className="text-xs text-wasteland-muted mt-0.5">{location.description}</p>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-wasteland-muted">
                      <Clock className="w-3 h-3" />
                      <span>{location.duration}秒</span>
                    </div>
                    <div className="text-xs text-wasteland-muted">
                      僵尸概率: <span className="text-red-400">{Math.floor(location.zombieChance * 100)}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(location.baseRewards).map(([resource, amount]) => {
                      const info = RESOURCE_INFO[resource as keyof typeof RESOURCE_INFO];
                      if (!info) return null;
                      return (
                        <div
                          key={resource}
                          className="flex items-center gap-1 text-xs px-1.5 py-0.5 bg-wasteland-bg rounded text-wasteland-text"
                        >
                          <span>{info.icon}</span>
                          <span>+{amount}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-wasteland-muted" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
