import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Delete, HelpCircle } from 'lucide-react';
import { Puzzle } from '@/types/game';
import { Button } from '@/components/ui/Button';

interface PasswordLockProps {
  puzzle: Puzzle;
  onSolve: (answer: string) => boolean;
  onClose: () => void;
  discoveredPasswords: string[];
  onHint: () => void;
}

export function PasswordLock({ puzzle, onSolve, onClose, discoveredPasswords, onHint }: PasswordLockProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const maxLength = 4;

  const handleNumberClick = (num: string) => {
    if (input.length < maxLength) {
      setInput(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setInput(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleSubmit = () => {
    if (input.length === maxLength) {
      const success = onSolve(input);
      if (!success) {
        setError(true);
        setTimeout(() => setError(false), 500);
      }
    }
  };

  const numberPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-gradient-to-br from-aged-wood to-old-brown border-4 border-rust rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl text-bone-white font-bold">密码锁</h3>
        <button onClick={onClose} className="text-bone-white/60 hover:text-bone-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <p className="text-bone-white/85 text-sm mb-6 font-body">
        输入4位数字密码
      </p>

      <motion.div
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="flex justify-center gap-3 mb-6"
      >
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={`w-14 h-16 rounded-lg border-2 flex items-center justify-center font-mono text-3xl font-bold transition-all duration-200 ${
              error
                ? 'border-blood-red bg-blood-red/30 text-blood-red'
                : input[i]
                ? 'border-moss-green bg-moss-green/30 text-bone-white'
                : 'border-rust bg-old-brown text-bone-white/50'
            }`}
          >
            {input[i] || '•'}
          </div>
        ))}
      </motion.div>

      {discoveredPasswords.length > 0 && (
        <div className="mb-4 p-3 bg-amber-900/40 rounded-lg border border-amber-700">
          <p className="text-amber-300 text-xs font-body mb-1">已发现的密码提示：</p>
          <div className="flex gap-2">
            {discoveredPasswords.map((pwd, i) => (
              <span key={i} className="font-mono text-amber-400 font-bold">
                {pwd}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-6">
        {numberPad.map((num, index) => (
          <motion.button
            key={index}
            whileHover={num ? { scale: 1.05 } : {}}
            whileTap={num ? { scale: 0.95 } : {}}
            onClick={() => {
              if (num === 'del') handleDelete();
              else if (num) handleNumberClick(num);
            }}
            disabled={!num}
            className={`h-14 rounded-lg font-mono text-xl font-bold transition-all ${
              num
                ? 'bg-gradient-to-b from-rust to-old-brown text-bone-white border-2 border-rust hover:from-blood-red hover:to-rust active:scale-95'
                : 'bg-transparent border-transparent cursor-default'
            }`}
          >
            {num === 'del' ? <Delete className="w-6 h-6 mx-auto" /> : num}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onHint}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          提示
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleSubmit}
          disabled={input.length !== maxLength}
        >
          确认
        </Button>
      </div>
    </motion.div>
  );
}
