import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { RotateCcw, Home } from 'lucide-react';

export const EndingScreen: React.FC = () => {
  const { resetGame, servedGuests } = useGameStore();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 5500),
      setTimeout(() => setPhase(4), 8000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const endingTexts = [
    '晚餐结束了...',
    '客人们都陷入了沉睡...',
    '永远的沉睡...',
    '暗夜旅馆，又迎来了平静的一夜。',
    '谢谢你的服务，侍者。',
  ];

  return (
    <div className="relative w-full h-full bg-shadow-black overflow-hidden">
      {/* 暗角效果 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-shadow-black/50 to-shadow-black" />
      
      {/* 背景 - 模糊的旅馆轮廓 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="relative">
          <div className="w-48 h-64 bg-rust-dark rounded-t-lg">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full">
              <div className="w-0 h-0 mx-auto" style={{
                borderLeft: '100px solid transparent',
                borderRight: '100px solid transparent',
                borderBottom: '50px solid #2D1B0E',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* 烛火效果 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
        <div className="w-2 h-16 bg-parchment/30 rounded-sm mx-auto">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-6 bg-candle-orange rounded-full animate-flicker blur-md opacity-60" />
        </div>
      </div>

      {/* 文字区域 */}
      <div className="absolute top-1/3 left-0 right-0 flex flex-col items-center">
        {endingTexts.slice(0, phase).map((text, index) => (
          <p
            key={index}
            className="font-handwritten text-2xl md:text-3xl text-parchment/90 mb-4 animate-fade-in text-center px-4"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            {text}
          </p>
        ))}
      </div>

      {/* 完成统计 */}
      {phase >= 4 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 mt-8 animate-fade-in">
          <div className="text-center">
            <p className="text-parchment/60 font-serif-old mb-4">
              服务了 {servedGuests.length} 位客人
            </p>
            <div className="flex gap-3 justify-center">
              {servedGuests.map((guestId, i) => (
                <div
                  key={guestId}
                  className="w-12 h-12 rounded-full bg-rust-dark/50 border border-rust-mid/50 flex items-center justify-center text-2xl"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {guestId === 'guest_boar' && '🐗'}
                  {guestId === 'guest_peacock' && '🦚'}
                  {guestId === 'guest_pigeon' && '🕊️'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 结局标题 */}
      {phase >= 4 && (
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 animate-fade-in">
          <div className="text-center">
            <h2 className="font-gothic text-4xl text-blood-bright text-glow mb-2">
              完
            </h2>
            <p className="text-parchment/50 font-handwritten text-lg">
              ~ 真结局 ~
            </p>
          </div>
        </div>
      )}

      {/* 按钮 */}
      {phase >= 4 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-4 animate-fade-in">
          <button
            className="btn-vintage flex items-center gap-2"
            onClick={resetGame}
          >
            <RotateCcw size={18} />
            再玩一次
          </button>
          <button
            className="btn-vintage opacity-80 flex items-center gap-2"
            onClick={resetGame}
          >
            <Home size={18} />
            返回主菜单
          </button>
        </div>
      )}

      {/* 底部提示 */}
      {phase >= 4 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <p className="text-parchment/30 text-xs font-serif-old italic animate-pulse-slow">
            "夜色深沉，旅馆的秘密，永远不会被揭开..."
          </p>
        </div>
      )}

      {/* 飘落的羽毛/花瓣效果 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-parchment/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            {i % 2 === 0 ? '🪶' : '🍂'}
          </div>
        ))}
      </div>
    </div>
  );
};
