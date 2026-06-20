import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Sun, CloudRain, Snowflake, Leaf, RotateCcw } from 'lucide-react';
import { Puzzle } from '@/types/game';
import { Button } from '@/components/ui/Button';

interface SequencePuzzleProps {
  puzzle: Puzzle;
  onSolve: (answer: string[]) => boolean;
  onClose: () => void;
  onHint: () => void;
}

const seasonOptions = [
  { id: 'spring', name: '春', icon: Leaf, color: 'from-green-600 to-green-800' },
  { id: 'summer', name: '夏', icon: Sun, color: 'from-amber-500 to-orange-600' },
  { id: 'autumn', name: '秋', icon: CloudRain, color: 'from-orange-600 to-red-700' },
  { id: 'winter', name: '冬', icon: Snowflake, color: 'from-blue-400 to-blue-600' },
];

export function SequencePuzzle({ puzzle, onSolve, onClose, onHint }: SequencePuzzleProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const availableOptions = seasonOptions.filter(opt => !sequence.includes(opt.id));

  const handleSelect = (id: string) => {
    if (sequence.length < 4) {
      setSequence(prev => [...prev, id]);
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
    if (sequence.length === 4) {
      const success = onSolve(sequence);
      if (!success) {
        setError(true);
        setTimeout(() => {
          setError(false);
          setSequence([]);
        }, 800);
      }
    }
  };

  const getOptionById = (id: string) => seasonOptions.find(opt => opt.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gradient-to-br from-aged-wood to-old-brown border-4 border-rust rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl text-bone-white font-bold">书架谜题</h3>
        <button onClick={onClose} className="text-bone-white/60 hover:text-bone-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <p className="text-bone-white/70 text-sm mb-6 font-body">
        按照正确的季节顺序排列书籍
      </p>

      <motion.div
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="flex justify-center gap-3 mb-8"
      >
        {Array.from({ length: 4 }).map((_, i) => {
          const selected = sequence[i];
          const option = selected ? getOptionById(selected) : null;
          return (
            <motion.div
              key={i}
              onClick={() => selected && handleRemove(i)}
              className={`w-16 h-20 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                error
                  ? 'border-blood-red bg-blood-red/20'
                  : option
                  ? `border-moss-green bg-gradient-to-b ${option.color}`
                  : 'border-dashed border-rust/50 bg-old-brown/30'
              }`}
              whileHover={option ? { scale: 1.05 } : {}}
            >
              {option ? (
                <>
                  <option.icon className="w-6 h-6 text-bone-white mb-1" />
                  <span className="font-display text-bone-white font-bold">{option.name}</span>
                </>
              ) : (
                <span className="text-bone-white/30 text-2xl">{i + 1}</span>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <p className="text-bone-white/50 text-xs text-center mb-4">
        点击下方选项添加到序列，点击序列中的项目可移除
      </p>

      <div className="flex justify-center gap-3 mb-6">
        <AnimatePresence mode="popLayout">
          {availableOptions.map((option) => (
            <motion.button
              key={option.id}
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option.id)}
              className={`w-16 h-20 rounded-lg bg-gradient-to-b ${option.color} border-2 border-rust flex flex-col items-center justify-center transition-all hover:brightness-110`}
            >
              <option.icon className="w-6 h-6 text-bone-white mb-1" />
              <span className="font-display text-bone-white font-bold">{option.name}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

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
          disabled={sequence.length !== 4}
        >
          确认
        </Button>
      </div>
    </motion.div>
  );
}
