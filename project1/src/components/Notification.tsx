import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const Notification = () => {
  const notification = useGameStore((s) => s.notification);
  const dismissNotification = useGameStore((s) => s.dismissNotification);

  const typeConfig = {
    achievement: {
      icon: '🏆',
      bg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      text: '成就解锁！',
    },
    stage: {
      icon: '🚀',
      bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      text: '新阶段！',
    },
    offline: {
      icon: '💤',
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      text: '离线收益',
    },
  };

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          onClick={dismissNotification}
        >
          <div
            className={`${typeConfig[notification.type].bg} text-white px-8 py-4 rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce" style={{ animationDuration: '1s' }}>
                {typeConfig[notification.type].icon}
              </span>
              <div>
                <p className="font-bold text-lg">
                  {typeConfig[notification.type].text}
                </p>
                <p className="text-white/90 text-sm">{notification.message}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
