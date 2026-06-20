import { GameCanvas } from './components/GameCanvas';
import { Scoreboard } from './components/Scoreboard';
import { StartScreen } from './components/StartScreen';
import { RoundOverlay } from './components/RoundOverlay';
import { GameEndModal } from './components/GameEndModal';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';

export default function App() {
  useGameLoop();
  useKeyboard();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center
                    bg-arena-bg text-white
                    select-none">
      <div className="absolute inset-0 pointer-events-none noise-overlay opacity-50" />

      <div className="relative z-10 w-full flex flex-col items-center gap-6 px-4 py-6
                      max-w-[780px] mx-auto">
        <div className="w-full flex-shrink-0">
          <Scoreboard />
        </div>

        <div className="relative">
          <GameCanvas className="relative z-0" />
          <StartScreen />
          <RoundOverlay />
          <GameEndModal />
        </div>

        <div className="w-full text-center">
          <p className="text-xs text-slate-600 font-body tracking-wide">
            提示：同时按下多个方向键可进行斜向移动 · 利用惯性和角度撞击更有力
          </p>
        </div>
      </div>
    </div>
  );
}
