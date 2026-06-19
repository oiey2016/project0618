import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Users, Truck, ArrowDown } from 'lucide-react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useOfflineEarnings } from '@/hooks/useOfflineEarnings';
import { ResourceBar } from '@/components/game/ResourceBar';
import { MineShaft } from '@/components/game/MineShaft';
import { MinerPanel } from '@/components/game/MinerPanel';
import { LogisticsPanel } from '@/components/game/LogisticsPanel';
import { OfflineModal } from '@/components/game/OfflineModal';
import { TabPanel } from '@/components/ui/TabPanel';
import { Card } from '@/components/ui/Card';
import { getMineDepthCost } from '@/data/upgrades';
import { useGameStore } from '@/store/useGameStore';
import { saveGame } from '@/utils/storage';
import { formatGold } from '@/utils/formatters';
import type { TabType } from '@/types/game';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('miners');

  useGameLoop();
  const { showModal, earnings, handleCollect, closeModal } = useOfflineEarnings();

  const gold = useGameStore((state) => state.gold);
  const mineDepth = useGameStore((state) => state.mineDepth);
  const upgradeMineDepth = useGameStore((state) => state.upgradeMineDepth);

  const upgradeCost = getMineDepthCost(mineDepth);
  const canUpgrade = gold >= upgradeCost;

  const tabs = [
    { id: 'miners' as TabType, label: '矿工', icon: <Users className="w-4 h-4" /> },
    { id: 'logistics' as TabType, label: '物流', icon: <Truck className="w-4 h-4" /> },
    { id: 'upgrades' as TabType, label: '升级', icon: <ArrowDown className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame(useGameStore.getState());
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      <ResourceBar />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 h-[calc(100vh-160px)] min-h-[500px]"
          >
            <MineShaft />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-4 h-[calc(100vh-160px)] min-h-[500px]"
          >
            <TabPanel
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'miners' && (
                  <motion.div
                    key="miners"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MinerPanel />
                  </motion.div>
                )}
                {activeTab === 'logistics' && (
                  <motion.div
                    key="logistics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LogisticsPanel />
                  </motion.div>
                )}
                {activeTab === 'upgrades' && (
                  <motion.div
                    key="upgrades"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Card variant="gold" className="p-4">
                      <h3 className="font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <ArrowDown className="w-5 h-5" />
                        矿井深挖
                      </h3>
                      <p className="text-sm text-stone-400 mb-4">
                        深挖矿井可以解锁更有价值的矿石类型，提升每次点击的收益。
                      </p>
                      <div className="bg-stone-800/50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-stone-400">当前深度</span>
                          <span className="text-white font-bold">第 {mineDepth} 层</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-400">升级费用</span>
                          <span className="text-amber-400 font-bold">{formatGold(upgradeCost)}</span>
                        </div>
                      </div>
                      <button
                        onClick={upgradeMineDepth}
                        disabled={!canUpgrade}
                        className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                          canUpgrade
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <ArrowDown className="w-5 h-5" />
                        深挖矿井
                      </button>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-bold text-white mb-3">💡 游戏提示</h3>
                      <ul className="text-sm text-stone-400 space-y-2">
                        <li>• 点击矿井区域手动挖矿获取矿石</li>
                        <li>• 招募矿工实现自动挖矿</li>
                        <li>• 升级物流系统提升运输和存储效率</li>
                        <li>• 解锁自动售卖后矿石会自动转换为金币</li>
                        <li>• 离线时也能获得收益，记得常回来看看</li>
                        <li>• 游戏速度可以调节，最快3倍速</li>
                      </ul>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      <OfflineModal
        show={showModal}
        earnings={earnings}
        onCollect={handleCollect}
        onClose={closeModal}
      />
    </div>
  );
}
