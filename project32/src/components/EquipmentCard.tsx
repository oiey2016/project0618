import type { Equipment } from '@/types';
import { rarityConfig } from '@/data/equipment';
import { Sword, Shield, Sparkles } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  isOwned?: boolean;
  isEquipped?: boolean;
  showPrice?: boolean;
  showActions?: boolean;
  onBuy?: () => void;
  onEquip?: () => void;
  onUnequip?: () => void;
  canAfford?: boolean;
}

export default function EquipmentCard({
  equipment,
  isOwned = false,
  isEquipped = false,
  showPrice = true,
  showActions = true,
  onBuy,
  onEquip,
  onUnequip,
  canAfford = false,
}: EquipmentCardProps) {
  const rarity = rarityConfig[equipment.rarity];

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'attack':
        return <Sword size={14} className="text-red-400" />;
      case 'defense':
        return <Shield size={14} className="text-blue-400" />;
      case 'luck':
        return <Sparkles size={14} className="text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatLabel = (stat: string) => {
    switch (stat) {
      case 'attack':
        return '攻击';
      case 'defense':
        return '防御';
      case 'luck':
        return '幸运';
      default:
        return '';
    }
  };

  return (
    <div
      className={`game-card p-4 border-2 rarity-${equipment.rarity} transition-all duration-300 hover:scale-105 ${
        isEquipped ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-transparent' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{equipment.emoji}</div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${rarity.bgColor} ${rarity.color}`}
        >
          {rarity.label}
        </span>
      </div>

      <h3 className="font-bold text-lg mb-1">{equipment.name}</h3>
      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{equipment.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {equipment.stats.attack && (
          <div className="flex items-center gap-1 text-sm bg-white/10 px-2 py-1 rounded-full">
            {getStatIcon('attack')}
            <span>+{equipment.stats.attack}</span>
            <span className="text-gray-400 text-xs">{getStatLabel('attack')}</span>
          </div>
        )}
        {equipment.stats.defense && (
          <div className="flex items-center gap-1 text-sm bg-white/10 px-2 py-1 rounded-full">
            {getStatIcon('defense')}
            <span>+{equipment.stats.defense}</span>
            <span className="text-gray-400 text-xs">{getStatLabel('defense')}</span>
          </div>
        )}
        {equipment.stats.luck && (
          <div className="flex items-center gap-1 text-sm bg-white/10 px-2 py-1 rounded-full">
            {getStatIcon('luck')}
            <span>+{equipment.stats.luck}</span>
            <span className="text-gray-400 text-xs">{getStatLabel('luck')}</span>
          </div>
        )}
      </div>

      {showPrice && !isOwned && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-yellow-400 font-bold flex items-center gap-1">
            <span className="text-lg">💰</span>
            {equipment.price}
          </span>
        </div>
      )}

      {showActions && (
        <div className="space-y-2">
          {!isOwned && (
            <button
              onClick={onBuy}
              disabled={!canAfford}
              className={`w-full py-2 rounded-lg font-bold transition-all ${
                canAfford
                  ? 'btn-primary !py-2 !text-base'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canAfford ? '购买' : '金币不足'}
            </button>
          )}
          {isOwned && !isEquipped && (
            <button
              onClick={onEquip}
              className="w-full py-2 rounded-lg font-bold btn-success !py-2 !text-base"
            >
              装备
            </button>
          )}
          {isEquipped && (
            <button
              onClick={onUnequip}
              className="w-full py-2 rounded-lg font-bold btn-danger !py-2 !text-base"
            >
              卸下
            </button>
          )}
        </div>
      )}

      {isEquipped && !showActions && (
        <div className="text-center text-green-400 font-bold text-sm">✓ 已装备</div>
      )}
    </div>
  );
}
