import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Grid3X3, Sparkles, Gamepad2, HelpCircle } from 'lucide-react';
import { HowToPlayModal } from '@/components/HowToPlayModal';

const Cloud: React.FC<{ top: string; left: string; scale: number; delay: number }> = ({ top, left, scale, delay }) => (
  <motion.div
    className="absolute"
    style={{ top, left, transformOrigin: 'center' }}
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 0.85, x: 0 }}
    transition={{ delay, duration: 2, ease: 'easeOut' }}
  >
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transform: `scale(${scale})` }}
    >
      <div className="relative w-40 h-16">
        <div className="absolute bottom-0 left-0 w-20 h-14 rounded-full bg-white shadow-[0_8px_24px_rgba(168,216,234,0.4)]" />
        <div className="absolute bottom-2 left-10 w-24 h-16 rounded-full bg-white" />
        <div className="absolute bottom-0 left-24 w-16 h-12 rounded-full bg-white" />
      </div>
    </motion.div>
  </motion.div>
);

const DangoCharacter: React.FC = () => (
  <motion.div
    className="relative"
    initial={{ scale: 0, rotate: -20 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
  >
    <motion.div
      animate={{
        y: [0, -18, 0],
        scaleY: [1, 1.06, 1],
        scaleX: [1, 0.97, 1],
      }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 160 160" width="160" height="160">
          <defs>
            <radialGradient id="dangoBody" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#FFEDE0" />
              <stop offset="60%" stopColor="#FFD6C8" />
              <stop offset="100%" stopColor="#FFB097" />
            </radialGradient>
            <radialGradient id="dangoCheek" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FFB097" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFB097" stopOpacity="0" />
            </radialGradient>
            <filter id="dangoShadow">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#FF9A78" floodOpacity="0.35" />
            </filter>
          </defs>

          <ellipse cx="80" cy="145" rx="48" ry="8" fill="#FF9A78" opacity="0.2" />

          <g filter="url(#dangoShadow)">
            <ellipse cx="80" cy="88" rx="56" ry="54" fill="url(#dangoBody)" stroke="#FFB097" strokeWidth="3" />
            <ellipse cx="62" cy="78" rx="22" ry="18" fill="white" opacity="0.5" />
            <ellipse cx="70" cy="72" rx="10" ry="8" fill="white" opacity="0.7" />
          </g>

          <ellipse cx="54" cy="95" rx="12" ry="9" fill="url(#dangoCheek)" />
          <ellipse cx="106" cy="95" rx="12" ry="9" fill="url(#dangoCheek)" />

          <g>
            <ellipse cx="64" cy="86" rx="6" ry="8" fill="#6B4F3A" />
            <ellipse cx="96" cy="86" rx="6" ry="8" fill="#6B4F3A" />
            <circle cx="66" cy="83" r="2" fill="white" />
            <circle cx="98" cy="83" r="2" fill="white" />
          </g>

          <path
            d="M74 102 Q80 110 86 102"
            stroke="#6B4F3A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M120 50 Q130 40 140 48"
            stroke="#A8D8EA"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <motion.circle
            cx="144"
            cy="48"
            r="6"
            fill="#FFD466"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </div>
    </motion.div>
  </motion.div>
);

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  const handleStart = () => {
    navigate('/game/1');
  };

  const handleLevels = () => {
    navigate('/levels');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Cloud top="8%" left="5%" scale={1} delay={0.1} />
      <Cloud top="18%" left="72%" scale={0.8} delay={0.3} />
      <Cloud top="55%" left="8%" scale={0.65} delay={0.5} />
      <Cloud top="68%" left="78%" scale={0.9} delay={0.7} />

      <div className="absolute top-16 right-20">
        <motion.div
          animate={{ rotate: [0, 15, 0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-sunny-soft to-sunny-gold shadow-[0_0_60px_rgba(255,212,102,0.6)] border-4 border-white flex items-center justify-center"
        >
          <Sparkles size={32} className="text-white" />
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 justify-center">
            <Gamepad2 size={28} className="text-peach-400" />
            <span className="font-cute text-lg text-peach-500 tracking-wider">PHYSICS · SANDBOX</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.2 }}
          className="font-cute text-7xl md:text-8xl title-cute text-center mb-2 text-shadow-pop"
        >
          软团子大冒险
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="font-cute text-xl md:text-2xl text-cocoa-light text-center mb-10 max-w-xl"
        >
          🧱 搭积木 · 🎈 放气球 · 🌀 用脑洞送团子回家
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-10"
        >
          <DangoCharacter />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 180, damping: 20 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md"
        >
          <button
            onClick={handleStart}
            className="btn-cute-primary w-full sm:flex-1 group"
          >
            <Play size={24} className="group-hover:translate-x-1 transition-transform" />
            <span>开始冒险</span>
          </button>

          <button
            onClick={handleLevels}
            className="btn-cute w-full sm:flex-1"
          >
            <Grid3X3 size={22} />
            <span>关卡选择</span>
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHelp(true)}
          className="mt-6 btn-cute-ghost group"
        >
          <HelpCircle size={20} className="group-hover:rotate-12 transition-transform text-peach-500" />
          <span className="font-cute">游戏玩法说明</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 grid grid-cols-3 gap-6 max-w-xl w-full"
        >
          {[
            { icon: '🪵', title: '自由搭建', desc: '多种积木任你选' },
            { icon: '🎮', title: '物理模拟', desc: '真实碰撞Q弹感' },
            { icon: '⭐', title: '三星挑战', desc: '用最少积木通关' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.12, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="card-glass p-4 text-center"
            >
              <div className="text-4xl mb-2">{f.icon}</div>
              <div className="font-cute text-cocoa-soft text-lg mb-0.5">{f.title}</div>
              <div className="text-xs text-cocoa-light/70">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-10 text-xs text-cocoa-light/50 font-cute tracking-wide"
        >
          Made with 🍡 · 搭出你的创意通路
        </motion.div>
      </div>

      <HowToPlayModal visible={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};
