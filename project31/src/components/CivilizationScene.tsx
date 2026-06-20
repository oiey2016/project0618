import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { Era } from '../types/game';
import * as LucideIcons from 'lucide-react';

interface CivilizationSceneProps {
  era: Era;
}

export function CivilizationScene({ era }: CivilizationSceneProps) {
  const { eras, currentEraId } = useGameStore();
  const builtLandmarks = era.landmarks.filter(l => l.built);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = LucideIcons;
    return icons[
      iconName.charAt(0).toUpperCase() + iconName.slice(1)
    ] || LucideIcons.Building2;
  };

  const eraProgress = (builtLandmarks.length / era.landmarks.length) * 100;

  const decorativeElements = {
    primitive: ['🌲', '🪨', '🦣', '🌿', '🌲', '🪨'],
    bronze: ['🏺', '⚔️', '🛡️', '🐫', '🏛️', '⚱️'],
    agricultural: ['🌾', '🐄', '🌻', '🐑', '🌳', '🌽'],
    industrial: ['⚙️', '🚂', '🏭', '🔧', '⛏️', '📦'],
    modern: ['🚗', '💡', '📱', '✈️', '🚀', '🏙️'],
    future: ['🛸', '🌟', '✨', '🪐', '💫', '🌌'],
  };

  const elements = decorativeElements[era.id as keyof typeof decorativeElements] || ['✨'];

  return (
    <motion.div
      key={era.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${era.theme.bg}, #000)`,
      }}
    >
      {/* 背景渐变光效 */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${era.theme.primary}30 0%, transparent 60%),
                       radial-gradient(ellipse at 20% 30%, ${era.theme.secondary}20 0%, transparent 50%),
                       radial-gradient(ellipse at 80% 40%, ${era.theme.accent}15 0%, transparent 50%)`,
        }}
      />

      {/* 星空/粒子背景 */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: era.theme.primary,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              opacity: [Math.random() * 0.3, Math.random() * 0.8, Math.random() * 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 时代特色装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {elements.map((emoji, i) => (
          <motion.div
            key={`${era.id}-deco-${i}`}
            className="absolute text-3xl md:text-5xl opacity-20"
            style={{
              left: `${(i / elements.length) * 100 + Math.random() * 10}%`,
              bottom: `${Math.random() * 30 + 5}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* 地面/地平线 */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${era.theme.primary}40, transparent)`,
          }}
        />
        <svg
          className="absolute bottom-0 left-0 w-full h-32 md:h-48"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={era.theme.primary} stopOpacity="0.4" />
              <stop offset="100%" stopColor={era.theme.bg} stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 C200,60 400,180 600,100 C800,20 1000,160 1200,80 C1320,40 1380,100 1440,80 L1440,200 L0,200 Z"
            fill="url(#groundGradient)"
          />
          <path
            d="M0,160 C300,120 500,190 800,140 C1100,90 1300,170 1440,140 L1440,200 L0,200 Z"
            fill={era.theme.primary}
            fillOpacity="0.15"
          />
        </svg>
      </div>

      {/* 地标建筑展示 */}
      <div className="absolute inset-0 flex items-end justify-center pb-24 md:pb-32 pr-0 md:pr-80">
        <div className="relative w-full max-w-4xl mx-auto px-8">
          {/* 进度条 */}
          <div className="absolute -top-16 md:-top-20 left-1/2 -translate-x-1/2 w-64 md:w-96">
            <div className="text-center mb-2">
              <span className="font-display text-xs md:text-sm text-white/60">
                时代进度
              </span>
            </div>
            <div className="h-2 md:h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${era.theme.primary}, ${era.theme.secondary}, ${era.theme.accent})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${eraProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="text-center mt-1.5">
              <span className="font-display text-base md:text-lg font-bold" style={{ color: era.theme.primary }}>
                {builtLandmarks.length} / {era.landmarks.length}
              </span>
            </div>
          </div>

          {/* 建筑展示区 */}
          <div className="flex items-end justify-center gap-4 md:gap-8">
            {era.landmarks.map((landmark, index) => {
              const IconComponent = getIcon(landmark.svgIcon);
              const isBuilt = landmark.built;

              return (
                <motion.div
                  key={landmark.id}
                  className="flex flex-col items-center"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{
                    y: isBuilt ? 0 : 40,
                    opacity: isBuilt ? 1 : 0.3,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: 'easeOut',
                  }}
                >
                  {/* 建筑主体 */}
                  <motion.div
                    className="relative"
                    animate={isBuilt ? {
                      y: [0, -8, 0],
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    }}
                  >
                    {/* 光晕效果 */}
                    {isBuilt && (
                      <motion.div
                        className="absolute -inset-4 md:-inset-6 rounded-full blur-2xl"
                        style={{
                          background: `radial-gradient(circle, ${era.theme.primary}60, transparent 70%)`,
                        }}
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}

                    {/* 建筑图标容器 */}
                    <div
                      className={`
                        relative w-20 h-24 md:w-28 md:h-36 lg:w-32 lg:h-40
                        flex items-center justify-center
                        rounded-t-2xl md:rounded-t-3xl
                        transition-all duration-500
                        ${isBuilt ? '' : 'grayscale'}
                      `}
                      style={{
                        background: isBuilt
                          ? `linear-gradient(to top, ${era.theme.primary}, ${era.theme.secondary})`
                          : 'linear-gradient(to top, #333, #444)',
                        boxShadow: isBuilt
                          ? `0 0 40px ${era.theme.primary}40, inset 0 2px 0 rgba(255,255,255,0.2)`
                          : '0 0 20px rgba(0,0,0,0.5)',
                        border: `2px solid ${isBuilt ? era.theme.primary + '80' : '#55555580'}`,
                        borderBottom: 'none',
                      }}
                    >
                      {isBuilt ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                        >
                          <IconComponent
                            className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 text-white drop-shadow-lg"
                          />
                        </motion.div>
                      ) : (
                        <div className="text-white/30">
                          <IconComponent className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16" />
                        </div>
                      )}

                      {/* 建造完成粒子 */}
                      {isBuilt && (
                        <motion.div
                          className="absolute inset-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, delay: 0.3 + index * 0.1 }}
                        >
                          {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 rounded-full"
                              style={{
                                background: era.theme.accent,
                                left: '50%',
                                top: '50%',
                              }}
                              animate={{
                                x: Math.cos((i / 8) * Math.PI * 2) * 60,
                                y: Math.sin((i / 8) * Math.PI * 2) * 60,
                                opacity: 0,
                                scale: 0,
                              }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {/* 建筑底座 */}
                    <div
                      className="h-3 md:h-4 -mx-2 md:-mx-3 rounded-b-lg"
                      style={{
                        background: isBuilt
                          ? `linear-gradient(to bottom, ${era.theme.primary}, ${era.theme.accent})`
                          : '#222',
                      }}
                    />
                  </motion.div>

                  {/* 建筑名称 */}
                  <motion.div
                    className="mt-3 md:mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isBuilt ? 1 : 0.4 }}
                    transition={{ delay: 0.5 + index * 0.15 }}
                  >
                    <p
                      className={`
                        font-display font-bold text-xs md:text-sm whitespace-nowrap
                        ${isBuilt ? '' : 'line-through decoration-white/30'}
                      `}
                      style={{ color: isBuilt ? era.theme.secondary : '#888' }}
                    >
                      {landmark.name}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 时代标题大字 */}
      <div className="absolute top-40 md:top-48 left-4 md:left-8 pointer-events-none">
        <motion.h1
          key={`${era.id}-title`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-black leading-none"
          style={{
            color: era.theme.primary,
            textShadow: `0 0 60px ${era.theme.primary}60, 0 0 120px ${era.theme.secondary}30`,
          }}
        >
          {era.name}
        </motion.h1>
        <motion.p
          key={`${era.id}-year`}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-display text-base md:text-xl font-bold mt-2 md:mt-3 tracking-widest"
          style={{ color: era.theme.secondary, opacity: 0.7 }}
        >
          {era.year}
        </motion.p>
        <motion.p
          key={`${era.id}-desc`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-body text-sm md:text-base lg:text-lg mt-3 md:mt-4 max-w-xs md:max-w-sm italic leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {era.description}
        </motion.p>
      </div>

      {/* 底部引导提示 */}
      <AnimatePresence>
        {builtLandmarks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 lg:left-8 lg:translate-x-0"
          >
            <div
              className="px-4 md:px-6 py-3 md:py-3 rounded-full backdrop-blur-xl flex items-center gap-2 md:gap-3"
              style={{
                background: `linear-gradient(135deg, ${era.theme.primary}20, ${era.theme.secondary}10)`,
                border: `1px solid ${era.theme.primary}40`,
              }}
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg md:text-xl"
              >
                👆
              </motion.span>
              <p className="font-body text-xs md:text-sm text-white/80">
                点击右侧「答题获取知识点」开始建造你的文明
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
