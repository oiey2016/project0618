import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  className,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-space-900/85 backdrop-blur-sm" />
      <div
        className={cn(
          'ornate-border relative w-full rounded-sm animate-scale-in',
          maxWidth,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-stardust-400" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-stardust-400" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-stardust-400" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-stardust-400" />

        {title && (
          <div className="flex items-center gap-3 px-5 py-3 border-b border-stardust-400/30 bg-gradient-to-r from-stardust-500/15 via-stardust-400/5 to-transparent">
            <span className="w-2 h-2 rotate-45 bg-stardust-400" />
            <h2 className="font-display text-stardust-100 text-lg tracking-widest uppercase flex-1">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-stardust-300 hover:text-stardust-50 hover:bg-stardust-400/10 rounded-sm transition-colors"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-5">{children}</div>

        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-stardust-300 hover:text-stardust-50 hover:bg-stardust-400/10 rounded-sm transition-colors z-10"
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
