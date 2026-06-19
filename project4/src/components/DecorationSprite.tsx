import { useGameStore } from '@/store/gameStore';
import { getDecorationById } from '@/data/decorations';

interface DecorationSpriteProps {
  placedId: string;
}

export function DecorationSprite({ placedId }: DecorationSpriteProps) {
  const placedDecoration = useGameStore((state) =>
    state.placedDecorations.find(d => d.id === placedId)
  );
  
  const decoration = placedDecoration 
    ? getDecorationById(placedDecoration.decorationId) 
    : null;
  
  if (!placedDecoration || !decoration) return null;
  
  return (
    <div
      className="absolute text-3xl select-none pointer-events-none z-0"
      style={{
        left: `${placedDecoration.positionX}%`,
        top: `${placedDecoration.positionY}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {decoration.emoji}
    </div>
  );
}
