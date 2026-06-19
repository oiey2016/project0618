import StartScreen from '@/components/screens/StartScreen';
import GameScreen from '@/components/screens/GameScreen';
import EndScreen from '@/components/screens/EndScreen';
import { useGameStore } from '@/store/gameStore';

export default function App() {
  const screen = useGameStore((state) => state.screen);

  return (
    <div className="relative w-full h-full bg-space-900 overflow-hidden">
      {screen === 'start' && <StartScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'end' && <EndScreen />}
    </div>
  );
}
