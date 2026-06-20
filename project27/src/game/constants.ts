import type { PlayerConfig, GameConfig, Platform } from './types';

export const GAME_CONFIG: GameConfig = {
  width: 1280,
  height: 720,
  gravity: 0.6,
  playerSpeed: 5,
  jumpForce: -14,
  maxPlayers: 4,
};

export const PLAYER_CONFIGS: PlayerConfig[] = [
  {
    id: 1,
    color: 'cyan',
    colorHex: '#00F5FF',
    controls: {
      left: 'KeyA',
      right: 'KeyD',
      jump: 'KeyW',
      attack: 'KeyF',
      pickup: 'KeyG',
    },
  },
  {
    id: 2,
    color: 'pink',
    colorHex: '#FF2E93',
    controls: {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      jump: 'ArrowUp',
      attack: 'Period',
      pickup: 'Slash',
    },
  },
  {
    id: 3,
    color: 'yellow',
    colorHex: '#FFE600',
    controls: {
      left: 'KeyJ',
      right: 'KeyL',
      jump: 'KeyI',
      attack: 'KeyK',
      pickup: 'KeyO',
    },
  },
  {
    id: 4,
    color: 'green',
    colorHex: '#39FF14',
    controls: {
      left: 'Numpad4',
      right: 'Numpad6',
      jump: 'Numpad8',
      attack: 'Numpad5',
      pickup: 'Numpad7',
    },
  },
];

export const PLATFORMS: Platform[] = [
  { x: 0, y: 650, width: 1280, height: 70 },
  { x: 150, y: 520, width: 200, height: 20 },
  { x: 540, y: 450, width: 200, height: 20 },
  { x: 930, y: 520, width: 200, height: 20 },
  { x: 350, y: 340, width: 180, height: 20 },
  { x: 750, y: 340, width: 180, height: 20 },
];

export const WEAPON_SPAWN_POINTS = [
  { x: 250, y: 480 },
  { x: 640, y: 410 },
  { x: 1030, y: 480 },
  { x: 440, y: 300 },
  { x: 840, y: 300 },
];

export const WEAPON_STATS = {
  stick: { damage: 15, width: 40, height: 10 },
  box: { damage: 25, width: 35, height: 35 },
  bomb: { damage: 35, width: 25, height: 30 },
};

export const ATTACK_DAMAGE = 8;
export const ATTACK_COOLDOWN = 400;
export const ATTACK_DURATION = 150;
export const ATTACK_RANGE = 50;
export const HIT_COOLDOWN = 300;
export const KNOCKBACK_FORCE = 8;

export const COUNTDOWN_TIME = 3;
export const WEAPON_SPAWN_INTERVAL = 5000;
export const MAX_WEAPONS = 6;
export const PLAYER_WIDTH = 30;
export const PLAYER_HEIGHT = 60;
