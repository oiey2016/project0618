import { Play, Settings, Trophy } from 'lucide-react';
import { getHighScore } from '@/utils/storage';
import { useEffect, useState } from 'react';
import { audioManager } from '@/utils/audioManager';

interface MenuProps {
  onStart: () => void;
  onSettings: () => void;
}

export default function Menu({ onStart, onSettings }: MenuProps) {
  const [highScore, setHighScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHighScore(getHighScore());
    setMounted(true);
  }, []);

  const handleStartClick = () => {
    audioManager.activateInGesture();
    audioManager.playClick();
    onStart();
  };

  const handleSettingsClick = () => {
    audioManager.activateInGesture();
    audioManager.playClick();
    onSettings();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #4FC3F7 0%, transparent 70%)',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #81C784 0%, transparent 70%)',
            bottom: '20%',
            right: '10%',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #CE93D8 0%, transparent 70%)',
            top: '30%',
            left: '5%',
            animation: 'float 7s ease-in-out infinite',
          }}
        />
      </div>

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-2 text-center">
          <div className="text-6xl font-extralight tracking-widest text-white glow-text mb-2">
            旋音
          </div>
          <div className="text-sm text-primary-light/70 tracking-[0.3em] uppercase">
            Spin Rhythm
          </div>
        </div>

        <div className="text-4xl mb-8 opacity-30">✦</div>

        <div className="glass-card p-6 w-72 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy size={20} className="text-accent-yellow" />
            </div>
            <div>
              <div className="text-xs text-white/50 mb-0.5">最高分</div>
              <div className="text-xl font-light text-white">{highScore.toLocaleString()}</div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="text-xs text-white/40 text-center leading-relaxed">
              转动手机，对准飞来的音符<br />
              在节奏中寻找旋律
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-64">
          <button
            onClick={handleStartClick}
            className="glass-button py-4 px-8 text-lg font-medium flex items-center justify-center gap-3"
          >
            <Play size={24} fill="currentColor" />
            开始游戏
          </button>

          <button
            onClick={handleSettingsClick}
            className="glass-button py-3 px-6 flex items-center justify-center gap-2 bg-white/5 border-white/10"
          >
            <Settings size={18} />
            设置
          </button>
        </div>

        <div className="mt-12 text-center">
          <div className="text-xs text-white/30 mb-2">操作说明</div>
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <span className="text-2xl">📱</span>
            <span>旋转手机控制指针</span>
            <span className="text-2xl">🎵</span>
          </div>
          <div className="text-xs text-white/30 mt-1">
            桌面端可用鼠标拖拽或点击
          </div>
        </div>
      </div>
    </div>
  );
}
