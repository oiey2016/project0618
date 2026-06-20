import { motion } from 'framer-motion';
import { X, HelpCircle, Key, Lock } from 'lucide-react';
import { Puzzle } from '@/types/game';
import { Item } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { ItemSlot } from '@/components/ui/ItemSlot';

interface MechanismBoxProps {
  puzzle: Puzzle;
  onSolve: (answer: string[]) => boolean;
  onClose: () => void;
  inventory: Item[];
  onHint: () => void;
}

export function MechanismBox({ puzzle, onSolve, onClose, inventory, onHint }: MechanismBoxProps) {
  const requiredItemId = puzzle.requiredItem;
  const requiredItem = inventory.find(i => i.id === requiredItemId);
  const hasRequiredItem = requiredItem?.collected;

  const handleUseItem = () => {
    if (hasRequiredItem && requiredItemId) {
      onSolve([requiredItemId]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gradient-to-br from-aged-wood to-old-brown border-4 border-rust rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl text-bone-white font-bold">
          {requiredItem?.name ? `${requiredItem.name.replace(/的/g, '')}锁` : '机关锁'}
        </h3>
        <button onClick={onClose} className="text-bone-white/60 hover:text-bone-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center mb-6">
        <motion.div
          animate={{ scale: hasRequiredItem ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 mx-auto mb-4 rounded-full bg-old-brown border-4 border-rust flex items-center justify-center"
        >
          {hasRequiredItem ? (
            <Key className="w-12 h-12 text-moss-green" />
          ) : (
            <Lock className="w-12 h-12 text-blood-red" />
          )}
        </motion.div>
        
        <p className="text-bone-white/70 font-body">
          {hasRequiredItem 
            ? `你有${requiredItem?.name}，可以使用它来打开。`
            : `需要特定的物品才能打开。`
          }
        </p>
      </div>

      {hasRequiredItem && requiredItem && (
        <div className="mb-6 p-4 bg-moss-green/20 rounded-xl border border-moss-green/50">
          <p className="text-bone-white/80 text-sm mb-3 text-center">可用物品：</p>
          <div className="flex justify-center">
            <ItemSlot item={requiredItem} selected />
          </div>
        </div>
      )}

      {!hasRequiredItem && (
        <div className="mb-6 p-4 bg-blood-red/20 rounded-xl border border-blood-red/50">
          <p className="text-blood-red/80 text-sm text-center">
            你还没有找到合适的物品...
          </p>
          <p className="text-bone-white/50 text-xs text-center mt-2">
            提示：{puzzle.hint}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onHint}>
          <HelpCircle className="w-4 h-4 mr-2" />
          提示
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleUseItem}
          disabled={!hasRequiredItem}
        >
          使用物品
        </Button>
      </div>
    </motion.div>
  );
}
