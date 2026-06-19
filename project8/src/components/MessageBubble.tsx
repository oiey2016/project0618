import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Play, Pause, Image, Clock } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
}

const TypingText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 30 }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-blink">▊</span>}
    </span>
  );
};

const VoiceWaveform: React.FC<{ duration: number }> = ({ duration }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p >= 1) {
        setPlaying(false);
        setProgress(0);
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [playing, duration]);

  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <button
      onClick={() => setPlaying((p) => !p)}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-neon-pink/10
        hover:bg-neon-pink/20 border border-neon-pink/30 transition-all group"
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neon-pink text-white shrink-0 group-hover:scale-110 transition-transform">
        {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </div>
      <div className="flex-1 flex items-end gap-0.5 h-6">
        {bars.map((i) => {
          const isPast = i / bars.length <= progress;
          const height = 20 + Math.sin(i * 1.5) * 15 + (playing ? Math.random() * 20 : 0);
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-150
                ${isPast ? 'bg-neon-pink' : 'bg-neon-pink/30'}
                ${playing ? 'animate-wave' : ''}`}
              style={{ height: `${Math.max(8, height)}%` }}
            />
          );
        })}
      </div>
      <span className="text-xs text-text-muted shrink-0" style={{ fontFamily: "'VT323', monospace", fontSize: '1rem' }}>
        {duration}"
      </span>
    </button>
  );
};

const ClueImage: React.FC<{ description: string }> = ({ description }) => {
  const gradients = [
    'from-purple-900 via-fuchsia-900 to-pink-900',
    'from-slate-900 via-cyan-900 to-blue-900',
    'from-rose-900 via-red-900 to-orange-900',
    'from-indigo-900 via-purple-900 to-violet-900',
  ];
  const idx = Math.abs(description.charCodeAt(0)) % gradients.length;

  return (
    <div
      className={`relative rounded-lg overflow-hidden border border-neon-cyan/40
        bg-gradient-to-br ${gradients[idx]} aspect-video`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <Image size={32} className="text-neon-cyan/60 mb-2" />
        <p className="text-xs text-neon-cyan/80" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
          {description}
        </p>
      </div>
      <div className="absolute inset-0 bg-scanlines pointer-events-none" />
      <div className="absolute top-1 left-1 text-[10px] text-neon-cyan/50" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        IMG_{Math.abs(description.length * 137).toString(16).toUpperCase()}
      </div>
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index }) => {
  const time = new Date(message.timestamp);
  const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

  const baseStyle = 'max-w-[85%] px-4 py-2.5 rounded-2xl animate-message-in';

  if (message.sender === 'system') {
    return (
      <div className="flex justify-center my-3" style={{ animationDelay: `${index * 50}ms` }}>
        <div className="px-4 py-1.5 rounded-full bg-bg-dark/80 border border-neon-red/30 text-neon-red text-xs"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          {message.content}
        </div>
      </div>
    );
  }

  const isPlayer = message.sender === 'player';

  return (
    <div
      className={`flex flex-col gap-1 ${isPlayer ? 'items-end' : 'items-start'}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={`${baseStyle}
          ${isPlayer
            ? 'bg-gradient-to-br from-neon-pink to-fuchsia-600 text-white rounded-br-md shadow-[0_0_20px_rgba(255,45,149,0.3)]'
            : 'bg-gradient-to-br from-bg-purple to-bg-dark text-text-primary border border-neon-cyan/20 rounded-bl-md shadow-[0_0_15px_rgba(0,240,255,0.1)]'
          }`}
      >
        {message.type === 'text' && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
            {isPlayer ? message.content : <TypingText text={message.content} />}
          </p>
        )}
        {message.type === 'voice' && message.voiceDuration && (
          <VoiceWaveform duration={message.voiceDuration} />
        )}
        {message.type === 'image' && (
          <div className="space-y-2">
            <ClueImage description={message.imageUrl || message.content} />
            {message.content && (
              <p className="text-xs text-text-muted" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
                {message.content}
              </p>
            )}
          </div>
        )}
      </div>
      <span className="flex items-center gap-1 text-[10px] text-text-muted px-1"
        style={{ fontFamily: "'VT323', monospace", fontSize: '0.85rem' }}>
        <Clock size={10} />
        {timeStr}
      </span>
    </div>
  );
};

export default MessageBubble;
