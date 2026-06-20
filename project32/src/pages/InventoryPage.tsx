import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sword, Shield, Sparkles, Star, Trash2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { getEquipmentById, equipment } from '@/data/equipment';
import CoinDisplay from '@/components/CoinDisplay';
import EquipmentCard from '@/components/EquipmentCard';
import StarBackground from '@/components/StarBackground';

export default function InventoryPage() {
  const navigate = useNavigate();
  const player = usePlayerStore();
  const getTotalStats = usePlayerStore((state) => state.getTotalStats);
  const equipItem = usePlayerStore((state) => state.equipItem);
  const unequipItem = usePlayerStore((state) => state.unequipItem);
  const resetGame = usePlayerStore((state) => state.resetGame);

  const totalStats = getTotalStats();

  const expForNextLevel = player.level * 50;
  const expProgress = (player.exp / expForNextLevel) * 100;

  const equippedWeapon = player.equipment.weapon ? getEquipmentById(player.equipment.weapon) : null;
  const equippedArmor = player.equipment.armor ? getEquipmentById(player.equipment.armor) : null;
  const equippedAccessory = player.equipment.accessory
    ? getEquipmentById(player.equipment.accessory)
    : null;

  const ownedEquipment = player.inventory
    .map((id) => equipment.find((e) => e.id === id))
    .filter((e) => e !== undefined);

  const isEquipped = (equipId: string) => {
    return (
      player.equipment.weapon === equipId ||
      player.equipment.armor === equipId ||
      player.equipment.accessory === equipId
    );
  };

  const handleReset = () => {
    if (window.confirm('确定要重置游戏吗？所有进度将会丢失！')) {
      resetGame();
      navigate('/');
    }
  };

  const statItems = [
    { label: '攻击', value: totalStats.attack, base: player.attack, icon: <Sword size={18} />, color: 'text-red-400' },
    { label: '防御', value: totalStats.defense, base: player.defense, icon: <Shield size={18} />, color: 'text-blue-400' },
    { label: '幸运', value: totalStats.luck, base: player.luck, icon: <Sparkles size={18} />, color: 'text-yellow-400' },
  ];

  const equipSlots = [
    { type: 'weapon' as const, label: '武器', equip: equippedWeapon },
    { type: 'armor' as const, label: '护甲', equip: equippedArmor },
    { type: 'accessory' as const, label: '饰品', equip: equippedAccessory },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">返回</span>
          </button>
          <CoinDisplay size="md" />
        </div>

        <div className="flex-1 px-4 pb-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* 角色信息卡片 */}
            <div className="game-card mb-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* 角色头像 */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-5xl shadow-lg">
                    🧙
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
                    Lv.{player.level}
                  </div>
                </div>

                {/* 角色信息 */}
                <div className="flex-1 text-center md:text-left">
                  <h2
                    className="text-2xl font-bold text-gradient-gold mb-1"
                    style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
                  >
                    {player.name}
                  </h2>
                  <p className="text-gray-400 text-sm mb-3">勇敢的知识探险家</p>

                  {/* 经验条 */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>经验值</span>
                      <span>{player.exp} / {expForNextLevel}</span>
                    </div>
                    <div className="progress-bar h-2">
                      <div className="progress-fill" style={{ width: `${expProgress}%` }} />
                    </div>
                  </div>

                  {/* 属性 */}
                  <div className="flex justify-center md:justify-start gap-4 mt-4">
                    {statItems.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 ${stat.color} mb-1`}>
                          {stat.icon}
                        </div>
                        <div className="font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 装备槽位 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Star className="text-yellow-400" size={20} />
                已装备
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {equipSlots.map((slot) => (
                  <div
                    key={slot.type}
                    className="game-card p-4 text-center"
                  >
                    <div className="text-xs text-gray-400 mb-2">{slot.label}</div>
                    {slot.equip ? (
                      <div>
                        <div className="text-3xl mb-1">{slot.equip.emoji}</div>
                        <div className="font-bold text-sm truncate">{slot.equip.name}</div>
                        <button
                          onClick={() => unequipItem(slot.type)}
                          className="mt-2 text-xs text-red-400 hover:text-red-300"
                        >
                          卸下
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <div className="text-3xl mb-1">➕</div>
                        <div className="text-xs">空槽位</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 背包物品 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                🎒 背包 <span className="text-sm text-gray-400 font-normal">({player.inventory.length} 件)</span>
              </h3>
              {ownedEquipment.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {ownedEquipment.map((equip) => (
                    equip && (
                      <EquipmentCard
                        key={equip.id}
                        equipment={equip}
                        isOwned={true}
                        isEquipped={isEquipped(equip.id)}
                        showPrice={false}
                        showActions={true}
                        onEquip={() => equipItem(equip.id)}
                        onUnequip={() => unequipItem(equip.type)}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="game-card text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">📦</div>
                  <p>背包空空如也</p>
                  <p className="text-sm mt-1">去商店购买一些装备吧！</p>
                </div>
              )}
            </div>

            {/* 危险区域 */}
            <div className="game-card border-2 border-red-500/30">
              <h3 className="text-lg font-bold mb-3 text-red-400 flex items-center gap-2">
                <Trash2 size={20} />
                危险操作
              </h3>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl font-bold text-red-400 border-2 border-red-500/50 hover:bg-red-500/10 transition-colors"
              >
                重置游戏进度
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
