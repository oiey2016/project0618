import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { useGameEngine } from '../hooks/useGameEngine';
import { ChoiceOption } from '../types';
import { Lock, ChevronRight } from 'lucide-react';

const DecisionPanel: React.FC = () => {
  const awaitingChoice = useGameStore((s) => s.awaitingChoice);
  const inventory = useGameStore((s) => s.inventory);
  const { getCurrentChoices, makeChoice } = useGameEngine();
  const choices = getCurrentChoices();

  if (!awaitingChoice || choices.length === 0) return null;

  const hasItem = (itemId?: string) => !itemId || inventory.some((i) => i.id === itemId);

  const ChoiceCard: React.FC<{ option: ChoiceOption; idx: number }> = ({ option, idx }) => {
    const locked = !hasItem(option.requiredItem);

    return (
      <button
        onClick={() => !locked && makeChoice(option)}
        disabled={locked}
        className={`group relative w-full text-left px-5 py-4 rounded-lg
          transition-all duration-300 animate-choice-in
          ${locked
            ? 'bg-bg-dark/40 border border-white/10 opacity-50 cursor-not-allowed'
            : 'bg-gradient-to-br from-bg-purple/80 to-bg-dark/80 border border-neon-pink/40 hover:border-neon-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 cursor-pointer'
          }`}
        style={{ animationDelay: `${idx * 100}ms` }}
      >
        <div className="flex items-start gap-3">
          <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold
            transition-all duration-300
            ${locked ? 'bg-white/10 text-white/30' : 'bg-neon-pink/20 text-neon-pink group-hover:bg-neon-cyan group-hover:text-bg-dark'}`}
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            {locked ? <Lock size={12} /> : idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm leading-relaxed ${locked ? 'text-white/40' : 'text-text-primary group-hover:text-neon-cyan'}`}
              style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}>
              {option.text}
            </p>
            {option.requiredItem && (
              <p className={`text-[10px] mt-1 flex items-center gap-1 ${locked ? 'text-neon-red/60' : 'text-neon-green'}`}
                style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                <ChevronRight size={10} />
                {locked ? '缺少物品' : '将使用物品'}
              </p>
            )}
            {option.effects && !locked && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {option.effects.health && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${option.effects.health > 0 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'}`}>
                    HP {option.effects.health > 0 ? '+' : ''}{option.effects.health}
                  </span>
                )}
                {option.effects.hunger && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${option.effects.hunger > 0 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-orange/20 text-neon-orange'}`}>
                    饱食 {option.effects.hunger > 0 ? '+' : ''}{option.effects.hunger}
                  </span>
                )}
                {option.effects.trust && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${option.effects.trust > 0 ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-neon-pink/20 text-neon-pink'}`}>
                    信任 {option.effects.trust > 0 ? '+' : ''}{option.effects.trust}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none
          ${locked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
          bg-[linear-gradient(135deg,transparent_40%,rgba(0,240,255,0.05)_50%,transparent_60%)]`}
        />
      </button>
    );
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 py-5 space-y-3
      bg-gradient-to-t from-bg-dark via-bg-dark/95 to-bg-dark/60 backdrop-blur-md
      border-t border-neon-pink/30 animate-panel-slide-up">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-4 bg-neon-cyan animate-pulse" />
        <p className="text-xs text-neon-cyan tracking-wider" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          ▸ 做出你的选择
        </p>
      </div>
      <div className="space-y-2.5">
        {choices.map((c, i) => (
          <ChoiceCard key={c.id} option={c} idx={i} />
        ))}
      </div>
    </div>
  );
};

export default DecisionPanel;
