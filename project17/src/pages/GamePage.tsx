import { GameScene } from '@/components/game/GameScene';
import { Inventory } from '@/components/game/Inventory';
import { DialogBox } from '@/components/game/DialogBox';
import { ClueBoard } from '@/components/game/ClueBoard';
import { PuzzleModal } from '@/components/game/PuzzleModal';
import { AtmosphereOverlay } from '@/components/game/AtmosphereOverlay';

export function GamePage() {
  return (
    <div className="relative w-full h-screen bg-old-brown overflow-hidden">
      <AtmosphereOverlay />
      
      <div className="relative w-full h-full pb-40">
        <GameScene />
      </div>
      
      <Inventory />
      <DialogBox />
      <ClueBoard />
      <PuzzleModal />
    </div>
  );
}
