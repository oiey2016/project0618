import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${maxWidth} max-h-[85vh] flex flex-col bg-gradient-to-br from-purple-950/95 via-indigo-950/95 to-purple-950/95 rounded-2xl border border-purple-700/40 shadow-2xl shadow-purple-900/50 animate-scale-in overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

        <div className="relative flex items-center justify-between px-6 py-4 border-b border-purple-700/30 bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-purple-900/50">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-purple-800/40 hover:bg-purple-700/60 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 border border-purple-600/30 hover:border-purple-500/50 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
