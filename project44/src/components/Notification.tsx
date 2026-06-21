import { useGameStore } from '../store/useGameStore';
import { Info, AlertTriangle, Check } from 'lucide-react';

export const Notification = () => {
  const { notification } = useGameStore();

  if (!notification) return null;

  const isWarning = notification.includes('不足') || notification.includes('已经') || notification.includes('需要');
  const isSuccess = notification.includes('成功') || notification.includes('完成') || notification.includes('获得') || notification.includes('开始');

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-lg border shadow-lg
        ${isWarning ? 'bg-red-900/90 border-red-600 text-red-200' :
          isSuccess ? 'bg-green-900/90 border-green-600 text-green-200' :
          'bg-wasteland-surface/95 border-wasteland-border text-wasteland-text'}
      `}>
        {isWarning ? (
          <AlertTriangle className="w-4 h-4" />
        ) : isSuccess ? (
          <Check className="w-4 h-4" />
        ) : (
          <Info className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">{notification}</span>
      </div>
    </div>
  );
};
