import { useState } from 'react';
import { X, Sword, Crosshair, Clock, Check } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { WEAPON_CONFIGS } from '../data/weapons';
import { RESOURCE_INFO } from '../data/resources';
import type { WeaponConfig } from '../types/game';

interface CraftPanelProps {
  onClose: () => void;
}

export const CraftPanel = ({ onClose }: CraftPanelProps) => {
  const { weapons, resources, hasResources, craftWeapon, craftingWeapon, getBuildingLevel, equippedWeaponId, equipWeapon } = useGameStore();
  const [selectedType, setSelectedType] = useState<'all' | 'melee' | 'ranged'>('all');

  const workbenchLevel = getBuildingLevel('workbench');

  const filteredWeapons = WEAPON_CONFIGS.filter(w => {
    if (w.tier === 0) return false;
    if (selectedType === 'all') return true;
    return w.type === selectedType;
  });

  const canCraft = (config: WeaponConfig) => {
    if (workbenchLevel < config.tier) return false;
    if (craftingWeapon) return false;
    return hasResources(config.cost);
  };

  const isUnlocked = (config: WeaponConfig) => {
    return workbenchLevel >= config.tier;
  };

  const handleCraft = (config: WeaponConfig) => {
    craftWeapon(config.id);
  };

  const handleEquip = (weaponId: string) => {
    equipWeapon(weaponId);
  };

  return (
    <div className="card-wasteland p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-rust-400 flex items-center gap-2">
          <span>⚒️</span>
          <span>武器工坊</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-wasteland-surface2 transition-colors"
        >
          <X className="w-5 h-5 text-wasteland-muted" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="text-xs text-wasteland-muted">
          工作台等级: <span className="text-rust-400">Lv.{workbenchLevel}</span>
        </div>
        {workbenchLevel === 0 && (
          <div className="text-xs text-danger-400">需要先建造工作台</div>
        )}
      </div>

      {craftingWeapon && (
        <div className="mb-3 p-3 bg-military-900/30 border border-military-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-military-400 animate-spin" />
            <span className="text-sm text-military-300">正在制作中...</span>
          </div>
          <div className="h-2 bg-wasteland-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-military-500 transition-all"
              style={{ width: `${craftingWeapon.progress}%` }}
            />
          </div>
          <div className="text-xs text-wasteland-muted mt-1 text-right">
            {Math.floor(craftingWeapon.progress)}%
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSelectedType('all')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-all ${
            selectedType === 'all'
              ? 'bg-rust-600/30 border border-rust-500 text-rust-300'
              : 'bg-wasteland-bg border border-wasteland-border text-wasteland-muted hover:text-wasteland-text'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setSelectedType('melee')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-all ${
            selectedType === 'melee'
              ? 'bg-rust-600/30 border border-rust-500 text-rust-300'
              : 'bg-wasteland-bg border border-wasteland-border text-wasteland-muted hover:text-wasteland-text'
          }`}
        >
          <Sword className="w-4 h-4" />
          近战
        </button>
        <button
          onClick={() => setSelectedType('ranged')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-all ${
            selectedType === 'ranged'
              ? 'bg-rust-600/30 border border-rust-500 text-rust-300'
              : 'bg-wasteland-bg border border-wasteland-border text-wasteland-muted hover:text-wasteland-text'
          }`}
        >
          <Crosshair className="w-4 h-4" />
          远程
        </button>
      </div>

      {weapons.length > 0 && (
        <div className="mb-3">
          <div className="text-sm text-wasteland-muted mb-2">已拥有武器</div>
          <div className="flex flex-wrap gap-2">
            {weapons.map(weapon => {
              const config = WEAPON_CONFIGS.find(w => w.id === weapon.configId);
              if (!config) return null;
              const isEquipped = equippedWeaponId === weapon.id;
              const durabilityPercent = (weapon.durability / config.maxDurability) * 100;

              return (
                <div
                  key={weapon.id}
                  className={`p-2 rounded border cursor-pointer transition-all ${
                    isEquipped
                      ? 'bg-military-900/40 border-military-500'
                      : 'bg-wasteland-bg border-wasteland-border hover:border-rust-600'
                  }`}
                  onClick={() => handleEquip(weapon.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-wasteland-text">{config.name}</div>
                      <div className="h-1 bg-wasteland-border rounded-full w-16 overflow-hidden">
                        <div
                          className={`h-full ${durabilityPercent > 50 ? 'bg-green-500' : durabilityPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${durabilityPercent}%` }}
                        />
                      </div>
                    </div>
                    {isEquipped && <Check className="w-4 h-4 text-military-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredWeapons.map(config => {
          const unlocked = isUnlocked(config);
          const canMake = canCraft(config);

          return (
            <div
              key={config.id}
              className={`p-3 rounded-lg border transition-all ${
                unlocked
                  ? 'bg-wasteland-surface border-wasteland-border'
                  : 'bg-wasteland-bg/50 border-wasteland-border/30 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-wasteland-text">{config.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      config.type === 'melee'
                        ? 'bg-red-900/30 text-red-400'
                        : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {config.type === 'melee' ? '近战' : '远程'}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 bg-rust-900/30 text-rust-400 rounded">
                      T{config.tier}
                    </span>
                  </div>
                  <p className="text-xs text-wasteland-muted mt-0.5">{config.description}</p>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <div className="text-xs text-red-400">
                      攻击: <span className="font-bold">{config.attack}</span>
                    </div>
                    <div className="text-xs text-blue-400">
                      耐久: <span className="font-bold">{config.maxDurability}</span>
                    </div>
                    <div className="text-xs text-wasteland-muted">
                      制作: <span className="font-medium">{config.craftTime}秒</span>
                    </div>
                  </div>

                  {unlocked && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(config.cost).map(([resource, amount]) => {
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

                  {!unlocked && (
                    <p className="text-xs text-danger-400 mt-2">
                      需要工作台等级 {config.tier}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleCraft(config)}
                  disabled={!canMake}
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-all
                    ${canMake
                      ? 'bg-military-600/30 border border-military-500 text-military-300 hover:bg-military-600/50 hover:shadow-safe-glow/30'
                      : 'bg-wasteland-bg border border-wasteland-border text-wasteland-muted cursor-not-allowed'
                    }
                  `}
                >
                  制作
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
