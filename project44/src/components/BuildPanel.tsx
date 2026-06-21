import { useState } from 'react';
import { X, ArrowUp, Lock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { BUILDING_CONFIGS, getBuildingCost } from '../data/buildings';
import { RESOURCE_INFO } from '../data/resources';
import type { BuildingConfig } from '../types/game';

interface BuildPanelProps {
  onClose: () => void;
}

export const BuildPanel = ({ onClose }: BuildPanelProps) => {
  const { buildings, resources, hasResources, upgradeBuilding, getBuildingLevel } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: '全部', icon: '🏗️' },
    { id: 'shelter', name: '庇护', icon: '🏠' },
    { id: 'production', name: '生产', icon: '⚙️' },
    { id: 'defense', name: '防御', icon: '🛡️' },
    { id: 'storage', name: '存储', icon: '📦' },
  ];

  const filteredBuildings = selectedCategory === 'all'
    ? BUILDING_CONFIGS
    : BUILDING_CONFIGS.filter(b => b.category === selectedCategory);

  const handleBuild = (config: BuildingConfig) => {
    upgradeBuilding(config.id);
  };

  const canBuild = (config: BuildingConfig) => {
    const currentLevel = getBuildingLevel(config.id);
    if (currentLevel >= config.maxLevel) return false;
    const cost = getBuildingCost(config, currentLevel);
    return hasResources(cost);
  };

  return (
    <div className="card-wasteland p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-rust-400 flex items-center gap-2">
          <span>🔨</span>
          <span>建造</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-wasteland-surface2 transition-colors"
        >
          <X className="w-5 h-5 text-wasteland-muted" />
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-all
              ${selectedCategory === cat.id
                ? 'bg-rust-600/30 border border-rust-500 text-rust-300'
                : 'bg-wasteland-bg border border-wasteland-border text-wasteland-muted hover:text-wasteland-text'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredBuildings.map(config => {
          const level = getBuildingLevel(config.id);
          const isMaxLevel = level >= config.maxLevel;
          const cost = getBuildingCost(config, level);
          const affordable = canBuild(config);
          const isBuilt = level > 0;

          return (
            <div
              key={config.id}
              className={`
                p-3 rounded-lg border transition-all
                ${isBuilt
                  ? 'bg-wasteland-surface border-wasteland-border'
                  : 'bg-wasteland-bg border-wasteland-border/50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-wasteland-text">{config.name}</span>
                    {isBuilt && (
                      <span className="text-xs px-1.5 py-0.5 bg-rust-600/30 text-rust-300 rounded">
                        Lv.{level}
                      </span>
                    )}
                    {isMaxLevel && (
                      <span className="text-xs px-1.5 py-0.5 bg-military-600/30 text-military-300 rounded">
                        MAX
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-wasteland-muted mt-0.5">{config.description}</p>
                  <p className="text-xs text-military-400 mt-1">
                    {config.effectPerLevel}
                  </p>

                  {!isMaxLevel && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(cost).map(([resource, amount]) => {
                        const info = RESOURCE_INFO[resource as keyof typeof RESOURCE_INFO];
                        const hasEnough = (resources[resource as keyof typeof resources] || 0) >= (amount as number);
                        return (
                          <div
                            key={resource}
                            className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
                              hasEnough ? 'bg-wasteland-bg text-wasteland-text' : 'bg-red-900/30 text-red-400'
                            }`}
                          >
                            <span>{info?.icon}</span>
                            <span>{amount}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleBuild(config)}
                  disabled={!affordable || isMaxLevel}
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-all
                    ${isMaxLevel
                      ? 'bg-wasteland-bg border border-wasteland-border text-wasteland-muted cursor-not-allowed'
                      : affordable
                        ? 'bg-military-600/30 border border-military-500 text-military-300 hover:bg-military-600/50 hover:shadow-safe-glow/30'
                        : 'bg-wasteland-bg border border-wasteland-border text-wasteland-muted cursor-not-allowed'
                    }
                  `}
                >
                  {isMaxLevel ? (
                    <><Lock className="w-4 h-4" /><span>已满级</span></>
                  ) : isBuilt ? (
                    <><ArrowUp className="w-4 h-4" /><span>升级</span></>
                  ) : (
                    <>建造</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
