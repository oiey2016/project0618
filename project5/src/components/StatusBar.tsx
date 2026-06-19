import { useMemo } from 'react';
import { Book, RotateCcw, Sparkles, Merge, Trophy, HelpCircle } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { EVOLUTION_STAGES, SPECIES } from '@/data/evolutionTree';

interface StatusBarProps {
  onOpenCodex: () => void;
  onOpenRules: () => void;
}

export default function StatusBar({ onOpenCodex, onOpenRules }: StatusBarProps) {
  const {
    currentStage,
    highestLevel,
    unlockedSpecies,
    totalMerges,
    resetGame,
  } = useGameStore();

  const stage = useMemo(() => {
    return EVOLUTION_STAGES.find(s => s.id === currentStage) || EVOLUTION_STAGES[0];
  }, [currentStage]);

  const highestSpecies = useMemo(() => {
    return SPECIES.find(s => s.level === highestLevel);
  }, [highestLevel]);

  const handleReset = () => {
    if (window.confirm('确定要重新开始吗？所有进度将会丢失。')) {
      resetGame();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="glass-panel px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl text-divine-400 tracking-wider">
              造物主
            </h1>
            <span className="text-white/40 text-sm hidden sm:inline">
              佛系合成 · 见证进化
            </span>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block" />

          <div className="flex items-center gap-1 text-divine-300">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-sm font-medium hidden sm:inline">
              {stage.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-white/70">
              <Trophy size={14} className="text-divine-400" />
              <span>最高：</span>
              <span className="text-white font-medium">
                {highestSpecies ? `${highestSpecies.emoji} ${highestSpecies.name}` : '—'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-white/70">
              <Book size={14} className="text-life-400" />
              <span>图鉴：</span>
              <span className="text-life-400 font-medium">
                {unlockedSpecies.length}/{SPECIES.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-white/70">
              <Merge size={14} className="text-ocean-400" />
              <span>合成：</span>
              <span className="text-ocean-400 font-medium">
                {totalMerges}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRules}
              className="glass-button flex items-center gap-1.5 text-sm"
              title="游戏规则"
            >
              <HelpCircle size={16} />
              <span className="hidden sm:inline">规则</span>
            </button>

            <button
              onClick={onOpenCodex}
              className="glass-button flex items-center gap-1.5 text-sm"
              title="打开图鉴"
            >
              <Book size={16} />
              <span className="hidden sm:inline">图鉴</span>
            </button>

            <button
              onClick={handleReset}
              className="glass-button flex items-center gap-1.5 text-sm hover:bg-red-500/20 hover:border-red-500/30"
              title="重新开始"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">重置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
