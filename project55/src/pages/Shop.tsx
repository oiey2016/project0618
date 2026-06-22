import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coins, Package, Clock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { items } from '../data/items';
import { formatNumber, formatTimeShort } from '../utils/formatter';
import type { Item } from '../types/game';

export default function ShopPage() {
  const { gold, inventory, activeBuffs, buyItem, useItem } = useGameStore();
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  
  const getItemQuantity = (itemId: string) => {
    const invItem = inventory.find((i) => i.itemId === itemId);
    return invItem?.quantity || 0;
  };
  
  const getActiveBuff = (itemId: string) => {
    return activeBuffs.find((b) => b.itemId === itemId);
  };
  
  const handleBuy = (item: Item) => {
    if (gold < item.price) return;
    
    setPurchasingId(item.id);
    setTimeout(() => {
      buyItem(item.id);
      setPurchasingId(null);
    }, 200);
  };
  
  const handleUse = (item: Item) => {
    if (getItemQuantity(item.id) <= 0) return;
    useItem(item.id);
  };
  
  const typeLabels: Record<Item['type'], string> = {
    consumable: '消耗品',
    buff: '增益',
    upgrade: '道具',
  };
  
  const typeColors: Record<Item['type'], string> = {
    consumable: 'bg-mint-100 text-mint-600',
    buff: 'bg-lavender-100 text-lavender-500',
    upgrade: 'bg-coral-100 text-coral-600',
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="space-y-4">
      <Card gradient>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-coffee-600 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-coral-500" />
            冒险商店
          </h2>
          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-mono font-bold text-coffee-600">
              {formatNumber(gold)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'shop'
                ? 'bg-mint-400 text-white shadow-md'
                : 'bg-cream-100 text-coffee-400 hover:bg-cream-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-1" />
            商店
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'inventory'
                ? 'bg-mint-400 text-white shadow-md'
                : 'bg-cream-100 text-coffee-400 hover:bg-cream-200'
            }`}
          >
            <Package className="w-4 h-4 inline mr-1" />
            背包
            {inventory.length > 0 && (
              <span className="ml-1 bg-coral-400 text-white text-xs px-1.5 py-0.5 rounded-full">
                {inventory.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'shop' ? (
            <motion.div
              key="shop"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {items.map((item) => {
                const canAfford = gold >= item.price;
                const isPurchasing = purchasingId === item.id;
                const quantity = getItemQuantity(item.id);
                const activeBuff = getActiveBuff(item.id);
                
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-cream-100 to-cream-200 rounded-xl flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-coffee-600 truncate">{item.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                          {typeLabels[item.type]}
                        </span>
                      </div>
                      <p className="text-xs text-coffee-400 line-clamp-2">{item.description}</p>
                      {activeBuff && (
                        <p className="text-xs text-lavender-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          剩余 {formatTimeShort(activeBuff.endTime - Date.now())}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {quantity > 0 && (
                        <span className="text-xs text-coffee-400">
                          持有: {quantity}
                        </span>
                      )}
                      <Button
                        size="sm"
                        disabled={!canAfford || isPurchasing}
                        onClick={() => handleBuy(item)}
                        className="flex items-center gap-1 text-sm"
                      >
                        <Coins className="w-3.5 h-3.5 text-yellow-300" />
                        {formatNumber(item.price)}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="inventory"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {inventory.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-cream-300 mb-3" />
                  <p className="text-coffee-400">背包空空如也</p>
                  <p className="text-sm text-coffee-300">去商店购买一些道具吧！</p>
                </div>
              ) : (
                inventory.map((invItem) => {
                  const item = items.find((i) => i.id === invItem.itemId);
                  if (!item) return null;
                  
                  const activeBuff = getActiveBuff(item.id);
                  
                  return (
                    <motion.div
                      key={invItem.itemId}
                      variants={itemVariants}
                      className="bg-white rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-cream-100 to-cream-200 rounded-xl flex items-center justify-center text-3xl">
                          {item.icon}
                        </div>
                        <span className="absolute -top-1 -right-1 bg-coral-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {invItem.quantity}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-coffee-600 truncate">{item.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                            {typeLabels[item.type]}
                          </span>
                        </div>
                        <p className="text-xs text-coffee-400 line-clamp-2">{item.description}</p>
                        {activeBuff && (
                          <p className="text-xs text-lavender-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            剩余 {formatTimeShort(activeBuff.endTime - Date.now())}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleUse(item)}
                        variant="secondary"
                      >
                        使用
                      </Button>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
