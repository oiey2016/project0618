import { X, Heart, Utensils, Droplets, Pill, Swords, Shield, Check } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { WEAPON_CONFIGS } from '../data/weapons';

interface InventoryPanelProps {
  onClose: () => void;
}

export const InventoryPanel = ({ onClose }: InventoryPanelProps) => {
  const {
    player,
    weapons,
    equippedWeaponId,
    resources,
    equipWeapon,
    eatFood,
    drinkWater,
    useMedicine,
    getPlayerAttack,
    getPlayerDefense,
    getStorageCapacity,
  } = useGameStore();

  const equippedWeapon = weapons.find(w => w.id === equippedWeaponId);
  const equippedConfig = equippedWeapon ? WEAPON_CONFIGS.find(w => w.id === equippedWeapon.configId) : null;

  return (
    <div className="card-wasteland p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-rust-400 flex items-center gap-2">
          <span>🎒</span>
          <span>背包</span>
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-wasteland-surface2 transition-colors"
        >
          <X className="w-5 h-5 text-wasteland-muted" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-wasteland-bg rounded-lg border border-wasteland-border">
          <div className="text-sm text-wasteland-muted mb-1">角色属性</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm text-wasteland-text">
                生命: <span className="font-bold">{Math.floor(player.health)}/{player.maxHealth}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-wasteland-text">
                饥饿: <span className="font-bold">{Math.floor(player.hunger)}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-wasteland-text">
                口渴: <span className="font-bold">{Math.floor(player.thirst)}%</span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-wasteland-bg rounded-lg border border-wasteland-border">
          <div className="text-sm text-wasteland-muted mb-1">战斗属性</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-red-400" />
              <span className="text-sm text-wasteland-text">
                攻击: <span className="font-bold text-red-400">{getPlayerAttack()}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-wasteland-text">
                防御: <span className="font-bold text-blue-400">{getPlayerDefense()}</span>
              </span>
            </div>
            <div className="text-xs text-wasteland-muted mt-1">
              武器: {equippedConfig ? equippedConfig.name : '赤手空拳'}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-wasteland-muted mb-2">快速使用</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={eatFood}
            disabled={resources.food <= 0}
            className={`
              p-3 rounded-lg border transition-all flex flex-col items-center gap-1
              ${resources.food > 0
                ? 'bg-wasteland-surface border-wasteland-border hover:border-amber-600 hover:bg-wasteland-surface2'
                : 'bg-wasteland-bg border-wasteland-border/50 opacity-50 cursor-not-allowed'
              }
            `}
          >
            <span className="text-2xl">🍖</span>
            <span className="text-xs text-wasteland-text">吃食物</span>
            <span className="text-xs text-amber-400">x{resources.food}</span>
          </button>

          <button
            onClick={drinkWater}
            disabled={resources.water <= 0}
            className={`
              p-3 rounded-lg border transition-all flex flex-col items-center gap-1
              ${resources.water > 0
                ? 'bg-wasteland-surface border-wasteland-border hover:border-blue-600 hover:bg-wasteland-surface2'
                : 'bg-wasteland-bg border-wasteland-border/50 opacity-50 cursor-not-allowed'
              }
            `}
          >
            <span className="text-2xl">💧</span>
            <span className="text-xs text-wasteland-text">喝水</span>
            <span className="text-xs text-blue-400">x{resources.water}</span>
          </button>

          <button
            onClick={useMedicine}
            disabled={resources.medicine <= 0}
            className={`
              p-3 rounded-lg border transition-all flex flex-col items-center gap-1
              ${resources.medicine > 0
                ? 'bg-wasteland-surface border-wasteland-border hover:border-green-600 hover:bg-wasteland-surface2'
                : 'bg-wasteland-bg border-wasteland-border/50 opacity-50 cursor-not-allowed'
              }
            `}
          >
            <span className="text-2xl">💊</span>
            <span className="text-xs text-wasteland-text">使用药品</span>
            <span className="text-xs text-green-400">x{resources.medicine}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="text-sm text-wasteland-muted mb-2">武器列表</div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {weapons.length === 0 ? (
            <div className="text-center py-8 text-wasteland-muted">
              <p className="text-3xl mb-2">🔧</p>
              <p className="text-sm">还没有武器，去制作一些吧！</p>
            </div>
          ) : (
            weapons.map(weapon => {
              const config = WEAPON_CONFIGS.find(w => w.id === weapon.configId);
              if (!config) return null;
              const isEquipped = equippedWeaponId === weapon.id;
              const durabilityPercent = (weapon.durability / config.maxDurability) * 100;

              return (
                <div
                  key={weapon.id}
                  className={`
                    p-3 rounded-lg border transition-all cursor-pointer
                    ${isEquipped
                      ? 'bg-military-900/40 border-military-500'
                      : 'bg-wasteland-surface border-wasteland-border hover:border-rust-600'
                    }
                  `}
                  onClick={() => !isEquipped && equipWeapon(weapon.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{config.icon}</div>
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
                        {isEquipped && (
                          <span className="text-xs px-1.5 py-0.5 bg-military-600/30 text-military-300 rounded flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            已装备
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-red-400">攻击: {config.attack}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-wasteland-bg rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                durabilityPercent > 50 ? 'bg-green-500' : durabilityPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${durabilityPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-wasteland-muted">
                            {weapon.durability}/{config.maxDurability}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-wasteland-border">
        <div className="text-xs text-wasteland-muted text-center">
          存储容量: {Math.floor(Object.values(resources).reduce((a, b) => a + b, 0))} / {getStorageCapacity()}
        </div>
      </div>
    </div>
  );
};
