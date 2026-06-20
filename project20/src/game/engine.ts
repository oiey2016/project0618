import { useGameStore } from '@/store/useGameStore';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './gameData';
import type { Position, Player, Ghost } from '@/types/game';

export function distance(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function moveTowards(current: Position, target: Position, speed: number): Position {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist < speed) {
    return { ...target };
  }
  
  return {
    x: current.x + (dx / dist) * speed,
    y: current.y + (dy / dist) * speed,
  };
}

export function isPointInRect(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

interface GameEngineState {
  running: boolean;
  animationFrameId: number | null;
  lastTime: number;
  damageCooldown: number;
}

const engineState: GameEngineState = {
  running: false,
  animationFrameId: null,
  lastTime: 0,
  damageCooldown: 0,
};

export function startGameEngine() {
  if (engineState.running) return;
  engineState.running = true;
  engineState.lastTime = performance.now();
  engineState.damageCooldown = 0;
  gameLoop();
}

export function stopGameEngine() {
  engineState.running = false;
  if (engineState.animationFrameId !== null) {
    cancelAnimationFrame(engineState.animationFrameId);
    engineState.animationFrameId = null;
  }
}

function gameLoop() {
  if (!engineState.running) return;
  
  const state = useGameStore.getState();
  
  if (state.gameState === 'playing') {
    updateGame();
  }
  
  engineState.animationFrameId = requestAnimationFrame(gameLoop);
}

function updateGame() {
  const state = useGameStore.getState();
  const { player, ghost, currentRoom } = state;
  const room = state.rooms[currentRoom];
  
  if (!room) return;

  updatePlayer(player);
  updateGhost(ghost, player, currentRoom);
  checkGhostDetection();
  
  if (engineState.damageCooldown > 0) {
    engineState.damageCooldown -= 16;
  }
}

function updatePlayer(player: Player) {
  const { position, targetPosition, speed, isHidden } = player;
  
  if (isHidden) return;
  
  const dist = distance(position, targetPosition);
  
  if (dist > 1) {
    const newPos = moveTowards(position, targetPosition, speed);
    const facing = targetPosition.x > position.x ? 'right' : 'left';
    useGameStore.getState().updatePlayerPosition(newPos.x, newPos.y, facing);
  }
}

function updateGhost(
  ghost: Ghost,
  player: Player,
  currentRoom: string
) {
  const { position, targetPosition, speed, state: ghostState, patrolPath, patrolIndex, detectionRadius } = ghost;
  
  if (ghost.currentRoom !== currentRoom) {
    return;
  }
  
  const distToPlayer = distance(position, player.position);
  const canSeePlayer = !player.isHidden && distToPlayer < detectionRadius;
  
  let newState = ghostState;
  let newTarget = targetPosition;
  let newAlertLevel = ghost.alertLevel;
  let newPatrolIndex = patrolIndex;
  let currentSpeed = speed;
  
  if (canSeePlayer) {
    newState = 'chase';
    newTarget = { ...player.position };
    newAlertLevel = Math.min(1, newAlertLevel + 0.02);
    currentSpeed = speed * 1.8;
  } else if (ghostState === 'chase') {
    newState = 'search';
    newAlertLevel = Math.max(0, newAlertLevel - 0.005);
    if (newAlertLevel <= 0) {
      newState = 'patrol';
      newTarget = patrolPath[patrolIndex];
    }
  } else if (ghostState === 'search') {
    newAlertLevel = Math.max(0, newAlertLevel - 0.003);
    if (newAlertLevel <= 0) {
      newState = 'patrol';
      newTarget = patrolPath[patrolIndex];
    }
    currentSpeed = speed * 0.7;
  } else {
    const distToTarget = distance(position, targetPosition);
    if (distToTarget < 5) {
      newPatrolIndex = (patrolIndex + 1) % patrolPath.length;
      newTarget = patrolPath[newPatrolIndex];
    }
    newAlertLevel = 0;
  }
  
  const newPos = moveTowards(position, newTarget, currentSpeed);
  const floatOffset = Math.sin(performance.now() / 500) * 5;
  
  useGameStore.getState().updateGhostPosition(
    newPos.x,
    newPos.y,
    newState,
    newAlertLevel,
    floatOffset
  );
  
  if (newPatrolIndex !== patrolIndex) {
    useGameStore.getState().setGhostPatrolIndex(newPatrolIndex);
  }
  
  if (newTarget.x !== targetPosition.x || newTarget.y !== targetPosition.y) {
    useGameStore.getState().setGhostTarget(newTarget.x, newTarget.y);
  }
}

function checkGhostDetection() {
  const state = useGameStore.getState();
  const { player, ghost, currentRoom } = state;
  
  if (ghost.currentRoom !== currentRoom) return;
  if (player.isHidden) return;
  if (engineState.damageCooldown > 0) return;
  
  const dist = distance(player.position, ghost.position);
  
  if (dist < 30 && ghost.state === 'chase') {
    useGameStore.getState().damagePlayer(1);
    engineState.damageCooldown = 2000;
    
    const angle = Math.atan2(
      player.position.y - ghost.position.y,
      player.position.x - ghost.position.x
    );
    const knockbackDist = 60;
    const newX = Math.max(30, Math.min(CANVAS_WIDTH - 30, player.position.x + Math.cos(angle) * knockbackDist));
    const newY = Math.max(50, Math.min(CANVAS_HEIGHT - 30, player.position.y + Math.sin(angle) * knockbackDist));
    useGameStore.getState().updatePlayerPosition(newX, newY, player.facing);
    useGameStore.getState().setPlayerTarget(newX, newY);
  }
}

export function handleCanvasClick(x: number, y: number) {
  const state = useGameStore.getState();
  
  if (state.gameState !== 'playing') return;
  if (state.player.isHidden) return;
  if (state.isTransitioning) return;
  
  const room = state.rooms[state.currentRoom];
  if (!room) return;
  
  for (const interactable of room.interactables) {
    if (interactable.visible === false) continue;
    if (interactable.collected && interactable.type === 'item') continue;
    
    const inRect = isPointInRect(
      x,
      y,
      interactable.position.x,
      interactable.position.y,
      interactable.size.width,
      interactable.size.height
    );
    
    if (inRect) {
      const dist = distance(state.player.position, {
        x: interactable.position.x + interactable.size.width / 2,
        y: interactable.position.y + interactable.size.height / 2,
      });
      
      if (dist < 100) {
        useGameStore.getState().interactWith(interactable.id);
      } else {
        useGameStore.getState().setPlayerTarget(
          interactable.position.x + interactable.size.width / 2,
          interactable.position.y + interactable.size.height / 2 + 20
        );
      }
      return;
    }
  }
  
  useGameStore.getState().setPlayerTarget(x, y);
}

export function getHoveredInteractable(x: number, y: number) {
  const state = useGameStore.getState();
  const room = state.rooms[state.currentRoom];
  if (!room) return null;
  
  for (const interactable of room.interactables) {
    if (interactable.visible === false) continue;
    if (interactable.collected && interactable.type === 'item') continue;
    
    const inRect = isPointInRect(
      x,
      y,
      interactable.position.x,
      interactable.position.y,
      interactable.size.width,
      interactable.size.height
    );
    
    if (inRect) {
      return interactable;
    }
  }
  
  return null;
}
