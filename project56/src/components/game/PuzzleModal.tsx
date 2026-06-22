import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getPuzzleById } from '../../data/puzzles';
import { X, HelpCircle } from 'lucide-react';

export const PuzzleModal: React.FC = () => {
  const { showingPuzzle, closePuzzle, solvePuzzle, showDialogue, hintsRemaining, useHint } = useGameStore();
  const [inputValue, setInputValue] = useState('');
  const [sequence, setSequence] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const puzzle = showingPuzzle ? getPuzzleById(showingPuzzle) : null;

  useEffect(() => {
    setInputValue('');
    setSequence([]);
    setError(false);
  }, [showingPuzzle]);

  if (!puzzle || !showingPuzzle) {
    return null;
  }

  const handleSubmit = () => {
    if (puzzle.type === 'password') {
      if (inputValue.toUpperCase() === String(puzzle.solution).toUpperCase()) {
        solvePuzzle(showingPuzzle);
      } else {
        setError(true);
        setTimeout(() => setError(false), 500);
        showDialogue('不对...再想想看。', '系统');
      }
    } else if (puzzle.type === 'sequence') {
      const solution = puzzle.solution as string[];
      if (JSON.stringify(sequence) === JSON.stringify(solution)) {
        solvePuzzle(showingPuzzle);
      } else {
        setError(true);
        setSequence([]);
        setTimeout(() => setError(false), 500);
        showDialogue('顺序不对...', '系统');
      }
    } else if (puzzle.type === 'item_use') {
      closePuzzle();
      showDialogue('需要用什么东西来打开它...', '系统');
    }
  };

  const handleSequenceClick = (item: string) => {
    if (sequence.length < 3) {
      setSequence([...sequence, item]);
    }
  };

  const resetSequence = () => {
    setSequence([]);
  };

  const sequenceItems = [
    { id: 'book_red', label: '红', color: 'bg-red-700' },
    { id: 'book_green', label: '绿', color: 'bg-green-700' },
    { id: 'book_blue', label: '蓝', color: 'bg-blue-700' },
    { id: 'book_yellow', label: '黄', color: 'bg-yellow-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-shadow-black/80 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-md mx-4 ${error ? 'animate-shake' : ''}`}>
        <div className="wood-texture p-6 rounded-lg border-4 border-rust-mid shadow-2xl">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-gothic text-2xl text-parchment text-glow">
              {puzzle.name}
            </h3>
            <button
              className="text-parchment/70 hover:text-parchment transition-colors"
              onClick={closePuzzle}
            >
              <X size={24} />
            </button>
          </div>

          {/* 描述 */}
          <p className="text-parchment/80 font-serif-old mb-6 leading-relaxed">
            {puzzle.description}
          </p>

          {/* 密码输入 */}
          {puzzle.type === 'password' && (
            <div className="mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="输入答案..."
                className="w-full px-4 py-3 bg-rust-dark border-2 border-rust-mid rounded text-parchment font-serif-old text-lg text-center focus:outline-none focus:border-candle-orange/50 transition-colors"
                autoFocus
              />
            </div>
          )}

          {/* 顺序谜题 */}
          {puzzle.type === 'sequence' && (
            <div className="mb-6">
              <div className="flex gap-3 justify-center mb-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 border-2 border-dashed border-rust-mid rounded flex items-center justify-center ${
                      sequence[i] ? sequenceItems.find(s => s.id === sequence[i])?.color : ''
                    }`}
                  >
                    {sequence[i] && (
                      <span className="text-parchment font-bold">
                        {sequenceItems.find(s => s.id === sequence[i])?.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-center">
                {sequenceItems.map((item) => (
                  <button
                    key={item.id}
                    className={`w-14 h-14 ${item.color} rounded font-bold text-parchment hover:scale-105 transition-transform border-2 border-parchment/30`}
                    onClick={() => handleSequenceClick(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                className="mt-3 text-parchment/60 text-sm hover:text-parchment transition-colors underline"
                onClick={resetSequence}
              >
                重置
              </button>
            </div>
          )}

          {/* 物品使用谜题提示 */}
          {puzzle.type === 'item_use' && (
            <div className="mb-6 text-center text-parchment/60 italic">
              （需要使用某个物品来解开）
            </div>
          )}

          {/* 按钮 */}
          <div className="flex gap-3 justify-center">
            {puzzle.type !== 'item_use' && (
              <button
                className="btn-vintage"
                onClick={handleSubmit}
              >
                确认
              </button>
            )}
            <button
              className="btn-vintage opacity-80"
              onClick={closePuzzle}
            >
              离开
            </button>
          </div>

          {/* 提示按钮 */}
          <div className="mt-4 text-center">
            <button
              className="flex items-center gap-1 mx-auto text-parchment/50 hover:text-candle-yellow transition-colors text-sm"
              onClick={useHint}
              disabled={hintsRemaining <= 0}
            >
              <HelpCircle size={16} />
              提示 ({hintsRemaining})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
