import { useGameStore } from '../store/useGameStore';
import { RESOURCE_INFO } from '../data/resources';
import type { Resources } from '../types/game';

export const ResourcePanel = () => {
  const { resources, getStorageCapacity } = useGameStore();
  const capacity = getStorageCapacity();

  const resourceKeys = Object.keys(RESOURCE_INFO) as (keyof Resources)[];

  return (
    <div className="card-wasteland p-3">
      <div className="text-sm font-bold text-rust-400 mb-2 flex items-center gap-2">
        <span>📦</span>
        <span>资源</span>
        <span className="text-xs text-wasteland-muted ml-auto">
          容量: {capacity}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {resourceKeys.map((key) => {
          const info = RESOURCE_INFO[key];
          const amount = Math.floor(resources[key]);
          const isLow = amount < 10;

          return (
            <div
              key={key}
              className={`flex items-center gap-2 px-2 py-1.5 bg-wasteland-bg rounded border border-wasteland-border transition-all ${
                isLow ? 'border-danger-600/50 animate-pulse' : ''
              }`}
              title={`${info.name}: ${amount}`}
            >
              <span className="text-lg">{info.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-wasteland-muted">{info.name}</div>
                <div className={`text-sm font-bold ${isLow ? 'text-danger-400' : 'text-wasteland-text'}`}>
                  {amount}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
