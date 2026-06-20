import { ITEMS } from '@/data/items'

interface ItemBarProps {
  allowedItems: string[]
  usedCount: number
  maxItems: number
  onSelectItem: (name: string) => void
}

const ITEM_ICONS: Record<string, string> = {
  box: '📦',
  balloon: '🎈',
  spring: '🌀',
  bridge: '🪵',
  wall: '🧱',
  fan: '💨',
  ice: '🧊',
}

export default function ItemBar({ allowedItems, usedCount, maxItems, onSelectItem }: ItemBarProps) {
  const items = ITEMS.filter((item) => allowedItems.includes(item.id))

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 flex flex-col gap-2 items-center">
        <span className="text-white font-nunito text-xs font-bold mb-1">
          {usedCount}/{maxItems}
        </span>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item.name)}
            disabled={usedCount >= maxItems}
            className="btn-paper flex flex-col items-center gap-0.5 p-2 rounded-xl bg-white/80 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-xl">{ITEM_ICONS[item.id] || '❓'}</span>
            <span className="font-nunito text-[10px] text-[#3D2B1F] font-bold">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
