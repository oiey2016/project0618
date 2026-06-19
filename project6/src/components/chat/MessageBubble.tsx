import { useEffect, useState } from 'react';
import { User, Radio } from 'lucide-react';
import type { Message } from '@/types/game';
import { formatTimestamp } from '@/utils/format';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [displayed, setDisplayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const isPlayer = message.sender === 'player';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div
        className={`flex justify-center my-3 transition-all duration-500 ${
          displayed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/10 border border-neon-blue/30">
          <Radio size={14} className="text-neon-blue animate-pulse" />
          <span className="font-mono text-xs text-neon-blue tracking-wide">
            {message.content}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 my-3 transition-all duration-500 ${
        displayed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${isPlayer ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
          isPlayer
            ? 'bg-neon-green/20 border-neon-green/50'
            : 'bg-neon-blue/20 border-neon-blue/50'
        }`}
      >
        {isPlayer ? (
          <User size={18} className="text-neon-green" />
        ) : (
          <Radio size={18} className="text-neon-blue" />
        )}
      </div>

      <div className={`flex flex-col max-w-[75%] ${isPlayer ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isPlayer
              ? 'bg-neon-green/15 border border-neon-green/30 rounded-tr-sm'
              : 'bg-space-800/80 border border-neon-blue/30 rounded-tl-sm'
          }`}
        >
          <p
            className={`text-sm leading-relaxed ${
              isPlayer ? 'text-gray-100' : 'text-gray-200'
            }`}
          >
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-1 font-mono">
          {isPlayer ? '你' : '李航'} · {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
