import { useGameStore } from '../../store/useGameStore';
import { X } from 'lucide-react';

export default function DialogBox() {
  const dialog = useGameStore((s) => s.dialog);
  const hideDialog = useGameStore((s) => s.hideDialog);

  if (!dialog.visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center p-4 pb-8 pointer-events-none">
      <div 
        className="w-full max-w-3xl pointer-events-auto transform transition-all duration-300"
        style={{
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div 
          className="relative rounded-lg p-6 shadow-2xl"
          style={{
            background: 'linear-gradient(180deg, #F5E6D3 0%, #E8D5B7 100%)',
            border: '4px solid #8B7355',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.5)',
          }}
        >
          <button
            onClick={hideDialog}
            className="absolute top-2 right-2 p-1 rounded-full text-amber-800 hover:bg-amber-200/50 transition-colors"
          >
            <X size={20} />
          </button>

          {dialog.speaker && (
            <div className="mb-3">
              <span 
                className="text-amber-900 font-bold text-lg"
                style={{ 
                  fontFamily: 'serif',
                  textShadow: '1px 1px 0 rgba(255,255,255,0.5)',
                }}
              >
                {dialog.speaker}
              </span>
            </div>
          )}

          <p 
            className="text-amber-900 text-lg leading-relaxed whitespace-pre-line"
            style={{ 
              fontFamily: 'serif',
              textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {dialog.text}
          </p>

          <div className="mt-4 text-right">
            <button
              onClick={hideDialog}
              className="px-6 py-2 rounded font-bold text-amber-100 transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #8B7355 0%, #5C4A3A 100%)',
                border: '2px solid #4A3728',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              继续
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <div className="w-3/4 h-1 bg-amber-900/20 rounded-full blur-sm" />
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
