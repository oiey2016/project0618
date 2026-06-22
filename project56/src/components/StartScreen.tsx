import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Info, Volume2, VolumeX } from 'lucide-react';

export const StartScreen: React.FC = () => {
  const { startGame } = useGameStore();
  const [showAbout, setShowAbout] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [titleVisible, setTitleVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 500);
    setTimeout(() => setButtonsVisible(true), 1500);
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-shadow-black via-rust-dark to-shadow-black overflow-hidden">
      {/* 背景装饰 - 旅馆剪影 */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="relative w-full max-w-2xl h-1/2">
          {/* 旅馆剪影 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4/5 bg-shadow-black/80">
            {/* 屋顶 */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full">
              <div className="w-0 h-0 mx-auto" style={{
                borderLeft: '120px solid transparent',
                borderRight: '120px solid transparent',
                borderBottom: '60px solid #0a0502',
              }} />
            </div>
            
            {/* 窗户 - 有些亮有些暗 */}
            <div className="absolute top-12 left-1/4 w-8 h-12 bg-candle-orange/20 animate-flicker-slow" />
            <div className="absolute top-12 right-1/4 w-8 h-12 bg-shadow-black" />
            <div className="absolute top-28 left-1/3 w-6 h-10 bg-candle-orange/10 animate-flicker" />
            <div className="absolute top-28 right-1/3 w-6 h-10 bg-shadow-black" />
            <div className="absolute top-40 left-1/2 -translate-x-1/2 w-12 h-16 bg-rust-dark/50 border-2 border-rust-mid/30" />
            
            {/* 烟囱冒出的烟 */}
            <div className="absolute -top-20 right-1/4 w-4 h-8 bg-shadow-black" />
          </div>
          
          {/* 月亮 */}
          <div className="absolute top-10 right-1/4 w-16 h-16 rounded-full bg-parchment/10 blur-sm">
            <div className="absolute top-1 right-1 w-14 h-14 rounded-full bg-shadow-black/80" />
          </div>
        </div>
      </div>

      {/* 雾气效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-rust-dark/50 to-transparent animate-pulse-slow" />

      {/* 标题 */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 text-center transition-all duration-1000 ${
        titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}>
        <h1 className="font-gothic text-6xl md:text-7xl text-parchment mb-2 text-glow tracking-wider">
          暗夜旅馆
        </h1>
        <p className="font-handwritten text-2xl text-blood-bright tracking-wide">
          ~ 最后的晚餐 ~
        </p>
        <div className="mt-4 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blood-red animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* 按钮区域 */}
      <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-all duration-1000 ${
        buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <button
          className="btn-vintage text-xl px-12 py-4 min-w-[200px]"
          onClick={startGame}
        >
          开始游戏
        </button>
        
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 text-parchment/70 hover:text-parchment transition-colors font-serif-old"
            onClick={() => setShowAbout(true)}
          >
            <Info size={18} />
            关于游戏
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-parchment/70 hover:text-parchment transition-colors font-serif-old"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundEnabled ? '音效开' : '音效关'}
          </button>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-parchment/40 text-sm font-serif-old italic animate-pulse-slow">
          点击场景中的物品探索，揭开旅馆的秘密...
        </p>
      </div>

      {/* 关于弹窗 */}
      {showAbout && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-shadow-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowAbout(false)}
        >
          <div 
            className="w-full max-w-lg mx-4 dialogue-box p-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-gothic text-3xl text-rust-dark mb-4 text-center">
              关于游戏
            </h2>
            <div className="text-rust-dark font-serif-old space-y-4">
              <p>
                《暗夜旅馆》是一款锈湖风格的点击式推理解谜游戏。
              </p>
              <p>
                你是这家神秘旅馆的侍者，今晚有五位特殊的客人到访。
                你的任务是为每位客人准备一份...独一无二的晚餐。
              </p>
              <p>
                <strong>玩法说明：</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>点击场景中的物品进行互动</li>
                <li>收集的物品会放入底部物品栏</li>
                <li>点击物品栏中的物品可以选中使用</li>
                <li>点击「组合」按钮可以将两个物品组合</li>
                <li>用四周的箭头在不同房间间移动</li>
                <li>为每位客人端上正确的晚餐即可通关</li>
              </ul>
              <p className="text-rust-dark/70 text-sm italic text-center">
                "晚餐必须完美，每位客人都值得最好的..."
              </p>
            </div>
            <div className="mt-6 text-center">
              <button
                className="btn-vintage"
                onClick={() => setShowAbout(false)}
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 蜡烛装饰 */}
      <div className="absolute bottom-1/3 left-10">
        <div className="relative">
          <div className="w-3 h-12 bg-parchment/20 rounded-sm" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-candle-orange rounded-full animate-flicker blur-sm" />
        </div>
      </div>
      <div className="absolute bottom-1/3 right-10">
        <div className="relative">
          <div className="w-3 h-10 bg-parchment/15 rounded-sm" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-3 bg-candle-orange/80 rounded-full animate-flicker-slow blur-sm" />
        </div>
      </div>
    </div>
  );
};
