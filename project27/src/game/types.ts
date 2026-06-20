export type GameState = 'menu' | 'countdown' | 'playing' | 'result';

export type PlayerColor = 'cyan' | 'pink' | 'yellow' | 'green';

export interface PlayerConfig {
  id: number;
  color: PlayerColor;
  colorHex: string;
  controls: PlayerControls;
}

export interface PlayerControls {
  left: string;
  right: string;
  jump: string;
  attack: string;
  pickup: string;
}

export interface Player {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  color: PlayerColor;
  colorHex: string;
  facing: 1 | -1;
  isGrounded: boolean;
  isAttacking: boolean;
  attackTimer: number;
  attackCooldown: number;
  hitCooldown: number;
  weapon: Weapon | null;
  isAlive: boolean;
  animFrame: number;
  hitFlash: number;
}

export type WeaponType = 'stick' | 'box' | 'bomb';

export interface Weapon {
  id: number;
  type: WeaponType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  damage: number;
  isThrown: boolean;
  isPicked: boolean;
  ownerId: number | null;
  floatOffset: number;
  rotation: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameConfig {
  width: number;
  height: number;
  gravity: number;
  playerSpeed: number;
  jumpForce: number;
  maxPlayers: number;
}
