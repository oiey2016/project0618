import { Radio } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 my-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-neon-blue/20 border-neon-blue/50">
        <Radio size={18} className="text-neon-blue animate-pulse" />
      </div>
      <div className="flex flex-col items-start">
        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-space-800/80 border border-neon-blue/30">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 rounded-full bg-neon-blue animate-typing"
              style={{ animationDelay: '0s' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-neon-blue animate-typing"
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-neon-blue animate-typing"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-1 font-mono">
          李航 正在输入...
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
