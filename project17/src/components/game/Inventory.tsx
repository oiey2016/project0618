import { motion, AnimatePresence } from 'framer-motion';
import { Package, X } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { ItemSlot } from '@/components/ui/ItemSlot';

export function Inventory() {
  const { inventory, selectedItem, selectItem } = useGameStore();
  const collectedItems = inventory.filter(item => item.collected);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="bg-gradient-to-t from-old-brown via-aged-wood to-aged-wood rounded-t-2xl border-2 border-b border-0 border-rust shadow-2xl">
          <div className="flex items-center justify-between px-6 py-3 border-b border-rust">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-bone-white" />
              <span className="font-display text-bone-white font-bold">背包</span>
              <span className="text-bone-white/70 text-sm">({collectedItems.length} 件物品)</span>
            </div>
            {selectedItem && (
              <button
                onClick={() => selectItem(null)}
                className="flex items-center gap-1 text-bone-white/70 hover:text-blood-red text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                取消选择
              </button>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex gap-3 flex-wrap justify-center">
              <AnimatePresence mode="popLayout">
                {collectedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    title={item.name}
                  >
                    <ItemSlot
                      item={item}
                      selected={selectedItem?.id === item.id}
                      onClick={() => selectItem(selectedItem?.id === item.id ? null : item)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {collectedItems.length === 0 && (
                <div className="text-bone-white/65 text-sm py-8">
                  背包是空的，探索一下周围吧...
                </div>
              )}
            </div>
            
            {selectedItem && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-old-brown rounded-lg border border-rust"
              >
                <p className="text-blood-red font-bold text-sm mb-1">已选择: {selectedItem.name}</p>
                <p className="text-bone-white/90 text-xs">{selectedItem.description}</p>
                <p className="text-bone-white/65 text-xs mt-2">点击场景中的物品来使用它</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
