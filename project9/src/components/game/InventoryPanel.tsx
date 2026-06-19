import { useState, useRef, useEffect } from 'react';
import { Backpack, Trash2, Sparkles, Package } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { ITEMS } from '@/data/items';
import type { ItemRarity } from '@/types';
import { cn } from '@/lib/utils';
import DecorativeCard from '@/components/common/DecorativeCard';
import GoldButton from '@/components/common/GoldButton';

const rarityStyles: Record<ItemRarity, { border: string; glow: string; text: string; bg: string; label: string }> = {
  common: {
    border: 'border-space-300/50',
    glow: '',
    text: 'text-space-100',
    bg: 'from-space-400/40 to-space-500/60',
    label: '普通',
  },
  rare: {
    border: 'border-plasma-400/50',
    glow: 'shadow-[0_0_12px_rgba(0,212,255,0.25)]',
    text: 'text-plasma-100',
    bg: 'from-plasma-500/10 to-space-500/60',
    label: '稀有',
  },
  legendary: {
    border: 'border-stardust-400/60',
    glow: 'shadow-[0_0_16px_rgba(212,175,55,0.35)]',
    text: 'text-stardust-200',
    bg: 'from-stardust-500/15 to-space-500/60',
    label: '传说',
  },
};

const TOTAL_SLOTS = 8;

interface ActionMenuState {
  itemId: string;
  x: number;
  y: number;
}

export const InventoryPanel: React.FC = () => {
  const { inventory, useItem: doUseItem, discardItem } = useGameStore();
  const [menu, setMenu] = useState<ActionMenuState | null>(null);
  const [tooltip, setTooltip] = useState<{ itemId: string; x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const slots: Array<{ itemId: string | null; quantity: number }> = [];

  for (const inv of inventory) {
    slots.push({ itemId: inv.itemId, quantity: inv.quantity });
  }
  while (slots.length < TOTAL_SLOTS) {
    slots.push({ itemId: null, quantity: 0 });
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const openMenu = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = (e.currentTarget as HTMLElement).closest('[data-inv-container]')?.getBoundingClientRect();
    if (!containerRect) return;
    setMenu({
      itemId,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height + 6,
    });
  };

  const showTooltip = (itemId: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = (e.currentTarget as HTMLElement).closest('[data-inv-container]')?.getBoundingClientRect();
    if (!containerRect) return;
    setTooltip({
      itemId,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
  };

  return (
    <DecorativeCard
      title="行李舱"
      icon={Backpack}
      className="h-full flex flex-col"
    >
      <div data-inv-container className="relative">
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot, idx) => {
            const item = slot.itemId ? ITEMS.find((i) => i.id === slot.itemId) : null;
            const rarity = item ? rarityStyles[item.rarity] : null;
            const isEmpty = !slot.itemId;

            return (
              <div
                key={idx}
                className={cn(
                  'relative aspect-square rounded-sm flex items-center justify-center select-none',
                  'transition-all duration-200',
                  isEmpty
                    ? 'border-2 border-dashed border-space-300/20 bg-space-500/20'
                    : cn(
                        'border cursor-pointer bg-gradient-to-br',
                        rarity?.border,
                        rarity?.glow,
                        rarity?.bg,
                        'hover:brightness-110'
                      )
                )}
                onContextMenu={item ? (e) => openMenu(item.id, e) : undefined}
                onClick={item ? (e) => openMenu(item.id, e) : undefined}
                onMouseEnter={item ? (e) => showTooltip(item.id, e) : undefined}
                onMouseLeave={() => setTooltip(null)}
              >
                {isEmpty ? (
                  <Package className="w-5 h-5 text-space-300/20" />
                ) : (
                  <>
                    <div className="text-2xl leading-none" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
                      {item!.icon}
                    </div>
                    <div className="absolute bottom-0.5 left-1 right-1 text-center leading-tight">
                      <div className={cn(
                        'text-[9px] font-display uppercase tracking-tight truncate',
                        rarity?.text,
                        'opacity-90'
                      )}>
                        {item!.name}
                      </div>
                    </div>
                    {slot.quantity > 1 && (
                      <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-space-800 border border-stardust-400/50 text-[10px] font-bold text-stardust-200 font-mono">
                        {slot.quantity}
                      </div>
                    )}
                    {item!.rarity !== 'common' && (
                      <Sparkles className={cn(
                        'absolute top-1 left-1 w-3 h-3 opacity-70',
                        item!.rarity === 'legendary' ? 'text-stardust-300 animate-twinkle' : 'text-plasma-300'
                      )} />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {tooltip && (() => {
          const item = ITEMS.find((i) => i.id === tooltip.itemId);
          if (!item) return null;
          const r = rarityStyles[item.rarity];
          return (
            <div
              className={cn(
                'absolute z-30 w-52 -translate-x-1/2 -translate-y-full rounded-sm p-3',
                'ornate-border bg-space-700/95 backdrop-blur pointer-events-none',
                r.border
              )}
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={cn('font-display text-sm font-bold tracking-wider truncate', r.text)}>
                    {item.name}
                  </div>
                  <div className={cn(
                    'text-[10px] uppercase tracking-widest font-display',
                    item.rarity === 'legendary' ? 'text-stardust-300' : item.rarity === 'rare' ? 'text-plasma-300' : 'text-space-200'
                  )}>
                    {r.label} · {item.category === 'consumable' ? '消耗品' : item.category === 'equipment' ? '装备' : '特殊'}
                  </div>
                </div>
              </div>
              <div className="text-xs text-space-100/80 leading-relaxed font-serif">
                {item.description}
              </div>
            </div>
          );
        })()}

        {menu && (() => {
          const item = ITEMS.find((i) => i.id === menu.itemId);
          if (!item) return null;
          const canUse = item.consumable;
          return (
            <div
              ref={menuRef}
              className="absolute z-40 -translate-x-1/2 rounded-sm p-2 flex flex-col gap-1.5 min-w-[140px] ornate-border bg-space-800/98 backdrop-blur"
              style={{ left: menu.x, top: menu.y }}
            >
              <GoldButton
                size="sm"
                variant={canUse ? 'primary' : 'ghost'}
                className="w-full justify-start"
                disabled={!canUse}
                onClick={() => {
                  if (canUse) doUseItem(menu.itemId);
                  setMenu(null);
                }}
              >
                {canUse ? '使用' : '特殊物品暂不可主动使用'}
              </GoldButton>
              <GoldButton
                size="sm"
                variant="danger"
                className="w-full justify-start"
                icon={Trash2}
                onClick={() => {
                  discardItem(menu.itemId);
                  setMenu(null);
                }}
              >
                丢弃
              </GoldButton>
            </div>
          );
        })()}
      </div>

      <div className="mt-auto pt-3 mt-3 border-t border-stardust-400/20 flex items-center justify-between text-xs">
        <span className="text-space-200/60 font-display tracking-wider">
          已装载 {inventory.reduce((a, b) => a + b.quantity, 0)} 件物品
        </span>
        <span className="text-space-200/60 font-display tracking-wider">
          {inventory.length} / {TOTAL_SLOTS}
        </span>
      </div>
    </DecorativeCard>
  );
};

export default InventoryPanel;
