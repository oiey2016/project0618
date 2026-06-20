import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { Button } from '@/components/ui/Button';

export function DialogBox() {
  const { dialogMessage, hideDialog } = useGameStore();

  return (
    <AnimatePresence>
      {dialogMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center pb-32 px-4"
          onClick={hideDialog}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <div className="bg-gradient-to-br from-aged-wood to-old-brown border-2 border-rust rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-3 bg-old-brown border-b border-rust">
                <MessageSquare className="w-5 h-5 text-blood-red" />
                <span className="font-display text-bone-white font-bold">发现</span>
                <button
                  onClick={hideDialog}
                  className="ml-auto text-bone-white/70 hover:text-bone-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="font-body text-bone-white text-lg leading-relaxed">
                  {dialogMessage}
                </p>
              </div>
              
              <div className="px-6 pb-4 flex justify-end">
                <Button variant="wood" size="sm" onClick={hideDialog}>
                  知道了
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
