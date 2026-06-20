import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sword, Shield, Sparkles } from 'lucide-react';
import { equipment } from '@/data/equipment';
import { usePlayerStore } from '@/store/playerStore';
import CoinDisplay from '@/components/CoinDisplay';
import EquipmentCard from '@/components/EquipmentCard';
import StarBackground from '@/components/StarBackground';
import type { EquipmentType } from '@/types';

type TabType = 'all' | EquipmentType;

const tabs: { key: TabType; label: string; icon: JSX.Element }[] = [
  { key: 'all', label: '全部', icon: <Sparkles size={18} /> },
  { key: 'weapon', label: '武器', icon: <Sword size={18} /> },
  { key: 'armor', label: '护甲', icon: <Shield size={18} /> },
  { key: 'accessory', label: '饰品', icon: <Sparkles size={18} /> },
];

export default function ShopPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const gold = usePlayerStore((state) => state.gold);
  const inventory = usePlayerStore((state) => state.inventory);
  const buyEquipment = usePlayerStore((state) => state.buyEquipment);

  const filteredEquipment = activeTab === 'all'
    ? equipment
    : equipment.filter((e) => e.type === activeTab);

  const handleBuy = (equipmentId: string) => {
    buyEquipment(equipmentId);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">返回</span>
          </button>
          <CoinDisplay size="md" />
        </div>

        {/* 标题 */}
        <div className="text-center px-4 mb-6">
          <div className="text-4xl mb-2">🏪</div>
          <h2
            className="text-3xl font-bold text-gradient-gold text-shadow-glow"
            style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
          >
            装备商店
          </h2>
          <p className="text-gray-300 mt-2">选购强力装备，提升你的战斗力！</p>
        </div>

        {/* 分类标签 */}
        <div className="flex justify-center gap-2 px-4 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-yellow-500 text-yellow-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 商品列表 */}
        <div className="flex-1 px-4 pb-8 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEquipment.map((item) => (
                <EquipmentCard
                  key={item.id}
                  equipment={item}
                  isOwned={inventory.includes(item.id)}
                  showPrice={true}
                  showActions={true}
                  canAfford={gold >= item.price}
                  onBuy={() => handleBuy(item.id)}
                />
              ))}
            </div>

            {filteredEquipment.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">📦</div>
                <p>暂无商品</p>
              </div>
            )}
          </div>
        </div>

        {/* 底部说明 */}
        <div className="text-center p-4 text-sm text-gray-500">
          💡 提示：幸运属性可以增加答题时获得的金币数量
        </div>
      </div>
    </div>
  );
}
