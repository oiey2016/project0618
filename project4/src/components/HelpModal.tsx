import { X, HelpCircle, Coins, Utensils, Cat, Palette, Star, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-rose-600 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-rose-400" />
            游戏规则
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-amber-700">赚取金币</h3>
            </div>
            <p className="text-sm text-amber-600 leading-relaxed">
              猫咪顾客会自动走进餐厅点单用餐。等它们吃完后，头顶会出现金币，点击金币即可收取！猫咪越稀有，给的金币越多哦~
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-orange-700">研究菜品</h3>
            </div>
            <p className="text-sm text-orange-600 leading-relaxed">
              用金币研究新菜品，每道菜都会吸引不同的猫咪顾客。菜品越高级，能吸引的猫咪越稀有！
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                <Cat className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-purple-700">收集猫咪</h3>
            </div>
            <p className="text-sm text-purple-600 leading-relaxed">
              游戏中有14种不同的猫咪等你收集！从普通橘猫到传说级的黄金猫咪，看看你能遇到多少种~
            </p>
          </div>
          
          <div className="bg-teal-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-teal-700">装饰餐厅</h3>
            </div>
            <p className="text-sm text-teal-600 leading-relaxed">
              购买可爱的摆件来装扮你的餐厅，每样装饰都会增加餐厅的声望值，让你的餐厅更有名气！
            </p>
          </div>
          
          <div className="bg-rose-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-rose-700">提升等级</h3>
            </div>
            <p className="text-sm text-rose-600 leading-relaxed">
              收取金币可以获得经验值，升级后餐厅可以同时容纳更多猫咪顾客，还能解锁更稀有的猫咪！
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-amber-700">小提示</h3>
            </div>
            <ul className="text-sm text-amber-600 space-y-1">
              <li>• 游戏会自动保存进度</li>
              <li>• 猫咪有自己喜欢的食物</li>
              <li>• 稀有猫咪出现概率较低</li>
              <li>• 装饰可以重复摆放多个</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold rounded-2xl hover:from-rose-500 hover:to-pink-500 transition-all active:scale-95 shadow-lg"
        >
          我知道啦~
        </button>
      </div>
    </div>
  );
}
