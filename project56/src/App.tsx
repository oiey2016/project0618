import { useGameStore } from './store/useGameStore';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { EndingScreen } from './components/EndingScreen';

export default function App() {
  const { gamePhase } = useGameStore();

  return (
    <div className="relative w-full h-full bg-shadow-black">
      {/* 全局氛围效果 */}
      <div className="grain-overlay" />
      <div className="vignette" />
      
      {/* 根据游戏阶段显示不同界面 */}
      {gamePhase === 'start' && <StartScreen />}
      {gamePhase === 'playing' && <GameScreen />}
      {gamePhase === 'ending' && <EndingScreen />}
    </div>
  );
}
