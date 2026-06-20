export const MAP_WIDTH = 1280;
export const MAP_HEIGHT = 720;

export const PLAYER_SPEED = 180;
export const PLAYER_VIEW_DISTANCE = 200;
export const PLAYER_VIEW_ANGLE = Math.PI / 3;
export const PLAYER_SIZE = 24;

export const ENEMY_SPEED_PATROL = 70;
export const ENEMY_SPEED_CHASE = 150;
export const ENEMY_SPEED_SEARCH = 90;
export const ENEMY_VIEW_DISTANCE = 220;
export const ENEMY_VIEW_ANGLE = Math.PI / 2.2;
export const ENEMY_SIZE = 28;
export const CHASE_DURATION_AFTER_LOST = 4000;
export const SEARCH_DURATION = 5000;

export const TOTAL_KEYS = 3;
export const KEY_SIZE = 20;
export const KEY_COLLECT_DISTANCE = 35;

export const HIDE_DISTANCE = 45;
export const HIDE_COOLDOWN = 300;

export const CATCH_DISTANCE = 35;

export const COLORS = {
  icePink: '#FF69B4',
  iceMint: '#98FB98',
  neonPurple: '#9400D3',
  warningRed: '#FF0000',
  creepYellow: '#FFFF00',
  darkBg: '#0a0a0f',
  darkCard: '#1a1a2e',
  wallColor: '#2a2a4e',
  wallAccent: '#3a3a6e',
  floorColor: '#151525',
  floorAccent: '#1e1e35',
  playerColor: '#ffffff',
  playerView: 'rgba(150, 200, 255, 0.15)',
  enemyColor: '#ff4444',
  enemyViewPatrol: 'rgba(255, 100, 100, 0.2)',
  enemyViewChase: 'rgba(255, 0, 0, 0.35)',
  keyColor: '#FFD700',
  hidingSpot: 'rgba(100, 100, 255, 0.3)',
  doorLocked: '#8B4513',
  doorUnlocked: '#228B22',
};

export const createWalls = (): { x: number; y: number; width: number; height: number; color: string }[] => {
  const walls: { x: number; y: number; width: number; height: number; color: string }[] = [];
  
  walls.push({ x: 0, y: 0, width: MAP_WIDTH, height: 20, color: COLORS.wallColor });
  walls.push({ x: 0, y: MAP_HEIGHT - 20, width: MAP_WIDTH, height: 20, color: COLORS.wallColor });
  walls.push({ x: 0, y: 0, width: 20, height: MAP_HEIGHT, color: COLORS.wallColor });
  walls.push({ x: MAP_WIDTH - 20, y: 0, width: 20, height: MAP_HEIGHT, color: COLORS.wallColor });
  
  walls.push({ x: 400, y: 20, width: 20, height: 250, color: COLORS.wallAccent });
  walls.push({ x: 400, y: 350, width: 20, height: 350, color: COLORS.wallAccent });
  
  walls.push({ x: 20, y: 300, width: 200, height: 20, color: COLORS.wallAccent });
  
  walls.push({ x: 700, y: 200, width: 20, height: 350, color: COLORS.wallAccent });
  
  walls.push({ x: 700, y: 200, width: 300, height: 20, color: COLORS.wallAccent });
  
  walls.push({ x: 980, y: 20, width: 20, height: 400, color: COLORS.wallAccent });
  
  walls.push({ x: 200, y: 500, width: 300, height: 20, color: COLORS.wallAccent });
  
  walls.push({ x: 1050, y: 500, width: 210, height: 20, color: COLORS.wallAccent });
  
  walls.push({ x: 1050, y: 500, width: 20, height: 200, color: COLORS.wallAccent });
  
  return walls;
};

export const createPatrolPath = (): { x: number; y: number }[] => {
  return [
    { x: 150, y: 150 },
    { x: 600, y: 150 },
    { x: 850, y: 350 },
    { x: 1100, y: 350 },
    { x: 1100, y: 600 },
    { x: 600, y: 600 },
    { x: 150, y: 600 },
    { x: 150, y: 400 },
  ];
};

export const createKeyPositions = (): { x: number; y: number; id: number }[] => {
  return [
    { x: 100, y: 180, id: 1 },
    { x: 850, y: 100, id: 2 },
    { x: 550, y: 600, id: 3 },
  ];
};

export const createHidingSpots = (): { id: number; x: number; y: number; width: number; height: number; type: 'fridge' | 'box' | 'table' }[] => {
  return [
    { id: 1, x: 80, y: 100, width: 60, height: 60, type: 'fridge' },
    { id: 2, x: 500, y: 100, width: 70, height: 50, type: 'box' },
    { id: 3, x: 820, y: 450, width: 80, height: 60, type: 'table' },
    { id: 4, x: 1150, y: 100, width: 60, height: 60, type: 'fridge' },
    { id: 5, x: 250, y: 600, width: 70, height: 50, type: 'box' },
    { id: 6, x: 1100, y: 600, width: 60, height: 50, type: 'table' },
  ];
};

export const DOOR_POSITION = { x: MAP_WIDTH - 60, y: MAP_HEIGHT / 2 - 40, width: 40, height: 80 };
