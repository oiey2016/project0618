import { motion } from 'framer-motion';
import { Ghost, Play, Info, X } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { Button } from '@/components/ui/Button';

export function StartPage() {
  const { startGame } = useGameStore();
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen bg-old-brown flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blood-red/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-moss-green/10 rounded-full blur-3xl"
        />
        
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
        
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(26,21,16,0.4) 70%, rgba(26,21,16,0.6) 100%)'
        }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-8"
          >
            <Ghost className="w-24 h-24 text-blood-red mx-auto mb-4 opacity-80" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-display text-6xl md:text-7xl text-bone-white mb-4 tracking-wider"
          >
            残影老宅
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="font-body text-bone-white/85 text-lg mb-12 max-w-md mx-auto"
          >
            你在一座废弃的老宅中醒来，门被紧紧锁住。
            <br />
            收集线索，解开谜题，拼凑真相，找到逃离的方法。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={startGame}
              className="group flex items-center gap-3 px-12 py-5 text-xl"
            >
              <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              开始探索
            </Button>
            
            <Button
              variant="wood"
              size="lg"
              onClick={() => setShowRules(true)}
              className="flex items-center gap-3"
            >
              <Info className="w-5 h-5" />
              游戏说明
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 text-bone-white/55 text-sm font-body"
          >
            提示：恐怖程度为"微恐"，请放心游玩
          </motion.p>
        </motion.div>
      </div>

      {showRules && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-old-brown/95 p-4"
          onClick={() => setShowRules(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-aged-wood to-old-brown border-4 border-rust rounded-2xl p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-3xl text-bone-white font-bold">游戏说明</h3>
              <button
                onClick={() => setShowRules(false)}
                className="text-bone-white/60 hover:text-bone-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-bone-white/90 font-body">
              <div className="flex items-start gap-3">
                <span className="text-blood-red font-bold text-xl">1.</span>
                <p><strong className="text-bone-white">探索场景</strong>：点击场景中发光的物品进行互动，收集线索和道具。</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blood-red font-bold text-xl">2.</span>
                <p><strong className="text-bone-white">使用物品</strong>：点击背包中的物品选中它，然后点击场景中的目标使用。</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blood-red font-bold text-xl">3.</span>
                <p><strong className="text-bone-white">解开谜题</strong>：找到密码或正确的物品，解锁新的区域和线索。</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blood-red font-bold text-xl">4.</span>
                <p><strong className="text-bone-white">关联线索</strong>：打开线索墙，将相关的线索进行关联，发现隐藏的真相。</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blood-red font-bold text-xl">5.</span>
                <p><strong className="text-bone-white">逃离老宅</strong>：解开所有谜题，找到大门钥匙，成功逃脱！</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-moss-green/20 rounded-xl border border-moss-green/50">
              <p className="text-moss-green text-sm font-body">
                💡 如果卡住了，可以点击右上角的"提示"按钮获得帮助。
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="wood" onClick={() => setShowRules(false)}>
                知道了
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
