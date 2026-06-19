import { X, HelpCircle, MousePointerClick, Hand, Sparkles, BookOpen, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const rules = [
  {
    icon: MousePointerClick,
    color: 'text-life-400',
    bg: 'bg-life-500/15',
    title: '点击创造',
    desc: '点击屏幕空白处，创造最基本的生命——夸克 ✨',
  },
  {
    icon: Hand,
    color: 'text-ocean-400',
    bg: 'bg-ocean-500/15',
    title: '拖拽合成',
    desc: '将两个相同的生命拖拽到一起，合成更高级的形态',
  },
  {
    icon: Sparkles,
    color: 'text-divine-400',
    bg: 'bg-divine-500/15',
    title: '奇迹进化',
    desc: '每次合成有 5% 概率触发奇迹，直接跨越两级进化！',
  },
  {
    icon: BookOpen,
    color: 'text-nebula-500',
    bg: 'bg-purple-500/15',
    title: '收集图鉴',
    desc: '解锁全部 36 种物种，从夸克到新维度，见证整个进化历程',
  },
  {
    icon: Star,
    color: 'text-civilization-400',
    bg: 'bg-civilization-500/15',
    title: '稀有度等级',
    desc: '普通（绿色光晕）→ 稀有（蓝色光晕）→ 传说（金色脉冲光晕）',
  },
];

const stages = [
  { emoji: '🌌', name: '宇宙尘埃' },
  { emoji: '🧬', name: '生命起源' },
  { emoji: '🔬', name: '微观世界' },
  { emoji: '🧽', name: '多细胞' },
  { emoji: '🐟', name: '海洋生物' },
  { emoji: '🦎', name: '登陆时代' },
  { emoji: '🦕', name: '恐龙时代' },
  { emoji: '🐘', name: '哺乳动物' },
  { emoji: '👑', name: '人类文明' },
  { emoji: '🏙️', name: '现代社会' },
  { emoji: '🚀', name: '星际时代' },
  { emoji: '♾️', name: '神级文明' },
];

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-panel max-w-lg w-full max-h-[85vh] overflow-y-auto scrollbar-thin pointer-events-auto p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 glass-panel rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-divine-500/20 flex items-center justify-center">
                    <HelpCircle size={20} className="text-divine-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl text-divine-400">游戏规则</h2>
                    <p className="text-white/40 text-xs">简单三步，创造万物</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={18} className="text-white/70" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {rules.map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <div className={`w-9 h-9 rounded-lg ${rule.bg} flex items-center justify-center shrink-0`}>
                      <rule.icon size={18} className={rule.color} />
                    </div>
                    <div>
                      <h3 className={`font-medium text-sm ${rule.color}`}>{rule.title}</h3>
                      <p className="text-white/60 text-sm mt-0.5 leading-relaxed">{rule.desc}</p>
                    </div>
                  </motion.div>
                ))}

                <div className="mt-6 pt-4 border-t border-white/10">
                  <h3 className="font-display text-base text-divine-300 mb-3">进化历程</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {stages.map((stage, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.03 }}
                        className="flex items-center gap-1.5 p-2 rounded-lg bg-white/[0.03] text-xs text-white/60"
                      >
                        <span className="text-base">{stage.emoji}</span>
                        <span className="truncate">{stage.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-divine-500/10 border border-divine-500/20 text-center">
                  <p className="text-divine-300 text-sm font-display">
                    没有胜负，没有竞争
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    放松心情，享受创造的乐趣 🌟
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
