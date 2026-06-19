import { useState, useEffect } from 'react';
import BackgroundLayer from '@/components/BackgroundLayer';
import StatusBar from '@/components/StatusBar';
import GameArea from '@/components/GameArea';
import CodexPanel from '@/components/CodexPanel';
import EvolutionToast from '@/components/EvolutionToast';
import RulesModal from '@/components/RulesModal';
import { startAutoSave, stopAutoSave } from '@/store/useGameStore';

export default function App() {
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  useEffect(() => {
    startAutoSave();
    return () => stopAutoSave();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden relative">
      <BackgroundLayer />
      <StatusBar onOpenCodex={() => setIsCodexOpen(true)} onOpenRules={() => setIsRulesOpen(true)} />
      <GameArea />
      <EvolutionToast />
      <CodexPanel isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
