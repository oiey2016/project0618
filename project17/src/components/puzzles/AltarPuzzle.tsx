import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Flame, Image, Sun, RotateCcw } from 'lucide-react';
import { Puzzle, Item } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { ItemSlot } from '@/components/ui/ItemSlot';

interface AltarPuzzleProps {
  puzzle: Puzzle;
  onSolve: (answer: string[]) => boolean;
  onClose: () => void;
  inventory: Item[];
  onHint: () => void;
}

const altarSlots = [
  { id: 'candle', name: '蜡烛槽', icon: Flame, hint: '点燃光明...' },
  { id: 'photo', name: '照片槽', icon: Image, hint: '留下思念...' },
  { id: 'matches', name: '火柴槽', icon: Sun, hint: '唤醒灵魂...' },
];

const requiredItems = ['matches', 'old-photo', 'matches'];

export function AltarPuzzle({ puzzle, onSolve, onClose, inventory, onHint }: AltarPuzzleProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const collectedItems = inventory.filter(i => i.collected && ['matches', 'old-photo', 'flashlight'].includes(i.id));

  const handleSelect = (itemId: string) => {
    if (sequence.length < 3) {
      setSequence(prev => [...prev, itemId]);
      setError(false);
    }
  };

  const handleRemove = (index: number) => {
    setSequence(prev => prev.filter((_, i) => i !== index));
    setError(false);
  };

  const handleReset = () => {
    setSequence([]);
    setError(false);
  };

  const handleSubmit = () => {
    if (sequence.length === 3) {
      const answer = sequence.map(id => {
        if (id === 'matches' && sequence.indexOf(id) === 0) return 'candle';
        if (id === 'old-photo') return 'photo';
        if (id === 'matches' && sequence.indexOf(id) === 2) return 'matches';
        return id;
      });
      const success = onSolve(answer);
      if (!success) {
        setError(true);
        setTimeout(() => {
          setError(false);
          setSequence([]);
        }, 800);
      }
    }
  };

  const getItemById = (id: string) => inventory.find(i => i.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gradient-to-br from-aged-wood to-old-brown border-4 border-rust rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl text-bone-white font-bold">神秘祭坛</h3>
        <button onClick={onClose} className="text-bone-white/60 hover:text-bone-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <p className="text-bone-white/70 text-sm mb-2 font-body text-center">
        祭坛上刻着："点燃光明，留下思念，唤醒沉睡的灵魂。"
      </p>
      <p className="text-bone-white/50 text-xs mb-6 font-body text-center">
        按正确顺序将物品放入三个凹槽中
      </p>

      <motion.div
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="flex justify-center gap-4 mb-6"
      >
        {altarSlots.map((slot, i) => {
          const selected = sequence[i];
          const item = selected ? getItemById(selected) : null;
          return (
            <motion.div
              key={slot.id}
              onClick={() => selected && handleRemove(i)}
              className={`w-20 h-24 rounded-xl border-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                error
                  ? 'border-blood-red bg-blood-red/20'
                  : item
                  ? 'border-moss-green bg-moss-green/20'
                  : 'border-dashed border-rust/50 bg-old-brown/30'
              }`}
              whileHover={item ? { scale: 1.05 } : {}}
            >
              {item ? (
                <ItemSlot item={item} selected />
              ) : (
                <>
                  <slot.icon className="w-8 h-8 text-bone-white/30 mb-1" />
                  <span className="text-bone-white/30 text-xs">{slot.hint}</span>
                </>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <p className="text-bone-white/50 text-xs text-center mb-4">
        点击下方物品添加到序列，点击凹槽中的物品可移除
      </p>

      {collectedItems.length > 0 ? (
        <div className="flex justify-center gap-3 mb-6">
          <AnimatePresence mode="popLayout">
            {collectedItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <ItemSlot
                  item={item}
                  onClick={() => handleSelect(item.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-4 mb-6 text-bone-white/50 text-sm">
          你还没有收集到可用的物品...
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
        <Button variant="secondary" className="flex-1" onClick={onHint}>
          <HelpCircle className="w-4 h-4 mr-2" />
          提示
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleSubmit}
          disabled={sequence.length !== 3}
        >
          确认
        </Button>
      </div>
    </motion.div>
  );
}
