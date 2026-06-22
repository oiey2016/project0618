import { motion } from 'framer-motion';
import { Clock, Coins, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatNumber, formatTime } from '../../utils/formatter';

interface OfflineRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  rewards: {
    gold: number;
    exp: number;
    time: number;
  };
}

export function OfflineRewardsModal({
  isOpen,
  onClose,
  onClaim,
  rewards,
}: OfflineRewardsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-mint-300 to-coral-300 rounded-full flex items-center justify-center"
        >
          <Clock className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-2xl font-bold text-coffee-600 mb-2"
        >
          欢迎回来！
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-coffee-400 mb-6"
        >
          你离开了 {formatTime(rewards.time)}，冒险者们为你收集了奖励！
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-cream-100 to-cream-50 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-mono text-2xl font-bold text-coffee-600">
                  {formatNumber(rewards.gold)}
                </span>
              </div>
              <p className="text-xs text-coffee-400">金币</p>
            </div>
            
            <div className="w-px h-12 bg-cream-300" />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Sparkles className="w-5 h-5 text-lavender-500" />
                <span className="font-mono text-2xl font-bold text-coffee-600">
                  {formatNumber(rewards.exp)}
                </span>
              </div>
              <p className="text-xs text-coffee-400">经验</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button fullWidth onClick={onClaim} size="lg">
            🎁 领取奖励
          </Button>
          <Button fullWidth variant="ghost" onClick={onClose}>
            稍后再说
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}
