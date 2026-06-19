import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('cat-restaurant-welcomed');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('cat-restaurant-welcomed', 'true');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
        <div className="text-center">
          <div className="text-6xl mb-3 animate-bounce-slow">🐱</div>
          
          <h2 className="text-2xl font-bold text-rose-600 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            欢迎来到喵喵餐厅
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            在这里，你将经营一家专门接待猫咪顾客的温馨餐厅~
          </p>
          
          <div className="mt-4 space-y-2 text-left bg-rose-50 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">🐟</span>
              <p className="text-sm text-gray-600">研究新菜品，吸引更多猫咪顾客</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">💰</span>
              <p className="text-sm text-gray-600">点击猫咪头顶的金币来收取</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🎨</span>
              <p className="text-sm text-gray-600">购买装饰，打造独一无二的餐厅</p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="mt-6 w-full py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold rounded-2xl hover:from-rose-500 hover:to-pink-500 transition-all active:scale-95 shadow-lg"
          >
            开始游戏！
          </button>
        </div>
      </div>
    </div>
  );
}
