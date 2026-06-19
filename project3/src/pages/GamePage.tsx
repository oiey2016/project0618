import { useEffect, useState } from 'react';
import { StatusBar } from '../components/ui/StatusBar';
import { BattleArea } from '../components/game/BattleArea';
import { HeroPanel } from '../components/heroes/HeroPanel';
import { SkillPanel } from '../components/skills/SkillPanel';
import { UpgradePanel } from '../components/upgrades/UpgradePanel';
import { TabNavigation } from '../components/ui/TabNavigation';
import { Modal } from '../components/ui/Modal';
import { GameRules } from '../components/ui/GameRules';
import { useGameStore } from '../store/useGameStore';
import { useGameLoop, useOfflineEarnings } from '../hooks/useGameLoop';

export function GamePage() {
  const activeTab = useGameStore(state => state.activeTab);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  
  useGameLoop();
  useOfflineEarnings();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d0518]">
      <StatusBar onOpenRules={() => setIsRulesOpen(true)} />
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col lg:flex-row min-h-full">
          <div className="flex-shrink-0 lg:flex-1 h-[50vh] lg:h-auto lg:min-h-screen flex flex-col min-h-0 lg:min-w-0 overflow-hidden relative">
            <BattleArea />
          </div>

          <div className="flex-1 lg:flex-shrink-0 lg:w-[420px] lg:min-h-screen flex flex-col min-h-[500px] bg-gradient-to-b from-purple-950/80 to-indigo-950/80 backdrop-blur-xl border-t-2 lg:border-t-0 lg:border-l-2 border-purple-800/50 shadow-2xl">
            <TabNavigation />
            
            <div className="flex-1 min-h-0 flex flex-col">
              {activeTab === 'heroes' && <HeroPanel />}
              {activeTab === 'skills' && <SkillPanel />}
              {activeTab === 'upgrades' && <UpgradePanel />}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="游戏规则说明"
      >
        <GameRules />
      </Modal>
    </div>
  );
}
