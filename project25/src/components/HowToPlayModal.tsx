import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer2, RotateCcw, Play, Trash2, Layers } from 'lucide-react';
import { BLOCKS_INFO } from '@/data/blocks';
import { BlockType } from '@/types';

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: <Layers size={28} />,
    title: '选择积木',
    desc: '从底部工具箱点击想要使用的积木，右上角数字显示剩余数量',
    color: 'from-peach-100 to-peach-200',
    iconColor: 'text-peach-500',
  },
  {
    icon: <MousePointer2 size={28} />,
    title: '点击放置',
    desc: '在画布上点击鼠标，积木会放置在鼠标位置',
    color: 'from-sky-light to-sky-soft',
    iconColor: 'text-sky-600',
  },
  {
    icon: <RotateCcw size={28} />,
    title: '滚轮旋转',
    desc: '放置前滚动鼠标滚轮可以旋转积木角度',
    color: 'from-mint-light to-mint-soft',
    iconColor: 'text-mint-600',
  },
  {
    icon: <Trash2 size={28} />,
    title: '悬停删除',
    desc: '鼠标悬停在已放置的积木上，点击右上角×可删除',
    color: 'from-lavender-light to-lavender-soft',
    iconColor: 'text-purple-500',
  },
  {
    icon: <Play size={28} />,
    title: '开始模拟',
    desc: '点击右上角绿色播放按钮，观察团子能否到达终点！',
    color: 'from-sunny-light to-sunny-soft',
    iconColor: 'text-sunny-gold',
  },
];

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ visible, onClose }) => {
  const blockTypes = Object.values(BLOCKS_INFO);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-cocoa-soft/30 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.05 }}
            className="relative z-50 w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="card-float p-6 md:p-8 h-full overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-cute text-4xl title-cute mb-1">🎮 游戏玩法</h2>
                  <p className="text-cocoa-light/70 font-cute">五分钟上手，乐趣无穷～</p>
                </div>
                <button
                  onClick={onClose}
                  className="btn-round !w-10 !h-10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-8">
                <h3 className="font-cute text-2xl text-cocoa-soft mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-peach-100 flex items-center justify-center text-lg">📖</span>
                  游戏目标
                </h3>
                <div className="card-glass p-5 bg-gradient-to-r from-cream-50 to-peach-50">
                  <p className="text-cocoa-soft leading-relaxed font-cute text-lg">
                    🎯 使用有限的积木搭建通路，帮助可爱的软团子安全到达
                    <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-full bg-sunny-soft text-cocoa-soft">
                      ✨ 金色终点 ✨
                    </span>
                    ！<br />
                    <span className="text-peach-500">积木用得越少，获得的星星越多哦～</span>
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-cute text-2xl text-cocoa-soft mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-sky-soft flex items-center justify-center text-lg">👆</span>
                  操作步骤
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  {steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="card-glass p-4 bg-gradient-to-r from-white to-cream-50 flex items-start gap-4"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-md ${step.iconColor}`}>
                        {step.icon}
                      </div>
                      <div>
                        <div className="font-cute text-xl text-cocoa-soft mb-1">
                          <span className="text-peach-500 mr-1">{idx + 1}.</span>
                          {step.title}
                        </div>
                        <p className="text-cocoa-light/80 text-sm leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-cute text-2xl text-cocoa-soft mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-mint-soft flex items-center justify-center text-lg">🧱</span>
                  积木图鉴
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {blockTypes.map((block, idx) => (
                    <motion.div
                      key={block.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.06 }}
                      className="card-glass p-4 text-center hover:-translate-y-1 transition-transform cursor-default"
                    >
                      <div className="text-4xl mb-2" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))' }}>
                        {block.emoji}
                      </div>
                      <div className="font-cute text-lg text-cocoa-soft mb-1">{block.name}</div>
                      <div className="text-xs text-cocoa-light/70 leading-relaxed min-h-[36px]">
                        {block.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-cute text-2xl text-cocoa-soft mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-sunny-soft flex items-center justify-center text-lg">⭐</span>
                  星级评分
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { stars: 3, text: '积木最少，完美通关！', color: 'from-sunny-soft to-sunny-gold' },
                    { stars: 2, text: '干得漂亮，还有优化空间～', color: 'from-sunny-light to-sunny-soft' },
                    { stars: 1, text: '成功过关，继续加油！', color: 'from-cream-100 to-cream-200' },
                  ].map((item, idx) => (
                    <div key={idx} className="card-glass p-4 text-center">
                      <div className="flex items-center justify-center gap-0.5 mb-2">
                        {Array.from({ length: item.stars }).map((_, i) => (
                          <span key={i} className="text-2xl">⭐</span>
                        ))}
                        {Array.from({ length: 3 - item.stars }).map((_, i) => (
                          <span key={i} className="text-2xl opacity-30">⭐</span>
                        ))}
                      </div>
                      <div className="text-xs text-cocoa-light/80 leading-relaxed">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button onClick={onClose} className="btn-cute-primary px-10">
                  知道啦，开始游戏！
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
