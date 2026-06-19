import type { LifeEntity } from '@/types';
import { MAX_LEVEL, MIRACLE_CHANCE, MAX_ENTITIES, getSpeciesByLevel } from '@/data/evolutionTree';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const checkCollision = (
  entity1: LifeEntity,
  entity2: LifeEntity,
  threshold: number = 40
): boolean => {
  const dx = entity1.x - entity2.x;
  const dy = entity1.y - entity2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < threshold;
};

export const canMerge = (
  entity1: LifeEntity,
  entity2: LifeEntity
): boolean => {
  if (entity1.id === entity2.id) return false;
  if (entity1.level !== entity2.level) return false;
  if (entity1.level >= MAX_LEVEL) return false;
  return true;
};

export const createEntity = (
  level: number,
  x: number,
  y: number,
  isNew: boolean = false
): LifeEntity | null => {
  const species = getSpeciesByLevel(level);
  if (!species) return null;
  
  return {
    id: generateId(),
    level,
    name: species.name,
    emoji: species.emoji,
    x,
    y,
    isDragging: false,
    createdAt: Date.now(),
    isNew,
  };
};

export const performMerge = (
  entity1: LifeEntity,
  entity2: LifeEntity
): { newEntity: LifeEntity | null; isMiracle: boolean } => {
  if (!canMerge(entity1, entity2)) {
    return { newEntity: null, isMiracle: false };
  }

  const isMiracle = Math.random() < MIRACLE_CHANCE;
  const newLevel = Math.min(
    isMiracle ? entity1.level + 2 : entity1.level + 1,
    MAX_LEVEL
  );

  const midX = (entity1.x + entity2.x) / 2;
  const midY = (entity1.y + entity2.y) / 2;

  const newEntity = createEntity(newLevel, midX, midY, true);
  
  return { newEntity, isMiracle };
};

export const mergeEntities = (
  entities: LifeEntity[],
  entity1Id: string,
  entity2Id: string
): { 
  newEntities: LifeEntity[]; 
  mergedEntity: LifeEntity | null; 
  isMiracle: boolean;
  removedIds: string[];
} => {
  const entity1 = entities.find(e => e.id === entity1Id);
  const entity2 = entities.find(e => e.id === entity2Id);

  if (!entity1 || !entity2) {
    return { newEntities: entities, mergedEntity: null, isMiracle: false, removedIds: [] };
  }

  const { newEntity, isMiracle } = performMerge(entity1, entity2);

  if (!newEntity) {
    return { newEntities: entities, mergedEntity: null, isMiracle: false, removedIds: [] };
  }

  const newEntities = entities
    .filter(e => e.id !== entity1Id && e.id !== entity2Id)
    .concat(newEntity);

  return {
    newEntities,
    mergedEntity: newEntity,
    isMiracle,
    removedIds: [entity1Id, entity2Id],
  };
};

export const cleanUpEntities = (entities: LifeEntity[]): LifeEntity[] => {
  if (entities.length <= MAX_ENTITIES) return entities;

  const sorted = [...entities].sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.createdAt - b.createdAt;
  });

  const toRemove = sorted.length - MAX_ENTITIES;
  const toRemoveIds = sorted.slice(0, toRemove).map(e => e.id);

  return entities.filter(e => !toRemoveIds.includes(e.id));
};

export const getRandomPosition = (
  width: number,
  height: number,
  margin: number = 60
): { x: number; y: number } => {
  return {
    x: margin + Math.random() * (width - margin * 2),
    y: margin + Math.random() * (height - margin * 2),
  };
};
