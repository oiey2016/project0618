import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import type { Quiz, QuizResult } from '../types/game';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onAnswer: (quiz: Quiz, selectedIndex: number) => QuizResult;
  eraTheme: {
    primary: string;
    secondary: string;
  };
}

export function QuizModal({ quiz, onClose, onAnswer, eraTheme }: QuizModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (index: number) => {
    if (result) return;
    setSelectedIndex(index);
    const quizResult = onAnswer(quiz, index);
    setResult(quizResult);
    setTimeout(() => setShowExplanation(true), 500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-lg rounded-2xl p-1"
          style={{
            background: `linear-gradient(135deg, ${eraTheme.primary}, ${eraTheme.secondary})`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-xl bg-slate-900/95 p-6 md:p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5" style={{ color: eraTheme.primary }} />
                <span className="font-display text-sm font-bold uppercase tracking-wider" style={{ color: eraTheme.secondary }}>
                  知识问答
                </span>
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-white leading-relaxed">
                {quiz.question}
              </h2>
            </div>

            <div className="space-y-3">
              {quiz.options.map((option, index) => {
                const isSelected = selectedIndex === index;
                const isCorrect = result && index === quiz.correctIndex;
                const isWrong = result && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    whileHover={!result ? { scale: 1.02, x: 4 } : {}}
                    whileTap={!result ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(index)}
                    disabled={!!result}
                    animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`
                      w-full p-4 rounded-xl text-left font-body text-base md:text-lg transition-all duration-300
                      flex items-center gap-3
                      ${result
                        ? isCorrect
                          ? 'bg-green-500/20 border-2 border-green-400 text-green-200'
                          : isWrong
                            ? 'bg-red-500/20 border-2 border-red-400 text-red-200'
                            : 'bg-white/5 border-2 border-white/10 text-white/40'
                        : isSelected
                          ? 'bg-white/15 border-2 border-white/40 text-white'
                          : 'bg-white/5 border-2 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                      }
                    `}
                  >
                    <span className={`
                      w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-display font-bold text-sm md:text-base flex-shrink-0
                      ${result
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : isWrong
                            ? 'bg-red-500 text-white'
                            : 'bg-white/10 text-white/40'
                        : 'bg-white/10 text-white'
                      }
                    `}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                      >
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </motion.div>
                    )}
                    {isWrong && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                      >
                        <XCircle className="w-6 h-6 text-red-400" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 p-4 rounded-xl"
                  style={{
                    background: result.correct
                      ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))'
                      : 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))',
                    border: result.correct ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(251,191,36,0.3)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="font-display font-bold text-sm uppercase tracking-wider" style={{ color: result.correct ? '#4ade80' : '#fbbf24' }}>
                      {result.correct ? '回答正确！' : '知识补给站'}
                    </span>
                  </div>
                  <p className="font-body text-white/80 text-sm md:text-base leading-relaxed italic">
                    {result.explanation}
                  </p>
                  {!result.correct && (
                    <p className="mt-2 font-body text-amber-200/70 text-sm">
                      正确答案：<span className="font-bold">{result.correctAnswer}</span>
                    </p>
                  )}
                  <p className="mt-3 font-display font-bold text-sm" style={{ color: result.correct ? '#4ade80' : '#fbbf24' }}>
                    +{result.pointsEarned} 知识点数
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {result && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-6 w-full py-3 rounded-xl font-display font-bold text-white transition-all"
                style={{
                  background: `linear-gradient(135deg, ${eraTheme.primary}, ${eraTheme.secondary})`,
                }}
              >
                继续探索
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
