import React from 'react';
import { useGameEngineInit } from '../hooks/useGameEngine';
import Avatar from '../components/Avatar';
import StatusBar from '../components/StatusBar';
import ChatArea from '../components/ChatArea';
import Inventory from '../components/Inventory';
import DecisionPanel from '../components/DecisionPanel';
import EndingScreen from '../components/EndingScreen';
import { useGameStore } from '../store/useGameStore';
import { Signal, Radio } from 'lucide-react';

const GamePage: React.FC = () => {
  useGameEngineInit();
  const isGameOver = useGameStore((s) => s.isGameOver);
  const awaitingChoice = useGameStore((s) => s.awaitingChoice);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="skyline-bg" />
      <div className="absolute inset-0 bg-scanlines opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />

      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        <Signal size={12} className="text-neon-pink animate-pulse" />
        <h1
          className="text-xs tracking-[0.5em] text-neon-pink neon-text-glow-pink"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          NEON NIGHT MAIL // 霓虹夜信
        </h1>
        <Radio size={12} className="text-neon-cyan animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-6xl h-[92vh] max-h-[900px]
        rounded-2xl overflow-hidden
        bg-bg-dark/85 backdrop-blur-xl
        border border-neon-pink/20
        shadow-[0_0_60px_rgba(255,45,149,0.1),0_0_120px_rgba(0,240,255,0.05)]
        flex flex-col md:flex-row">

        <div className="w-full md:w-[62%] flex flex-col relative">
          <Avatar />
          <ChatArea />
          <div className={`transition-all duration-500 ${awaitingChoice ? 'h-0 md:h-0 overflow-hidden' : 'block'}`}>
            <Inventory />
          </div>
          <DecisionPanel />
        </div>

        <div className="w-full md:w-[38%] flex flex-col border-t md:border-t-0 md:border-l border-neon-cyan/15">
          <StatusBar />

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent pointer-events-none" />
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="text-xs text-neon-pink tracking-widest"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    // 任务简报
                  </h3>
                </div>
                <div className="p-4 rounded-lg bg-bg-purple/30 border border-neon-pink/15 space-y-3">
                  <p className="text-xs text-text-muted leading-relaxed" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
                    你收到了一段来自未知号码的加密通讯。另一端是一个被绑架的少女，她叫"零"。
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
                    通过这不稳定的频道，你是她唯一的希望。你的每一个选择都将决定她的命运。
                  </p>
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[11px] text-neon-red" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                      ⚠ 核心规则：别让她死。
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  className="text-xs text-neon-cyan tracking-widest mb-2"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  // 操作指南
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: '💬', text: '阅读消息，理解她的处境' },
                    { icon: '📊', text: '监控三项数值的变化' },
                    { icon: '🎯', text: '在关键时刻做出选择' },
                    { icon: '🎒', text: '收集并合理使用物品' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-3 py-2 rounded-md bg-bg-dark/40 border border-white/5">
                      <span className="text-base shrink-0">{t.icon}</span>
                      <p className="text-[11px] text-text-primary leading-snug" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
                        {t.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {awaitingChoice && (
                <div className="p-3 rounded-lg border border-neon-cyan/40 bg-neon-cyan/5 animate-pulse z-10 relative">
                  <p className="text-xs text-neon-cyan text-center" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    ▸ 等待你的决策 ◂
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={`md:hidden transition-all duration-500 ${awaitingChoice ? 'h-0 overflow-hidden' : 'block'}`}>
            <Inventory />
          </div>
        </div>
      </div>

      <EndingScreen />
    </div>
  );
};

export default GamePage;
