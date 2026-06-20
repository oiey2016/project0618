import { useGameStore } from '@/store/useGameStore';
import { StartPage } from '@/pages/StartPage';
import { GamePage } from '@/pages/GamePage';
import { EndingPage } from '@/pages/EndingPage';

export default function App() {
  const { gamePhase } = useGameStore();

  const renderPage = () => {
    switch (gamePhase) {
      case 'start':
        return <StartPage />;
      case 'playing':
        return <GamePage />;
      case 'ending':
        return <EndingPage />;
      default:
        return <StartPage />;
    }
  };

  return (
    <div className="min-h-screen bg-old-brown">
      {renderPage()}
    </div>
  );
}
