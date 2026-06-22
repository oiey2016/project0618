import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { X, BookOpen, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

interface PuzzleEntry {
  id: string;
  name: string;
  location: string;
  hint: string;
  answer: string;
}

const puzzles: PuzzleEntry[] = [
  {
    id: 'safe_hall',
    name: '大厅保险箱',
    location: '大厅左侧角落',
    hint: '看钟的时间...午夜十二点整',
    answer: '1200',
  },
  {
    id: 'cabinet_kitchen',
    name: '厨房橱柜',
    location: '厨房左侧',
    hint: '用大厅保险箱里的钥匙',
    answer: '青铜钥匙 🗝️',
  },
  {
    id: 'bookcase_study',
    name: '书房书架',
    location: '书房左侧',
    hint: '看墙上彩色画的颜色顺序',
    answer: '红 → 绿 → 蓝',
  },
  {
    id: 'garden_gate',
    name: '花园铁门',
    location: '花园尽头',
    hint: '以花之名...玫瑰的英文',
    answer: 'ROSE',
  },
  {
    id: 'cellar_door',
    name: '地窖门',
    location: '地窖深处',
    hint: '用书房书架谜题的钥匙',
    answer: '银色钥匙 🔑',
  },
  {
    id: 'mirror_room3',
    name: '三号房镜子',
    location: '客房三号左侧墙上',
    hint: '用书房桌上的羽毛擦干净',
    answer: '乌鸦羽毛 🪶',
  },
  {
    id: 'golden_box',
    name: '地窖金盒子',
    location: '地窖深处',
    hint: '用三号房镜子谜题的钥匙',
    answer: '金色钥匙 🔐',
  },
];

const recipes = [
  {
    name: '松露烤肉 🍖',
    guest: '野猪先生 🐗',
    ingredients: '神秘肉块 🥩 + 白松露 🥔',
  },
  {
    name: '毒玫瑰沙拉 🥗',
    guest: '孔雀夫人 🦚',
    ingredients: '带刺玫瑰 🌹 + 黑色蘑菇 🍄',
  },
  {
    name: '安眠派 🥧',
    guest: '鸽子小姐 🕊️',
    ingredients: '安眠种子 🌰 + 黑鸟蛋 🥚',
  },
];

export const PuzzleGuide: React.FC = () => {
  const { showingGuide, closeGuide, solvedPuzzles } = useGameStore();
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'puzzles' | 'recipes'>('puzzles');

  if (!showingGuide) {
    return null;
  }

  const toggleAnswer = (id: string) => {
    setShowAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllAnswers = () => {
    const allShown = puzzles.every(p => showAnswers[p.id]);
    const newState: Record<string, boolean> = {};
    puzzles.forEach(p => {
      newState[p.id] = !allShown;
    });
    setShowAnswers(newState);
  };

  const allShown = puzzles.every(p => showAnswers[p.id]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-shadow-black/85 backdrop-blur-sm animate-fade-in"
      onClick={closeGuide}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[80vh] mx-4 wood-texture rounded-lg border-4 border-rust-mid shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b-2 border-rust-mid/50 bg-rust-dark/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-candle-orange" />
            <h3 className="font-gothic text-2xl text-parchment text-glow">
              谜题速查
            </h3>
          </div>
          <button
            className="text-parchment/70 hover:text-parchment transition-colors"
            onClick={closeGuide}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="flex border-b border-rust-mid/30 bg-rust-dark/30">
          <button
            className={`flex-1 py-3 font-serif-old transition-all ${
              activeTab === 'puzzles'
                ? 'text-candle-yellow border-b-2 border-candle-orange bg-rust-dark/50'
                : 'text-parchment/60 hover:text-parchment'
            }`}
            onClick={() => setActiveTab('puzzles')}
          >
            🗝️ 谜题答案
          </button>
          <button
            className={`flex-1 py-3 font-serif-old transition-all ${
              activeTab === 'recipes'
                ? 'text-candle-yellow border-b-2 border-candle-orange bg-rust-dark/50'
                : 'text-parchment/60 hover:text-parchment'
            }`}
            onClick={() => setActiveTab('recipes')}
          >
            🍽️ 晚餐配方
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'puzzles' && (
            <>
              {/* 全部显示/隐藏按钮 */}
              <div className="mb-4 flex justify-end">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-parchment/70 hover:text-candle-yellow transition-colors bg-rust-dark/50 rounded border border-rust-mid/30"
                  onClick={toggleAllAnswers}
                >
                  {allShown ? <EyeOff size={16} /> : <Eye size={16} />}
                  {allShown ? '隐藏全部答案' : '显示全部答案'}
                </button>
              </div>

              {/* 谜题列表 */}
              <div className="space-y-3">
                {puzzles.map((puzzle, index) => {
                  const isSolved = solvedPuzzles.includes(puzzle.id);
                  const isAnswerShown = showAnswers[puzzle.id];

                  return (
                    <div
                      key={puzzle.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isSolved
                          ? 'bg-moss-dark/30 border-moss-green/40'
                          : 'bg-rust-dark/50 border-rust-mid/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-rust-light font-serif-old font-bold text-sm">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <h4 className="font-serif-old font-bold text-parchment">
                              {puzzle.name}
                            </h4>
                            {isSolved && (
                              <span className="px-2 py-0.5 bg-moss-green/30 text-moss-green text-xs rounded-full border border-moss-green/30">
                                ✓ 已解开
                              </span>
                            )}
                          </div>
                          <p className="text-parchment/60 text-sm mb-2">
                            📍 {puzzle.location}
                          </p>
                          <p className="text-parchment/80 text-sm italic">
                            💡 {puzzle.hint}
                          </p>
                        </div>
                        <button
                          className="flex-shrink-0 text-parchment/50 hover:text-candle-yellow transition-colors"
                          onClick={() => toggleAnswer(puzzle.id)}
                        >
                          {isAnswerShown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>

                      {/* 答案 */}
                      {isAnswerShown && (
                        <div className="mt-3 pt-3 border-t border-rust-mid/20 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <span className="text-candle-orange font-serif-old text-sm">
                              ✅ 答案：
                            </span>
                            <span className="text-candle-yellow font-bold text-lg">
                              {puzzle.answer}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'recipes' && (
            <div className="space-y-4">
              <div className="mb-4 p-3 bg-rust-dark/30 rounded-lg border border-rust-mid/20">
                <p className="text-parchment/70 text-sm text-center font-serif-old">
                  🍳 在厨房点击物品栏的「组合」按钮，选择两样食材制作晚餐
                </p>
              </div>

              {recipes.map((recipe, index) => (
                <div
                  key={recipe.name}
                  className="p-4 rounded-lg bg-rust-dark/50 border border-rust-mid/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-blood-dark/50 text-parchment font-bold rounded-full border border-blood-red/30">
                      {index + 1}
                    </span>
                    <h4 className="font-serif-old font-bold text-xl text-parchment">
                      {recipe.name}
                    </h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <div className="flex items-center gap-2">
                      <span className="text-parchment/50 text-sm">送给：</span>
                      <span className="text-parchment font-serif-old">
                        {recipe.guest}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-parchment/50 text-sm">配方：</span>
                      <span className="text-candle-yellow font-serif-old">
                        {recipe.ingredients}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="p-3 border-t border-rust-mid/30 bg-rust-dark/50 rounded-b-lg text-center">
          <p className="text-parchment/40 text-xs font-serif-old italic">
            点击答案右侧的箭头可以展开/折叠答案
          </p>
        </div>
      </div>
    </div>
  );
};
