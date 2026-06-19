import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TabType } from '@/types/game';

interface TabPanelProps {
  tabs: { id: TabType; label: string; icon: React.ReactNode }[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

export const TabPanel = ({ tabs, activeTab, onTabChange, className }: TabPanelProps) => {
  return (
    <div className={cn('flex bg-stone-900 rounded-lg p-1 gap-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-bold text-sm transition-all duration-200',
            activeTab === tab.id
              ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white shadow-lg'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          )}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

interface TabContentProps {
  active: boolean;
  children: React.ReactNode;
}

export const TabContent = ({ active, children }: TabContentProps) => {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
