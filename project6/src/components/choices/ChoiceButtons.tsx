import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

const ChoiceButtons = () => {
  const { currentChoices, awaitingChoice, makeChoice } = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!awaitingChoice || currentChoices.length === 0) {
    return null;
  }

  const handleChoice = (choiceId: string) => {
    if (selectedId) return;
    setSelectedId(choiceId);
    setTimeout(() => {
      makeChoice(choiceId);
      setSelectedId(null);
    }, 300);
  };

  return (
    <div className="px-4 py-4 border-t border-neon-blue/20 bg-space-950/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3">
          选择你的回复：
        </p>
        <div className="flex flex-col gap-2">
          {currentChoices.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice.id)}
              disabled={selectedId !== null}
              className={`text-left px-4 py-3 rounded-lg border transition-all duration-300
                ${
                  selectedId === choice.id
                    ? 'bg-neon-blue/20 border-neon-blue scale-[0.99] opacity-70'
                    : selectedId !== null
                    ? 'opacity-40 cursor-not-allowed border-gray-700'
                    : 'border-neon-blue/40 hover:border-neon-blue hover:bg-neon-blue/10 hover:shadow-[0_0_15px_rgba(72,202,228,0.2)] cursor-pointer'
                }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-blue/20 border border-neon-blue/50 flex items-center justify-center text-neon-blue font-mono text-xs">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-200 leading-relaxed">
                  {choice.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChoiceButtons;
