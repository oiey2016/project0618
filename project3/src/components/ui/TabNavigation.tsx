import { useGameStore } from '../../store/useGameStore';
import { Users, Sparkles, TrendingUp } from 'lucide-react';

export function TabNavigation() {
  const activeTab = useGameStore(state => state.activeTab);
  const setActiveTab = useGameStore(state => state.setActiveTab);

  const tabs = [
    { id: 'heroes' as const, label: '英雄', icon: Users, color: 'yellow' },
    { id: 'skills' as const, label: '技能', icon: Sparkles, color: 'blue' },
    { id: 'upgrades' as const, label: '强化', icon: TrendingUp, color: 'green' },
  ];

  const colorClasses = {
    yellow: {
      active: 'from-yellow-500/20 via-orange-500/10 to-transparent text-yellow-400 border-yellow-500',
      hover: 'hover:bg-yellow-500/10 hover:text-yellow-300',
      icon: 'text-yellow-400',
    },
    blue: {
      active: 'from-blue-500/20 via-cyan-500/10 to-transparent text-blue-400 border-blue-500',
      hover: 'hover:bg-blue-500/10 hover:text-blue-300',
      icon: 'text-blue-400',
    },
    green: {
      active: 'from-green-500/20 via-emerald-500/10 to-transparent text-green-400 border-green-500',
      hover: 'hover:bg-green-500/10 hover:text-green-300',
      icon: 'text-green-400',
    },
  };

  return (
    <div className="relative grid grid-cols-3 border-b border-purple-800/40">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const colors = colorClasses[tab.color];

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-t ${colors.active} border-b-2`
                : `text-gray-500 ${colors.hover}`
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-transform duration-300 ${
                isActive ? 'scale-110' : ''
              } ${isActive ? colors.icon : ''}`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className="text-xs font-bold tracking-wide"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {tab.label}
            </span>

            {isActive && (
              <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-current opacity-80" />
            )}
          </button>
        );
      })}
    </div>
  );
}
