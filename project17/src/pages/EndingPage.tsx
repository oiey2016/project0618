import { motion } from 'framer-motion';
import { Sun, Moon, RotateCcw, Home } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { Button } from '@/components/ui/Button';

export function EndingPage() {
  const { endingType, resetGame, clues, inventory } = useGameStore();
  
  const collectedClues = clues.filter(c => c.found).length;
  const collectedItems = inventory.filter(i => i.collected).length;

  const isSuccess = endingType === 'success';

  const endingContent = isSuccess ? {
    title: '成功逃脱',
    subtitle: '你终于逃出了这座诡异的老宅',
    description: `
      当你推开大门的那一刻，清晨的阳光洒在你的脸上。
      你回头望去，那座古老的宅子在晨雾中若隐若现，
      仿佛从未存在过一样。
      
      你带走了关于这里的记忆，
      那些未解的谜团，那些悲伤的故事，
      都将永远埋藏在这座残影老宅之中...
    `,
    icon: Sun,
    iconColor: 'text-amber-400',
    bgGradient: 'from-amber-900/30 via-old-brown to-old-brown',
  } : {
    title: '未能逃脱',
    subtitle: '你永远留在了这座老宅中',
    description: `
      黑暗吞噬了一切，你感到越来越虚弱...
      恍惚中，你仿佛看到了一个身影在远处徘徊。
      也许，你将成为这座老宅新的住客。
      
      残影老宅，又多了一个永远的秘密...
    `,
    icon: Moon,
    iconColor: 'text-blood-red',
    bgGradient: 'from-blood-red/30 via-old-brown to-old-brown',
  };

  const Icon = endingContent.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${endingContent.bgGradient} flex items-center justify-center p-4 overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: isSuccess ? [0.2, 0.4, 0.2] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 ${isSuccess ? 'bg-amber-500/10' : 'bg-blood-red/20'} rounded-full blur-3xl`}
        />
        
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
        
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(26,21,16,0.7) 70%, rgba(26,21,16,1) 100%)'
        }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            animate={{ 
              y: isSuccess ? [0, -15, 0] : [0, -5, 0],
              rotate: isSuccess ? [0, 5, -5, 0] : 0,
            }}
            transition={{ duration: isSuccess ? 4 : 6, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-8"
          >
            <Icon className={`w-32 h-32 ${endingContent.iconColor} mx-auto`} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`font-display text-5xl md:text-6xl mb-4 ${isSuccess ? 'text-amber-200' : 'text-blood-red'}`}
          >
            {endingContent.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-body text-bone-white/70 text-xl mb-8"
          >
            {endingContent.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="bg-old-brown/60 backdrop-blur-sm rounded-2xl border border-rust/50 p-8 mb-8"
          >
            <p className="font-body text-bone-white/90 text-lg leading-relaxed whitespace-pre-line">
              {endingContent.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex justify-center gap-8 mb-8"
          >
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-bone-white">{collectedClues}</p>
              <p className="text-bone-white/50 text-sm">收集线索</p>
            </div>
            <div className="w-px bg-rust/30" />
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-bone-white">{collectedItems}</p>
              <p className="text-bone-white/50 text-sm">收集物品</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant={isSuccess ? 'primary' : 'wood'}
              size="lg"
              onClick={resetGame}
              className="flex items-center gap-3"
            >
              <RotateCcw className="w-5 h-5" />
              再玩一次
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={resetGame}
              className="flex items-center gap-3"
            >
              <Home className="w-5 h-5" />
              返回主页
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
