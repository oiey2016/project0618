import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { X } from 'lucide-react';

export const DialogBox: React.FC = () => {
  const { currentDialogue, dialogueSpeaker, closeDialogue } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentDialogue) {
      setDisplayedText('');
      setIsTyping(true);
      
      let index = 0;
      const text = currentDialogue;
      
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    } else {
      setDisplayedText('');
    }
  }, [currentDialogue]);

  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue || '');
      setIsTyping(false);
    } else {
      closeDialogue();
    }
  };

  if (!currentDialogue) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-32 pointer-events-none"
      onClick={handleClick}
    >
      <div className="w-full max-w-2xl mx-4 pointer-events-auto animate-slide-up">
        <div 
          className="dialogue-box p-6 cursor-pointer relative"
          onClick={handleClick}
        >
          {/* 说话者名称 */}
          {dialogueSpeaker && (
            <div className="absolute -top-4 left-4">
              <div className="px-3 py-1 bg-rust-brown border-2 border-rust-light rounded-t text-parchment font-serif-old font-bold text-sm">
                {dialogueSpeaker}
              </div>
            </div>
          )}
          
          {/* 对话内容 */}
          <div className="min-h-[60px]">
            <p className="text-rust-dark font-handwritten text-xl leading-relaxed">
              {displayedText}
              {isTyping && <span className="animate-pulse">_</span>}
            </p>
          </div>
          
          {/* 点击提示 */}
          <div className="absolute bottom-2 right-4">
            <span className="text-rust-dark/50 text-xs font-serif-old">
              {isTyping ? '点击跳过' : '点击继续'}
            </span>
          </div>
          
          {/* 关闭按钮 */}
          <button 
            className="absolute top-2 right-2 text-rust-dark/50 hover:text-rust-dark transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closeDialogue();
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
