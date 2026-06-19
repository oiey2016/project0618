import { useEffect, useRef, useCallback } from 'react';
import type { LifeEntity } from '@/types';
import { useGameStore } from '@/store/useGameStore';
import { getGlowClass, getFloatAnimation, getEntitySize, getSpeciesByLevel, SPECIES } from '@/data/evolutionTree';
import { checkCollision, canMerge } from '@/utils/mergeLogic';

interface LifeElementProps {
  entity: LifeEntity;
  onMergeReady: (entity1Id: string, entity2Id: string) => void;
  gameAreaRef: React.RefObject<HTMLDivElement>;
}

export default function LifeElement({ entity, onMergeReady, gameAreaRef }: LifeElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const potentialMergeRef = useRef<string | null>(null);

  const { updateEntityPosition, setEntityDragging, clearEntityNewFlag, entities } = useGameStore();

  const species = getSpeciesByLevel(entity.level);
  const size = getEntitySize(entity.level);
  const glowClass = species ? getGlowClass(species.rarity) : 'life-glow-common';
  const floatAnim = getFloatAnimation(entity.level);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!elementRef.current || !gameAreaRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    isDraggingRef.current = true;
    setEntityDragging(entity.id, true);
    elementRef.current.setPointerCapture(e.pointerId);
  }, [entity.id, setEntityDragging, gameAreaRef]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || !gameAreaRef.current) return;
    
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - gameRect.left - dragOffsetRef.current.x + size / 2;
    const y = e.clientY - gameRect.top - dragOffsetRef.current.y + size / 2;
    
    const clampedX = Math.max(size / 2, Math.min(gameRect.width - size / 2, x));
    const clampedY = Math.max(size / 2, Math.min(gameRect.height - size / 2, y));
    
    updateEntityPosition(entity.id, clampedX, clampedY);
    
    const currentEntity = useGameStore.getState().entities.find(e => e.id === entity.id);
    if (currentEntity) {
      const allEntities = useGameStore.getState().entities;
      const nearby = allEntities.find(other => 
        other.id !== entity.id && 
        canMerge(currentEntity, other) && 
        checkCollision(currentEntity, other, size * 0.8)
      );
      
      if (nearby && potentialMergeRef.current !== nearby.id) {
        potentialMergeRef.current = nearby.id;
      } else if (!nearby && potentialMergeRef.current) {
        potentialMergeRef.current = null;
      }
    }
  }, [entity.id, updateEntityPosition, size, gameAreaRef]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    setEntityDragging(entity.id, false);
    
    if (elementRef.current) {
      elementRef.current.releasePointerCapture(e.pointerId);
    }
    
    if (potentialMergeRef.current) {
      onMergeReady(entity.id, potentialMergeRef.current);
      potentialMergeRef.current = null;
    }
  }, [entity.id, setEntityDragging, onMergeReady]);

  useEffect(() => {
    if (entity.isNew) {
      const timer = setTimeout(() => {
        clearEntityNewFlag(entity.id);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [entity.id, entity.isNew, clearEntityNewFlag]);

  const canMergeWithOthers = entities.some(
    other => other.id !== entity.id && other.level === entity.level && other.level < SPECIES.length
  );

  return (
    <div
      ref={elementRef}
      className={`life-element rounded-full flex items-center justify-center select-none
        ${entity.isDragging ? 'dragging scale-110 z-50' : ''}
        ${entity.isNew ? 'animate-merge-burst' : floatAnim}
        ${glowClass}
        ${canMergeWithOthers ? 'ring-2 ring-divine-400/50 ring-offset-2 ring-offset-transparent' : ''}
      `}
      style={{
        left: `${entity.x - size / 2}px`,
        top: `${entity.y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.max(20, size * 0.45)}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        transition: entity.isDragging ? 'none' : 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
        zIndex: entity.isDragging ? 100 : entity.level,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      title={species?.name}
    >
      <span className="pointer-events-none select-none" style={{ lineHeight: 1 }}>
        {entity.emoji}
      </span>
      
      {potentialMergeRef.current && (
        <div 
          className="merge-ring"
          style={{
            width: `${size * 1.5}px`,
            height: `${size * 1.5}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
}
