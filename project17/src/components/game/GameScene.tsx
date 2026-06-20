import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, BookOpen, MapPin, Eye, Lock, Unlock } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { getSceneById } from '@/data/scenes';
import { getPuzzleById } from '@/data/puzzles';
import { Button } from '@/components/ui/Button';

export function GameScene() {
  const {
    currentScene,
    scenes,
    selectedItem,
    changeScene,
    collectItem,
    collectClue,
    startPuzzle,
    useItem,
    showDialog,
    toggleClueBoard,
    getHint,
    puzzles,
    clues,
  } = useGameStore();

  const [hoveredInteractable, setHoveredInteractable] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scene = getSceneById(currentScene);

  const handleInteractableClick = useCallback((interactable: any) => {
    const puzzle = getPuzzleById(interactable.targetId);
    const puzzleSolved = puzzles.find(p => p.id === interactable.targetId)?.solved;

    if (interactable.requiresItem) {
      const hasItem = clues.find(c => c.id === interactable.requiresItem)?.found ||
                      useGameStore.getState().inventory.find(i => i.id === interactable.requiresItem)?.collected;
      
      if (!hasItem) {
        showDialog(interactable.description);
        return;
      }
    }

    if (selectedItem) {
      const canUse = useItem(selectedItem.id, interactable.id);
      if (canUse && puzzle && !puzzleSolved) {
        startPuzzle(interactable.targetId);
        return;
      }
    }

    switch (interactable.type) {
      case 'item':
        collectItem(interactable.targetId);
        showDialog(interactable.interactionMessage || interactable.description);
        break;
      case 'clue':
        collectClue(interactable.targetId);
        showDialog(interactable.interactionMessage || interactable.description);
        break;
      case 'puzzle':
        if (puzzle && !puzzleSolved) {
          startPuzzle(interactable.targetId);
        } else if (puzzleSolved) {
          showDialog('这个谜题已经解开了。');
        }
        break;
      case 'info':
        showDialog(interactable.interactionMessage || interactable.description);
        break;
    }
  }, [selectedItem, collectItem, collectClue, startPuzzle, useItem, showDialog, puzzles]);

  const handleExitClick = useCallback((exit: any) => {
    const targetScene = scenes.find(s => s.id === exit.targetSceneId);
    if (targetScene?.unlocked) {
      setIsTransitioning(true);
      setTimeout(() => {
        changeScene(exit.targetSceneId);
        setIsTransitioning(false);
      }, 500);
    } else {
      showDialog('这个区域还没有解锁...');
    }
  }, [scenes, changeScene, showDialog]);

  if (!scene) return null;

  const renderSceneBackground = () => {
    const bgGradients: Record<string, string> = {
      'living-room': 'linear-gradient(180deg, #3d2f22 0%, #2a1f18 50%, #4a3a2a 100%)',
      'study': 'linear-gradient(180deg, #2d4a3e 0%, #1f2a24 50%, #3a5a4e 100%)',
      'bedroom': 'linear-gradient(180deg, #6b3a2e 0%, #3a2525 50%, #7a4a3e 100%)',
      'basement': 'linear-gradient(180deg, #2d4a3e 0%, #1a2a24 50%, #264035 100%)',
    };

    const sceneElements: Record<string, React.ReactNode> = {
      'living-room': (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-amber-700/30 to-transparent rounded-b-full" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-old-brown/60 to-transparent" />
          <div className="absolute top-10 left-10 w-32 h-24 bg-aged-wood/50 rounded border-2 border-rust/50" />
          <div className="absolute top-10 right-10 w-32 h-24 bg-aged-wood/50 rounded border-2 border-rust/50" />
          <div className="absolute bottom-20 left-20 w-48 h-16 bg-aged-wood/60 rounded border-2 border-rust/60" />
          <div className="absolute bottom-20 right-32 w-32 h-20 bg-aged-wood/60 rounded border-2 border-rust/60" />
        </>
      ),
      'study': (
        <>
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-aged-wood/50 to-transparent" />
          <div className="absolute top-8 left-1/4 w-32 h-32 bg-amber-700/30 rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-old-brown/60 to-transparent" />
        </>
      ),
      'bedroom': (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-64 bg-gradient-to-b from-blood-red/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-old-brown/60 to-transparent" />
          <div className="absolute top-10 left-20 w-24 h-32 bg-aged-wood/50 rounded border-2 border-rust/50" />
        </>
      ),
      'basement': (
        <>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-moss-green/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-moss-green/15 rounded-full blur-3xl" />
        </>
      ),
    };

    return (
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ background: bgGradients[currentScene] || bgGradients['living-room'] }}
      >
        {sceneElements[currentScene]}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(26,21,16,0.4) 100%)`
        }} />
      </div>
    );
  };

  const renderInteractable = (interactable: any) => {
    const isCollected = interactable.type === 'item' && 
      useGameStore.getState().inventory.find(i => i.id === interactable.targetId)?.collected;
    const isClueFound = interactable.type === 'clue' &&
      useGameStore.getState().clues.find(c => c.id === interactable.targetId)?.found;
    const isPuzzleSolved = interactable.type === 'puzzle' &&
      useGameStore.getState().puzzles.find(p => p.id === interactable.targetId)?.solved;

    if (isCollected || isClueFound) return null;

    const isHovered = hoveredInteractable === interactable.id;
    const canInteract = !interactable.requiresItem || 
      useGameStore.getState().inventory.find(i => i.id === interactable.requiresItem)?.collected;

    return (
      <motion.button
        key={interactable.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setHoveredInteractable(interactable.id)}
        onMouseLeave={() => setHoveredInteractable(null)}
        onClick={() => handleInteractableClick(interactable)}
        disabled={interactable.requiresItem && !canInteract}
        className="absolute cursor-pointer group"
        style={{
          left: `${interactable.position.x}%`,
          top: `${interactable.position.y}%`,
          width: `${interactable.position.width}%`,
          height: `${interactable.position.height}%`,
        }}
      >
        <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
          isPuzzleSolved 
            ? 'bg-moss-green/20 border-2 border-moss-green/50' 
            : isHovered
            ? 'bg-blood-red/30 border-2 border-blood-red'
            : 'bg-blood-red/10 border-2 border-transparent hover:border-blood-red/50'
        }`}>
          <motion.div
            animate={isHovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-lg bg-gradient-to-t from-blood-red/50 to-transparent"
          />
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap z-10"
            >
              <div className="bg-old-brown px-4 py-2 rounded-lg border border-rust shadow-xl">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blood-red" />
                  <span className="font-display text-bone-white text-sm font-bold">
                    {interactable.name}
                  </span>
                  {isPuzzleSolved && <Unlock className="w-4 h-4 text-moss-green" />}
                  {interactable.requiresItem && !canInteract && <Lock className="w-4 h-4 text-bone-white/60" />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  const renderExit = (exit: any) => {
    const targetScene = scenes.find(s => s.id === exit.targetSceneId);
    const isUnlocked = targetScene?.unlocked;
    const isHovered = hoveredInteractable === `exit-${exit.targetSceneId}`;

    return (
      <motion.button
        key={`exit-${exit.targetSceneId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setHoveredInteractable(`exit-${exit.targetSceneId}`)}
        onMouseLeave={() => setHoveredInteractable(null)}
        onClick={() => handleExitClick(exit)}
        className="absolute cursor-pointer"
        style={{
          left: `${exit.position.x}%`,
          top: `${exit.position.y}%`,
          width: exit.position.width ? `${exit.position.width}%` : '8%',
          height: exit.position.height ? `${exit.position.height}%` : '20%',
        }}
      >
        <div className={`absolute inset-0 rounded-lg transition-all duration-300 flex flex-col items-center justify-center ${
          isUnlocked
            ? isHovered
              ? 'bg-moss-green/40 border-2 border-moss-green'
              : 'bg-moss-green/20 border-2 border-moss-green/50'
            : 'bg-aged-wood/30 border-2 border-rust/30'
        }`}>
          <MapPin className={`w-6 h-6 ${isUnlocked ? 'text-moss-green' : 'text-bone-white/30'}`} />
          <span className={`font-display text-xs mt-1 ${isUnlocked ? 'text-moss-green' : 'text-bone-white/30'}`}>
            {exit.label}
          </span>
          {!isUnlocked && <Lock className="w-4 h-4 text-bone-white/30 mt-1" />}
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10"
            >
              <div className="bg-old-brown px-4 py-2 rounded-lg border border-rust shadow-xl">
                <span className="font-display text-bone-white text-sm">
                  {isUnlocked ? `前往${exit.label}` : '需要解锁'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          {renderSceneBackground()}
          
          <div className="relative w-full h-full">
            {scene.interactables.map(renderInteractable)}
            {scene.exits.map(renderExit)}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-0 left-0 right-0 p-4 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="bg-old-brown px-6 py-3 rounded-xl border border-rust shadow-lg">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blood-red" />
              <div>
                <h2 className="font-display text-bone-white font-bold text-lg">{scene.name}</h2>
                <p className="text-bone-white/65 text-xs">{scene.description.slice(0, 50)}...</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="wood"
              size="sm"
              onClick={() => showDialog(getHint())}
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">提示</span>
            </Button>
            <Button
              variant="wood"
              size="sm"
              onClick={toggleClueBoard}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">线索墙</span>
              {clues.filter(c => c.found).length > 0 && (
                <span className="bg-blood-red text-bone-white text-xs px-2 py-0.5 rounded-full">
                  {clues.filter(c => c.found).length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-10">
        <div className="flex gap-2 bg-old-brown px-4 py-2 rounded-full border border-rust shadow-lg">
          {scenes.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExitClick({ targetSceneId: s.id })}
              className={`px-4 py-2 rounded-full font-display text-sm transition-all ${
                s.id === currentScene
                  ? 'bg-blood-red text-bone-white'
                  : s.unlocked
                  ? 'text-bone-white/85 hover:text-bone-white hover:bg-bone-white/15'
                  : 'text-bone-white/40 cursor-not-allowed'
              }`}
              disabled={!s.unlocked}
            >
              {s.unlocked ? s.name : '???'}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
