import React from 'react';
import { ArrowLeft, RotateCcw, Play, Pause, Lightbulb, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useNavigate, useParams } from 'react-router-dom';
import { LEVELS } from '@/data/levels';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ControlPanelProps {
  onHint?: () => void;
  onHelp?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onHint, onHelp, onPlay, onPause, onReset }) => {
  const navigate = useNavigate();
  const params = useParams<{ levelId: string }>();
  const levelId = Number(params.levelId);
  const level = LEVELS.find(l => l.id === levelId);

  const isSimulating = useGameStore(s => s.isSimulating);
  const isPaused = useGameStore(s => s.isPaused);
  const setPaused = useGameStore(s => s.setPaused);
  const resetLevelState = useGameStore(s => s.resetLevelState);

  const [muted, setMuted] = React.useState(false);

  const handleBack = () => {
    navigate('/levels');
  };

  const handleReset = () => {
    resetLevelState();
    onReset?.();
  };

  const handleTogglePlay = () => {
    if (isSimulating) {
      const newPaused = !isPaused;
      setPaused(newPaused);
      if (newPaused) onPause?.();
      else onPlay?.();
    } else {
      onPlay?.();
    }
  };

  const btnBase = 'btn-round';

  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleBack}
          className={btnBase}
          title="返回选关"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleReset}
          className={clsx(btnBase, 'text-peach-500')}
          title="重置关卡"
        >
          <RotateCcw size={22} strokeWidth={2.5} />
        </motion.button>
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass px-6 py-2.5 text-center"
        >
          <div className="font-cute text-xl text-cocoa-soft">
            第{levelId}关 · {level?.name || ''}
          </div>
        </motion.div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setMuted(m => !m)}
          className={btnBase}
          title={muted ? '取消静音' : '静音'}
        >
          {muted ? <VolumeX size={22} strokeWidth={2.5} /> : <Volume2 size={22} strokeWidth={2.5} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={onHelp}
          className={clsx(btnBase, 'text-sky-600')}
          title="游戏玩法"
        >
          <HelpCircle size={22} strokeWidth={2.5} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={onHint}
          className={clsx(btnBase, 'text-sunny-gold')}
          title="提示"
        >
          <Lightbulb size={22} strokeWidth={2.5} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleTogglePlay}
          className={clsx(
            'relative inline-flex items-center justify-center w-14 h-14 rounded-full font-cute',
            'text-white transition-all duration-300 border-3 shadow-pop',
            isSimulating && !isPaused
              ? 'bg-gradient-to-br from-peach-400 to-peach-500 border-peach-300 animate-pulse-glow'
              : 'bg-gradient-to-br from-mint-soft to-mint-light border-mint-soft text-cocoa-soft'
          )}
          title={isSimulating ? (isPaused ? '继续' : '暂停') : '开始模拟'}
        >
          {isSimulating && !isPaused ? (
            <Pause size={26} strokeWidth={3} />
          ) : (
            <Play size={26} strokeWidth={3} className="ml-0.5" />
          )}
        </motion.button>
      </div>
    </>
  );
};
