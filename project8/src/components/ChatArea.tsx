import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import MessageBubble from './MessageBubble';

const ChatArea: React.FC = () => {
  const messageHistory = useGameStore((s) => s.messageHistory);
  const typing = useGameStore((s) => s.typing);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageHistory, typing]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin
        bg-gradient-to-b from-transparent via-bg-dark/20 to-bg-purple/20"
    >
      <div className="flex justify-center mb-6">
        <div className="px-4 py-2 rounded-full border border-neon-cyan/20 bg-bg-dark/60 backdrop-blur-sm">
          <p className="text-xs text-neon-cyan tracking-wider" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            ▸ 加密频道已建立 ◂
          </p>
        </div>
      </div>

      {messageHistory.map((msg, idx) => (
        <MessageBubble key={msg.id} message={msg} index={idx} />
      ))}

      {typing && (
        <div className="flex items-start gap-2 animate-message-in">
          <div className="w-8 h-8 rounded-full bg-bg-purple/50 border border-neon-cyan/30 flex items-center justify-center text-sm shrink-0">
            零
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-bg-purple/60 border border-neon-cyan/20">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-typing-dot" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-typing-dot" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-typing-dot" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
