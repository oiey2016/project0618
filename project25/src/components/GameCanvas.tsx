import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PhysicsEngine } from '@/physics/PhysicsEngine';
import { useGameStore } from '@/store/gameStore';
import { useParams } from 'react-router-dom';
import { LEVELS } from '@/data/levels';
import { BLOCKS_INFO } from '@/data/blocks';
import { PlacedBlock, BlockType, StarsCount } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface GameCanvasProps {
  onResult: (result: 'success' | 'fail', stars: StarsCount) => void;
}

const CANVAS_W = 1100;
const CANVAS_H = 620;

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onResult }) => {
  const params = useParams<{ levelId: string }>();
  const levelId = Number(params.levelId);
  const level = LEVELS.find(l => l.id === levelId);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PhysicsEngine | null>(null);
  const initializedRef = useRef(false);

  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const selectedBlockType = useGameStore(s => s.selectedBlockType);
  const placedBlocks = useGameStore(s => s.placedBlocks);
  const addBlock = useGameStore(s => s.addBlock);
  const removeBlock = useGameStore(s => s.removeBlock);
  const clearBlocks = useGameStore(s => s.clearBlocks);
  const setSelectedBlock = useGameStore(s => s.setSelectedBlock);
  const isSimulating = useGameStore(s => s.isSimulating);
  const setSimulating = useGameStore(s => s.setSimulating);
  const isPaused = useGameStore(s => s.isPaused);
  const resetLevelState = useGameStore(s => s.resetLevelState);
  const getRemainingBlocks = useGameStore(s => s.getRemainingBlocks);

  const resultTriggeredRef = useRef(false);

  const handleGoalReached = useCallback(() => {
    if (resultTriggeredRef.current) return;
    resultTriggeredRef.current = true;
    engineRef.current?.setPaused(true);
    const usedCount = placedBlocks.length;
    let stars: StarsCount = 0;
    if (level) {
      if (usedCount <= level.threeStarBlocks) stars = 3;
      else if (usedCount <= level.twoStarBlocks) stars = 2;
      else if (usedCount <= level.oneStarBlocks) stars = 1;
      else stars = 1;
    }
    setTimeout(() => onResult('success', stars), 600);
  }, [level, placedBlocks.length, onResult]);

  const handlePlayerFall = useCallback(() => {
    if (resultTriggeredRef.current) return;
    resultTriggeredRef.current = true;
    engineRef.current?.stop();
    setTimeout(() => onResult('fail', 0), 500);
  }, [onResult]);

  useEffect(() => {
    if (!canvasRef.current || !level) return;

    const engine = new PhysicsEngine();
    engineRef.current = engine;
    engine.init(canvasRef.current, CANVAS_W, CANVAS_H, {
      onGoalReached: handleGoalReached,
      onPlayerFall: handlePlayerFall,
    });
    engine.createTerrain(level.terrain);
    engine.createPlayer(level.playerStart.x, level.playerStart.y);
    initializedRef.current = true;

    return () => {
      engine.destroy();
      initializedRef.current = false;
    };
  }, [levelId, level, handleGoalReached, handlePlayerFall]);

  const startSimulation = useCallback(() => {
    if (!engineRef.current || isSimulating) return;
    resultTriggeredRef.current = false;
    for (const b of placedBlocks) {
      engineRef.current.addPlacedBlock(b);
    }
    engineRef.current.start();
    setSimulating(true);
  }, [isSimulating, placedBlocks, setSimulating]);

  const pauseSimulation = useCallback(() => {
    engineRef.current?.setPaused(true);
  }, []);

  const resumeSimulation = useCallback(() => {
    engineRef.current?.setPaused(false);
  }, []);

  const resetSimulation = useCallback(() => {
    if (!engineRef.current || !level) return;
    engineRef.current.reset();
    engineRef.current.createTerrain(level.terrain);
    engineRef.current.createPlayer(level.playerStart.x, level.playerStart.y);
    setSimulating(false);
    resultTriggeredRef.current = false;
  }, [level, setSimulating]);

  useEffect(() => {
    if (isSimulating) {
      if (placedBlocks.length === 0 || !engineRef.current) return;
      if (isPaused) {
        pauseSimulation();
      } else {
        resumeSimulation();
      }
    }
  }, [isPaused, isSimulating, pauseSimulation, resumeSimulation, placedBlocks.length]);

  useEffect(() => {
    if (!isSimulating && engineRef.current && initializedRef.current) {
      resetSimulation();
    }
  }, [placedBlocks, isSimulating, resetSimulation]);

  useEffect(() => {
    (window as any).__startGameSim = startSimulation;
    (window as any).__pauseGameSim = pauseSimulation;
    (window as any).__resumeGameSim = resumeSimulation;
    (window as any).__resetGameSim = () => {
      resetLevelState();
    };
  }, [startSimulation, pauseSimulation, resumeSimulation, resetLevelState]);

  const getCanvasCoords = (e: React.MouseEvent) => {
    const canvas = overlayRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleCanvasMove = (e: React.MouseEvent) => {
    if (isSimulating || !selectedBlockType) {
      setHoverPos(null);
      return;
    }
    const pos = getCanvasCoords(e);
    setHoverPos(pos);
  };

  const handleCanvasLeave = () => {
    setHoverPos(null);
  };

  const handleCanvasWheel = (e: React.WheelEvent) => {
    if (isSimulating || !selectedBlockType) return;
    e.preventDefault();
    setRotation(r => (r + (e.deltaY > 0 ? 0.15 : -0.15)));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isSimulating) return;
    if (!selectedBlockType) return;

    const remaining = getRemainingBlocks();
    const count = remaining[selectedBlockType] ?? 0;
    if (count <= 0) return;

    const pos = getCanvasCoords(e);
    const info = BLOCKS_INFO[selectedBlockType];
    const block: PlacedBlock = {
      id: generateId(),
      type: selectedBlockType,
      x: pos.x,
      y: pos.y,
      width: info.defaultWidth,
      height: info.defaultHeight,
      rotation: rotation,
    };
    addBlock(block);
    const newRemaining = count - 1;
    if (newRemaining <= 0) {
      setSelectedBlock(null);
    }
  };

  const handleRemoveBlock = (id: string) => {
    if (isSimulating) return;
    removeBlock(id);
  };

  const ghostStyle = (() => {
    if (!hoverPos || !selectedBlockType) return null;
    const info = BLOCKS_INFO[selectedBlockType];
    const isCircle = selectedBlockType === BlockType.BALLOON || selectedBlockType === BlockType.GLUE || selectedBlockType === BlockType.PIVOT;
    return {
      left: `${(hoverPos.x / CANVAS_W) * 100}%`,
      top: `${(hoverPos.y / CANVAS_H) * 100}%`,
      width: info.defaultWidth,
      height: info.defaultHeight,
      background: info.color,
      borderRadius: isCircle ? '50%' : (selectedBlockType === BlockType.SOFT_BLOCK ? '14px' : '6px'),
      border: `2px dashed ${info.color}`,
      opacity: 0.55,
      transform: `translate(-50%, -50%) rotate(${(rotation * 180) / Math.PI}deg)`,
    };
  })();

  const hintInfo = level ? (() => {
    const suggestions: Record<number, string> = {
      1: '🎯 在两个地面之间搭2-3块木板连起来就能过关！',
      2: '🎯 放弹簧在低处，团子踩上去就能弹到高处平台～',
      3: '🎯 把气球粘在团子和木板上，它们会带着团子飞上去！',
      4: '🎯 用支点固定长木板的中间，就像跷跷板一样！',
      5: '🎯 综合运用各种积木：弹簧弹起+气球飞升+软块缓冲～',
    };
    return suggestions[level.id] || '🎯 多尝试不同的积木组合吧！';
  })() : '';

  return (
    <div className="relative w-full max-w-[1100px] mx-auto select-none">
      <div
        ref={overlayRef}
        className="relative w-full aspect-[1100/620] rounded-cute overflow-hidden shadow-pop border-4 border-peach-100 bg-grid-paper"
        style={{ background: 'linear-gradient(180deg, #FFF9F0 0%, #F0F9FF 60%, #F5FFF7 100%)' }}
        onMouseMove={handleCanvasMove}
        onMouseLeave={handleCanvasLeave}
        onClick={handleCanvasClick}
        onWheel={handleCanvasWheel}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="absolute inset-0 w-full h-full z-10"
          style={{ imageRendering: 'auto' }}
        />

        <div className="absolute inset-0 z-20 pointer-events-none">
          <AnimatePresence>
            {ghostStyle && (
              <motion.div
                key="ghost"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.55, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute pointer-events-none"
                style={ghostStyle as React.CSSProperties}
              />
            )}
          </AnimatePresence>

          {!isSimulating && placedBlocks.map((block) => {
            const info = BLOCKS_INFO[block.type];
            const isCircle = block.type === BlockType.BALLOON || block.type === BlockType.GLUE || block.type === BlockType.PIVOT;
            return (
              <div
                key={block.id}
                className="absolute group pointer-events-auto cursor-pointer"
                style={{
                  left: `${(block.x / CANVAS_W) * 100}%`,
                  top: `${(block.y / CANVAS_H) * 100}%`,
                  width: block.width,
                  height: block.height,
                  transform: `translate(-50%, -50%) rotate(${(block.rotation * 180) / Math.PI}deg)`,
                  zIndex: 15,
                }}
              >
                <div
                  className={clsx(
                    'w-full h-full flex items-center justify-center transition-all duration-150',
                    'group-hover:ring-4 group-hover:ring-peach-300/60 group-hover:-translate-y-0.5'
                  )}
                  style={{
                    background: info.color,
                    borderRadius: isCircle ? '50%' : (block.type === BlockType.SOFT_BLOCK ? '14px' : '6px'),
                    border: `2.5px solid ${info.color}`,
                    filter: 'brightness(0.92)',
                    opacity: 0.35,
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBlock(block.id);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-400 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-500 z-50"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}

          <AnimatePresence>
            {showHint && level && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
              >
                <div className="card-glass px-6 py-4 max-w-md text-center">
                  <div className="font-cute text-lg text-cocoa-soft mb-1">💡 小提示</div>
                  <div className="text-sm text-cocoa-light leading-relaxed">{hintInfo}</div>
                  <button
                    onClick={() => setShowHint(false)}
                    className="mt-3 btn-cute-ghost !py-1.5 !px-4 text-sm"
                  >
                    知道啦
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
          <div className="card-glass px-3 py-2 text-xs text-cocoa-light font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <RotateCcw size={14} className="text-peach-400" />
                滚轮旋转
              </span>
              <span>•</span>
              <span>点击放置</span>
              <span>•</span>
              <span>悬停删除</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
          <div className="card-glass px-3 py-2 text-xs font-cute text-cocoa-soft">
            已使用: <span className="text-peach-500 text-base">{placedBlocks.length}</span> 块
            {level && (
              <span className="text-cocoa-light/60 ml-2">
                (3⭐≤{level.threeStarBlocks} / 2⭐≤{level.twoStarBlocks})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
