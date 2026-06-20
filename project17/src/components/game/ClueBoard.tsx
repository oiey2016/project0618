import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Lightbulb } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { ClueCard } from '@/components/ui/ClueCard';
import { Button } from '@/components/ui/Button';

export function ClueBoard() {
  const { clues, clueConnections, showClueBoard, toggleClueBoard, connectClues, discoveredPassword } = useGameStore();
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const [draggedClue, setDraggedClue] = useState<string | null>(null);
  
  const foundClues = clues.filter(clue => clue.found);
  const discoveredConnections = clueConnections.filter(conn => conn.discovered);

  const handleDragStart = (clueId: string) => {
    setDraggedClue(clueId);
  };

  const handleDragEnd = () => {
    setDraggedClue(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetClueId: string) => {
    if (draggedClue && draggedClue !== targetClueId) {
      connectClues(draggedClue, targetClueId);
    }
    setDraggedClue(null);
  };

  const handleCardClick = (clueId: string) => {
    if (selectedClue && selectedClue !== clueId) {
      connectClues(selectedClue, clueId);
      setSelectedClue(null);
    } else {
      setSelectedClue(selectedClue === clueId ? null : clueId);
    }
  };

  const renderConnections = () => {
    return discoveredConnections.map((conn, index) => (
      <motion.div
        key={`${conn.from}-${conn.to}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="p-4 bg-old-brown rounded-lg border border-blood-red"
      >
        <div className="flex items-center gap-2 text-blood-red text-sm mb-2">
          <Link2 className="w-4 h-4" />
          <span className="font-display font-bold">关联发现</span>
        </div>
        <p className="text-bone-white text-sm">{conn.result}</p>
        {conn.unlocks?.type === 'password' && (
          <div className="mt-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-mono text-lg font-bold">
              密码: {conn.unlocks.value}
            </span>
          </div>
        )}
      </motion.div>
    ));
  };

  return (
    <AnimatePresence>
      {showClueBoard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-old-brown overflow-y-auto"
        >
          <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-4xl text-bone-white font-bold mb-2">线索墙</h2>
                  <p className="text-bone-white/60 font-body">
                    拖拽或点击两张线索卡片进行关联，发现隐藏的真相
                  </p>
                </div>
                <Button variant="ghost" onClick={toggleClueBoard}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {discoveredPassword.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-blood-red/30 rounded-xl border border-blood-red"
                >
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-400" />
                    <div>
                      <p className="text-bone-white/80 text-sm">已发现的密码</p>
                      <div className="flex gap-3 mt-1">
                        {discoveredPassword.map((pwd, i) => (
                          <span key={i} className="font-mono text-2xl font-bold text-amber-400">
                            {pwd}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedClue && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-moss-green/30 rounded-xl border border-moss-green/50"
                >
                  <p className="text-bone-white text-sm">
                    已选择线索，点击另一张线索卡片进行关联，或再次点击取消选择。
                  </p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="font-display text-xl text-bone-white font-bold mb-4 flex items-center gap-2">
                    <span>收集的线索</span>
                    <span className="text-bone-white/50 text-base">({foundClues.length} 条)</span>
                  </h3>
                  
                  {foundClues.length === 0 ? (
                    <div className="text-center py-16 text-bone-white/50">
                      <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="font-body text-lg">还没有收集到任何线索</p>
                      <p className="text-sm mt-2">探索场景，寻找隐藏的线索吧</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-6 justify-center">
                      {foundClues.map((clue) => (
                        <ClueCard
                          key={clue.id}
                          clue={clue}
                          selected={selectedClue === clue.id}
                          draggable
                          onClick={() => handleCardClick(clue.id)}
                          onDragStart={() => handleDragStart(clue.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(clue.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-xl text-bone-white font-bold mb-4 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-blood-red" />
                    <span>已发现的关联</span>
                    <span className="text-bone-white/50 text-base">({discoveredConnections.length})</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {discoveredConnections.length === 0 ? (
                      <div className="text-center py-12 text-bone-white/50">
                        <Link2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="font-body">尝试关联不同的线索</p>
                        <p className="text-sm mt-2">也许能发现重要的信息</p>
                      </div>
                    ) : (
                      renderConnections()
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Button variant="wood" size="lg" onClick={toggleClueBoard}>
                  继续探索
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
