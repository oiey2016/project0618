import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Coins, Gift } from 'lucide-react';
import { formatGold, formatDuration } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface OfflineModalProps {
  show: boolean;
  earnings: { gold: number; duration: number } | null;
  onCollect: () => void;
  onClose: () => void;
}

export const OfflineModal = ({ show, earnings, onCollect, onClose }: OfflineModalProps) => {
  if (!earnings) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-md"
          >
            <Card variant="gold" className="p-6">
              <div className="text-center">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block p-4 bg-amber-500/20 rounded-full mb-4"
                >
                  <Moon className="w-12 h-12 text-amber-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-amber-400 mb-2">
                  欢迎回来!
                </h2>
                
                <p className="text-stone-400 mb-6">
                  您离开了 {formatDuration(earnings.duration)}
                </p>

                <div className="bg-stone-800/50 rounded-xl p-4 mb-6 border border-amber-600/30">
                  <p className="text-sm text-stone-400 mb-2">离线期间收益</p>
                  <motion.div
                    key={earnings.gold}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Coins className="w-8 h-8 text-yellow-400" />
                    <span className="text-3xl font-bold text-yellow-400 font-mono">
                      {formatGold(earnings.gold)}
                    </span>
                  </motion.div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={onClose}
                    className="flex-1"
                  >
                    稍后领取
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onCollect}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Gift className="w-5 h-5" />
                    领取
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
