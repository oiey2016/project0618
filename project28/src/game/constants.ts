import type { Team } from './types';

export const COURT = {
  WIDTH: 960,
  HEIGHT: 560,
  MIDLINE_X: 480,
  WALL_TOP: 20,
  WALL_BOTTOM: 540,
  WALL_LEFT: 20,
  WALL_RIGHT: 940,
  BENCH_WIDTH: 60,
  CORNER_RADIUS: 10,
} as const;

export const PLAYER = {
  RADIUS: 24,
  MOVE_SPEED: 260,
  MAX_CHARGE: 900,
  CATCH_WINDOW: 280,
  CATCH_RADIUS: 55,
  FLASH_DURATION: 200,
  PER_TEAM: 4,
  SQUASH_ON_CHARGE: 0.85,
  STRETCH_ON_THROW: 1.2,
} as const;

export const BALL = {
  RADIUS: 16,
  MIN_SPEED: 340,
  MAX_SPEED: 820,
  FRICTION: 0.988,
  WALL_BOUNCE: 0.85,
  PLAYER_BOUNCE: 0.6,
  MIN_BOUNCE_SPEED: 120,
  MAX_ACTIVE: 5,
  INITIAL_COUNT: 3,
  RESPAWN_INTERVAL: 2200,
  TRAIL_LENGTH: 8,
  GRAVITY: 0,
} as const;

export const RULES = {
  MATCH_DURATION: 180000,
  COUNTDOWN: 3,
  HINT_DURATION: 2500,
} as const;

export const COLORS = {
  BLUE_TEAM: '#00D4FF',
  BLUE_DARK: '#0066FF',
  BLUE_SHADOW: 'rgba(0, 212, 255, 0.4)',
  RED_TEAM: '#FF3D68',
  RED_DARK: '#CC1133',
  RED_SHADOW: 'rgba(255, 61, 104, 0.4)',
  BALL: '#FF8C00',
  BALL_DARK: '#CC5500',
  BALL_LIGHT: '#FFB347',
  COURT_FLOOR_1: '#A0522D',
  COURT_FLOOR_2: '#8B4513',
  COURT_LINE: '#FFFFFF',
  MIDLINE: '#FACC15',
  WALL: '#374151',
  WALL_HIGHLIGHT: '#6B7280',
  BENCH_BLUE: 'rgba(0, 212, 255, 0.15)',
  BENCH_RED: 'rgba(255, 61, 104, 0.15)',
  NEUTRAL: '#94A3B8',
  CATCH_GOLD: '#FFD700',
  HIT_SPARK: '#FFFFFF',
} as const;

export const TEAM_COLORS: Record<Team, { main: string; dark: string; shadow: string; name: string }> = {
  blue: {
    main: COLORS.BLUE_TEAM,
    dark: COLORS.BLUE_DARK,
    shadow: COLORS.BLUE_SHADOW,
    name: '蓝队',
  },
  red: {
    main: COLORS.RED_TEAM,
    dark: COLORS.RED_DARK,
    shadow: COLORS.RED_SHADOW,
    name: '红队',
  },
};

export const CONTROLS = {
  blue: {
    up: ['KeyW'],
    down: ['KeyS'],
    left: ['KeyA'],
    right: ['KeyD'],
    action: ['Space'],
  },
  red: {
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    action: ['Enter', 'NumpadEnter'],
  },
} as const;

export const HINTS = {
  CHARGE: '按住蓄力！',
  RELEASE: '松开发射！',
  CATCH: '按动作键接球！',
  HIT_BLUE: '蓝队得分！',
  HIT_RED: '红队得分！',
  RESCUE: '救回队友！',
  START: '游戏开始！',
  READY: '准备好了吗？',
} as const;
