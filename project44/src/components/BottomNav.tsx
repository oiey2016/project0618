import { Hammer, Wrench, Map, Backpack } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import type { ActivePanel } from '../types/game';

const navItems: { id: ActivePanel; icon: typeof Hammer; label: string }[] = [
  { id: 'build', icon: Hammer, label: '建造' },
  { id: 'craft', icon: Wrench, label: '制作' },
  { id: 'explore', icon: Map, label: '探索' },
  { id: 'inventory', icon: Backpack, label: '背包' },
];

export const BottomNav = () => {
  const { activePanel, setActivePanel, isUnderAttack, isExploring } = useGameStore();

  const handleClick = (panel: ActivePanel) => {
    if (activePanel === panel) {
      setActivePanel('none');
    } else {
      setActivePanel(panel);
    }
  };

  const isDisabled = isUnderAttack;

  return (
    <div className="bg-gradient-to-t from-wasteland-surface via-wasteland-surface2 to-transparent border-t border-wasteland-border pt-2 pb-3 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            const disabled = isDisabled && item.id !== 'inventory';

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                disabled={disabled}
                className={`
                  flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all
                  ${isActive
                    ? 'bg-rust-600/30 border border-rust-500 text-rust-300 shadow-rust-glow'
                    : 'bg-wasteland-surface border border-wasteland-border text-wasteland-muted hover:text-wasteland-text hover:border-rust-700'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.id === 'explore' && isExploring && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
