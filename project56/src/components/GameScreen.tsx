import React from 'react';
import { Scene } from './game/Scene';
import { Inventory } from './game/Inventory';
import { DialogBox } from './game/DialogBox';
import { PuzzleModal } from './game/PuzzleModal';
import { PuzzleGuide } from './game/PuzzleGuide';
import { useGameStore } from '../store/useGameStore';
import { HelpCircle, RotateCcw, BookOpen } from 'lucide-react';

export const GameScreen: React.FC = () => {
  const { useHint, hintsRemaining, resetGame, openGuide } = useGameStore();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 游戏场景 */}
      <Scene />
      
      {/* 物品栏 */}
      <Inventory />
      
      {/* 对话框 */}
      <DialogBox />
      
      {/* 谜题弹窗 */}
      <PuzzleModal />
      
      {/* 谜题速查弹窗 */}
      <PuzzleGuide />
      
      {/* 顶部工具栏 */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <button
          className="flex items-center gap-1 px-3 py-2 bg-shadow-black/60 backdrop-blur-sm rounded border border-rust-mid/50 text-parchment/70 hover:text-candle-yellow hover:border-candle-orange/50 transition-all text-sm"
          onClick={openGuide}
          title="谜题速查"
        >
          <BookOpen size={18} />
          <span className="font-serif-old hidden sm:inline">攻略</span>
        </button>
        <button
          className="flex items-center gap-1 px-3 py-2 bg-shadow-black/60 backdrop-blur-sm rounded border border-rust-mid/50 text-parchment/70 hover:text-parchment hover:border-candle-orange/50 transition-all text-sm"
          onClick={useHint}
          title="提示"
        >
          <HelpCircle size={18} />
          <span className="font-serif-old">{hintsRemaining}</span>
        </button>
        <button
          className="flex items-center gap-1 px-3 py-2 bg-shadow-black/60 backdrop-blur-sm rounded border border-rust-mid/50 text-parchment/70 hover:text-parchment hover:border-blood-red/50 transition-all text-sm"
          onClick={resetGame}
          title="重新开始"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* 全局氛围效果由 App 组件提供 */}
    </div>
  );
};
