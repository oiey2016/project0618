import { useGameStore } from '../../store/useGameStore';
import { ITEMS } from '../../game/gameData';
import { Scroll, Gem, Key, Flame, BookOpen } from 'lucide-react';

const iconMap: Record<string, typeof Scroll> = {
  scroll: Scroll,
  gem: Gem,
  key: Key,
  flame: Flame,
  'book-open': BookOpen,
  'flame-kindling': Flame,
};

export default function Inventory() {
  const inventory = useGameStore((s) => s.player.inventory);
  const selectedItemId = useGameStore((s) => s.selectedItemId);
  const selectItem = useGameStore((s) => s.selectItem);

  const handleItemClick = (itemId: string) => {
    if (selectedItemId === itemId) {
      selectItem(null);
    } else {
      selectItem(itemId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4">
      <div 
        className="rounded-lg p-4 shadow-xl"
        style={{
          background: 'linear-gradient(180deg, #8B7355 0%, #6B5A45 50%, #5C4A3A 100%)',
          border: '3px solid #4A3728',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg" style={{ boxShadow: '0 0 6px #ff6b6b' }} />
          <span className="text-amber-100 text-sm font-bold tracking-wider" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            物品栏
          </span>
        </div>
        
        <div className="flex gap-3 justify-center min-h-[70px] items-center">
          {inventory.length === 0 ? (
            <span className="text-amber-200/50 text-sm italic">空空如也...</span>
          ) : (
            inventory.map((itemId) => {
              const item = ITEMS[itemId];
              if (!item) return null;
              
              const IconComponent = iconMap[item.icon] || Scroll;
              const isSelected = selectedItemId === itemId;
              
              return (
                <button
                  key={itemId}
                  onClick={() => handleItemClick(itemId)}
                  className="relative w-14 h-14 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(180deg, #DAA520 0%, #B8860B 100%)'
                      : 'linear-gradient(180deg, #5C4A3A 0%, #3D3022 100%)',
                    border: isSelected ? '2px solid #FFD700' : '2px solid #4A3728',
                    boxShadow: isSelected
                      ? '0 0 15px rgba(255, 215, 0, 0.5), inset 0 1px 2px rgba(255,255,255,0.2)'
                      : 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.1)',
                  }}
                  title={`${item.name}: ${item.description}`}
                >
                  <IconComponent 
                    size={24} 
                    style={{ color: item.color, filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }} 
                  />
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 text-xs bg-amber-400 text-amber-900 rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      ✓
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
        
        {selectedItemId && ITEMS[selectedItemId] && (
          <div className="mt-3 pt-3 border-t border-amber-900/30">
            <p className="text-amber-100 text-sm">
              <span className="font-bold text-amber-200">{ITEMS[selectedItemId].name}：</span>
              {ITEMS[selectedItemId].description}
            </p>
            <p className="text-amber-200/70 text-xs mt-1">
              💡 点击场景中的物品使用
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
