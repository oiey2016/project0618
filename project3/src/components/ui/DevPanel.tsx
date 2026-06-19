import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { formatNumber } from '../../utils/formatter';
import { Wrench, Coins, Layers, Users, Sparkles, Shield, Zap, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface PresetButtonProps {
  label: string;
  description: string;
  onClick: () => void;
  variant: 'green' | 'blue' | 'purple';
}

function PresetButton({ label, description, onClick, variant }: PresetButtonProps) {
  const variants = {
    green: 'from-green-500/20 border-green-500/40 hover:from-green-500/40 text-green-300 hover:text-green-200',
    blue: 'from-blue-500/20 border-blue-500/40 hover:from-blue-500/40 text-blue-300 hover:text-blue-200',
    purple: 'from-purple-500/20 border-purple-500/40 hover:from-purple-500/40 text-purple-300 hover:text-purple-200',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border bg-gradient-to-r ${variants[variant]} transition-all duration-200 hover:scale-[1.02]`}
    >
      <div className="font-bold text-sm">{label}</div>
      <div className="text-xs opacity-80 mt-0.5">{description}</div>
    </button>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  colorClass: string;
}

function ActionButton({ icon, label, onClick, disabled, colorClass }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClass} transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [stageInput, setStageInput] = useState('');
  const [goldInput, setGoldInput] = useState('');

  const gold = useGameStore(state => state.gold);
  const stage = useGameStore(state => state.stage);
  const clickDamage = useGameStore(state => state.clickDamage);
  const dps = useGameStore(state => state.dps);
  const heroes = useGameStore(state => state.heroes);
  const unlockedHeroes = heroes.filter(h => h.unlocked).length;

  const addGold = useGameStore(state => state.addGold);
  const setStage = useGameStore(state => state.setStage);
  const unlockAllHeroes = useGameStore(state => state.unlockAllHeroes);
  const maxAllHeroes = useGameStore(state => state.maxAllHeroes);
  const maxAllSkills = useGameStore(state => state.maxAllSkills);
  const maxAllUpgrades = useGameStore(state => state.maxAllUpgrades);
  const resetGame = useGameStore(state => state.resetGame);
  const debugPreset = useGameStore(state => state.debugPreset);

  const handleAddGold = (amount: number) => {
    if (amount > 0) {
      addGold(amount);
    }
  };

  const handleSetStage = () => {
    const s = parseInt(stageInput);
    if (s >= 1) {
      setStage(s);
      setStageInput('');
    }
  };

  const handleCustomGold = () => {
    const g = parseInt(goldInput);
    if (g >= 0) {
      addGold(g);
      setGoldInput('');
    }
  };

  return (
    <div className="fixed right-2 lg:right-4 top-2 lg:top-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-amber-600/40 to-orange-600/40 hover:from-amber-500/60 hover:to-orange-500/60 border border-amber-500/40 hover:border-amber-400/60 text-amber-200 hover:text-amber-100 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105"
      >
        <Wrench className="w-4 h-4" />
        <span className="text-xs font-bold hidden sm:inline">调试面板</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[320px max-w-[90vw] rounded-2xl bg-gradient-to-br from-p