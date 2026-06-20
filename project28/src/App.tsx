import { useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { StartScreen } from './components/StartScreen';
import { ResultScreen } from './components/ResultScreen';
import { HUD } from './components/HUD';
import { useGameStore } from './store/useGameStore';
import { unlockAudio } from './game/audio';

function App() {
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    const h = () => unlockAudio();
    window.addEventListener('pointerdown', h, { once: true });
    window.addEventListener('keydown', h, { once: true });
    return () => {
      window.removeEventListener('pointerdown', h);
      window.removeEventListener('keydown', h);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col overflow-hidden">
      <div className="relative w-full h-full max-h-screen flex items-center justify-center p-3 md:p-6">
        <div
          className="relative w-full h-full max-w-[1400px] max-h-[820px] aspect-[16/9] rounded-[28px] overflow-hidden border-2 border-white/10"
          style={{
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px -20px rgba(0,0,0,0.6), inset 0 0 100px rgba(0,0,0,0.3)',
          }}
        >
          <GameCanvas />
          <HUD />
          {phase === 'menu' && <StartScreen />}
          <ResultScreen />

          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-game">
              DodgeBall
            </span>
          </div>
          <div className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-game">
              v1.0 · 本地对战
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
