import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useGameEngine } from '../hooks/useGameEngine';
import { Item } from '../types';
import { Package, Lock, Sparkles } from 'lucide-react';

const Inventory: React.FC = () => {
  const inventory = useGameStore((s) => s.inventory);
  const awaitingChoice = useGameStore((s) => s.awaitingChoice);
  const { useItem, getCurrentChoices } = useGameEngine();
  const [hovered, setHovered] = useState<string | null>(null);

  const slots = Array.from({ length: 6 }, (_, i) => inventory[i] || null);
  const choices = getCurrentChoices();
  const usableItemIds = choices.filter((c) => c.requiredItem).map((c) => c.requiredItem!);

  const handleItemClick = (item: Item) => {
    if (!awaitingChoice) return;
    if (usableItemIds.includes(item.id)) {
      useItem(item.id);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-t from-bg-dark/90 to-bg-purple/40 backdrop-blur border-t border-neon-pink/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-neon-pink" />
          <h3
            className="text-xs text-neon-pink tracking-widest"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            // 物品栏 [{inventory.length}/6]
          </h3>
        </div>
        {awaitingChoice && usableItemIds.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-neon-cyan animate-pulse"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <Sparkles size={10} />
            可使用物品
          </span>
        )}
      </div>

      <div className="grid grid-cols-6 gap-2">
        {slots.map((item, idx) => (
          <div
            key={idx}
            className="relative group"
            onMouseEnter={() => item && setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {item ? (
              <button
                onClick={() => handleItemClick(item)}
                disabled={!awaitingChoice || !usableItemIds.includes(item.id)}
                className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5
                  transition-all duration-300 relative overflow-hidden
                  ${usableItemIds.includes(item.id) && awaitingChoice
                    ? 'bg-neon-cyan/10 border-2 border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-neon-cyan/20 cursor-pointer'
                    : 'bg-bg-dark/60 border border-neon-pink/20 hover:border-neon-pink/50'
                  }`}
              >
                <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,45,149,0.5)]">{item.icon}</span>
                <span className="text-[9px] text-text-muted truncate w-full text-center px-1"
                  style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
                  {item.name}
                </span>
                {usableItemIds.includes(item.id) && awaitingChoice && (
                  <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/20 to-transparent pointer-events-none" />
                )}
              </button>
            ) : (
              <div className="w-full aspect-square rounded-lg bg-bg-dark/40 border border-dashed border-white/5 flex items-center justify-center">
                <Lock size={12} className="text-white/10" />
              </div>
            )}

            {item && hovered === item.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 z-50
                px-3 py-2 rounded-lg bg-bg-dark/95 border border-neon-cyan/40 backdrop-blur
                animate-fade-in shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <p className="text-xs text-neon-cyan font-bold mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  {item.name}
                </p>
                <p className="text-[11px] text-text-muted leading-tight" style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
                  {item.description}
                </p>
                {usableItemIds.includes(item.id) && awaitingChoice && (
                  <p className="text-[10px] text-neon-green mt-1.5 animate-pulse">▸ 点击使用</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
