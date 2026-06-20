import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { PasswordLock } from '@/components/puzzles/PasswordLock';
import { SequencePuzzle } from '@/components/puzzles/SequencePuzzle';
import { MechanismBox } from '@/components/puzzles/MechanismBox';
import { AltarPuzzle } from '@/components/puzzles/AltarPuzzle';

export function PuzzleModal() {
  const {
    activePuzzle,
    closePuzzle,
    solvePuzzle,
    discoveredPassword,
    inventory,
    showDialog,
    getHint,
  } = useGameStore();

  const handleSolve = (answer: string | string[]): boolean => {
    if (!activePuzzle) return false;
    return solvePuzzle(activePuzzle.id, answer);
  };

  const handleHint = () => {
    if (activePuzzle) {
      showDialog(activePuzzle.hint);
    }
  };

  const renderPuzzle = () => {
    if (!activePuzzle) return null;

    switch (activePuzzle.type) {
      case 'password':
        return (
          <PasswordLock
            puzzle={activePuzzle}
            onSolve={(answer) => handleSolve(answer)}
            onClose={closePuzzle}
            discoveredPasswords={discoveredPassword}
            onHint={handleHint}
          />
        );
      case 'sequence':
        if (activePuzzle.id === 'altar-puzzle') {
          return (
            <AltarPuzzle
              puzzle={activePuzzle}
              onSolve={(answer) => handleSolve(answer)}
              onClose={closePuzzle}
              inventory={inventory}
              onHint={handleHint}
            />
          );
        }
        return (
          <SequencePuzzle
            puzzle={activePuzzle}
            onSolve={(answer) => handleSolve(answer)}
            onClose={closePuzzle}
            onHint={handleHint}
          />
        );
      case 'mechanism':
        return (
          <MechanismBox
            puzzle={activePuzzle}
            onSolve={(answer) => handleSolve(answer)}
            onClose={closePuzzle}
            inventory={inventory}
            onHint={handleHint}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {activePuzzle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-old-brown/95 p-4">
          {renderPuzzle()}
        </div>
      )}
    </AnimatePresence>
  );
}
