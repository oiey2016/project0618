import { useGameStore } from '@/store/gameStore';
import { BLOCK_CONFIG, HOTBAR_BLOCKS } from '@/constants/blocks';
import { BlockType } from '@/types';

export default function Hotbar() {
  const selectedSlot = useGameStore((state) => state.player.selectedSlot);
  const inventory = useGameStore((state) => state.player.inventory);
  const setSelectedSlot = useGameStore((state) => state.setSelectedSlot);

  const getBlockEmoji = (type: BlockType | null): string => {
    if (!type) return '';
    const emojiMap: Record<BlockType, string> = {
      [BlockType.AIR]: '',
      [BlockType.GRASS]: '🌿',
      [BlockType.DIRT]: '🟫',
      [BlockType.STONE]: '🪨',
      [BlockType.WOOD]: '🪵',
      [BlockType.LEAVES]: '🍃',
      [BlockType.SAND]: '🟨',
      [BlockType.WATER]: '💧',
      [BlockType.PLANKS]: '🟧',
      [BlockType.COBBLESTONE]: '⬛',
    };
    return emojiMap[type] || '📦';
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-black/50 backdrop-blur-sm rounded-xl p-2 flex gap-2">
        {inventory.map((slot, index) => {
          const blockType = slot.blockType || HOTBAR_BLOCKS[index];
          const config = blockType ? BLOCK_CONFIG[blockType] : null;
          const isSelected = index === selectedSlot;

          return (
            <button
              key={index}
              onClick={() => setSelectedSlot(index)}
              className={`relative w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all duration-150 ${
                isSelected
                  ? 'bg-white/30 scale-110 ring-2 ring-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <span className="text-3xl">{getBlockEmoji(blockType)}</span>
              {config && (
                <span className="text-xs text-white/80 mt-1">{config.name}</span>
              )}
              <span className="absolute top-1 left-2 text-xs text-white/60 font-bold">
                {index + 1}
              </span>
              {slot.count > 0 && (
                <span className="absolute bottom-1 right-2 text-xs text-white font-bold bg-black/50 px-1 rounded">
                  {slot.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
