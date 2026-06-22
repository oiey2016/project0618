import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getItemById } from '../../data/items';

export const Inventory: React.FC = () => {
  const { inventory, selectedItem, selectItem, combineItems: storeCombineItems, showDialogue } = useGameStore();
  const [combineMode, setCombineMode] = useState(false);
  const [firstItem, setFirstItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    if (combineMode) {
      if (!firstItem) {
        setFirstItem(itemId);
        showDialogue('选择第二个物品进行组合...', '系统');
      } else if (firstItem === itemId) {
        setFirstItem(null);
        setCombineMode(false);
        showDialogue('取消组合', '系统');
      } else {
        const success = storeCombineItems(firstItem, itemId);
        setFirstItem(null);
        setCombineMode(false);
        if (!success) {
          showDialogue('这两样东西没法组合...', '系统');
        }
      }
    } else {
      if (selectedItem === itemId) {
        selectItem(null);
      } else {
        selectItem(itemId);
        const item = getItemById(itemId);
        if (item) {
          showDialogue(`选中了 ${item.name}。点击场景中的物品来使用它。`, '系统');
        }
      }
    }
  };

  const toggleCombineMode = () => {
    if (combineMode) {
      setCombineMode(false);
      setFirstItem(null);
      showDialogue('退出组合模式', '系统');
    } else {
      if (inventory.length < 2) {
        showDialogue('物品太少了，还没法组合...', '系统');
        return;
      }
      setCombineMode(true);
      setFirstItem(null);
      showDialogue('选择两个物品进行组合...', '系统');
    }
  };

  // 空槽位数
  const emptySlots = Math.max(0, 8 - inventory.length);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      {/* 物品栏主体 */}
      <div className="wood-texture border-t-4 border-rust-mid">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* 物品槽位 */}
            <div className="flex gap-2 flex-1 justify-center">
              {inventory.map((itemId) => {
                const item = getItemById(itemId);
                if (!item) return null;
                
                const isSelected = selectedItem === itemId;
                const isFirstCombine = firstItem === itemId;
                
                return (
                  <div
                    key={itemId}
                    className={`item-slot ${isSelected ? 'selected' : ''} ${
                      isFirstCombine ? 'ring-2 ring-candle-yellow' : ''
                    } relative`}
                    onClick={() => handleItemClick(itemId)}
                    title={`${item.name}\n${item.description}`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    
                    {/* 物品名称提示 */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-50">
                      <div className="bg-shadow-black/90 text-parchment text-xs px-2 py-1 rounded border border-rust-mid/50">
                        {item.name}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* 空槽位 */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="item-slot opacity-30"
                >
                  <span className="text-rust-mid/30 text-2xl">?</span>
                </div>
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded text-sm font-serif-old transition-all duration-200 ${
                  combineMode
                    ? 'bg-candle-orange/30 text-candle-yellow border border-candle-orange/50'
                    : 'bg-rust-deep/50 text-parchment/70 border border-rust-mid/50 hover:bg-rust-deep hover:text-parchment'
                }`}
                onClick={toggleCombineMode}
                title="组合物品"
              >
                🔧 组合
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 当前选中物品提示 */}
      {selectedItem && !combineMode && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="bg-shadow-black/80 text-candle-yellow text-sm px-4 py-1 rounded-full border border-candle-orange/30 animate-pulse">
            已选中：{getItemById(selectedItem)?.name}
          </div>
        </div>
      )}
    </div>
  );
};
