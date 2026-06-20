import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function Notifications() {
  const { notifications, removeNotification } = useGameStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-emerald-500/10 border-green-500/30';
      case 'warning':
        return 'from-amber-500/20 to-orange-500/10 border-amber-500/30';
      case 'error':
        return 'from-red-500/20 to-rose-500/10 border-red-500/30';
      default:
        return 'from-blue-500/20 to-cyan-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ y: 60, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, delay: index * 0.05 }}
            className={`
              pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-xl
              bg-gradient-to-r border shadow-2xl max-w-md
              ${getStyles(notification.type)}
            `}
          >
            {getIcon(notification.type)}
            <p className="font-body text-white text-sm md:text-base font-medium pr-2">
              {notification.message}
            </p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-4 h-4 text-white/40" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
