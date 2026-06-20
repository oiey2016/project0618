import type {
  GameState,
  Player,
  Weapon,
  WeaponType,
  Platform,
  PlayerConfig,
} from './types';
import {
  GAME_CONFIG,
  PLAYER_CONFIGS,
  PLATFORMS,
  WEAPON_SPAWN_POINTS,
  WEAPON_STATS,
  ATTACK_DAMAGE,
  ATTACK_COOLDOWN,
  ATTACK_DURATION,
  ATTACK_RANGE,
  HIT_COOLDOWN,
  KNOCKBACK_FORCE,
  COUNTDOWN_TIME,
  WEAPON_SPAWN_INTERVAL,
  MAX_WEAPONS,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from './constants';
import { InputManager } from './InputManager';
import { applyGravity, applyFriction, rectCollision } from './physics';

export class GameEngine {
  state: GameState = 'menu';
  players: Player[] = [];
  weapons: Weapon[] = [];
  platforms: Platform[] = PLATFORMS;
  playerCount = 2;
  winnerId: number | null = null;
  countdown = COUNTDOWN_TIME;
  screenShake = 0;
  timeScale = 1;

  private inputManager: InputManager;
  private lastTime = 0;
  private weaponSpawnTimer = 0;
  private countdownTimer = 0;
  private weaponIdCounter = 0;
  private animationFrameId: number | null = null;
  private updateListeners: Array<(game: GameEngine) => void> = [];

  constructor() {
    this.inputManager = new InputManager();
  }

  addUpdateListener(callback: (game: GameEngine) => void): () => void {
    this.updateListeners.push(callback);
    return () => {
      this.updateListeners = this.updateListeners.filter((l) => l !== callback);
    };
  }

  init(): void {
    this.inputManager.init();
    this.startGameLoop();
  }

  destroy(): void {
    this.inputManager.destroy();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  setPlayerCount(count: number): void {
    this.playerCount = count;
  }

  startGame(): void {
    this.resetGame();
    this.state = 'countdown';
    this.countdown = COUNTDOWN_TIME;
    this.countdownTimer = 0;
  }

  resetGame(): void {
    this.players = [];
    this.weapons = [];
    this.winnerId = null;
    this.weaponSpawnTimer = 0;
    this.weaponIdCounter = 0;
    this.screenShake = 0;

    const spawnX = [200, 1080, 450, 830];
    for (let i = 0; i < this.playerCount; i++) {
      const config = PLAYER_CONFIGS[i];
      this.players.push(this.createPlayer(config, spawnX[i]));
    }

    for (let i = 0; i < 3; i++) {
      this.spawnWeapon();
    }
  }

  private createPlayer(config: PlayerConfig, x: number): Player {
    return {
      id: config.id,
      x,
      y: 500,
      vx: 0,
      vy: 0,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      hp: 100,
      maxHp: 100,
      color: config.color,
      colorHex: config.colorHex,
      facing: 1,
      isGrounded: false,
      isAttacking: false,
      attackTimer: 0,
      attackCooldown: 0,
      hitCooldown: 0,
      weapon: null,
      isAlive: true,
      animFrame: 0,
      hitFlash: 0,
    };
  }

  private spawnWeapon(): void {
    if (this.weapons.length >= MAX_WEAPONS) return;

    const types: WeaponType[] = ['stick', 'box', 'bomb'];
    const type = types[Math.floor(Math.random() * types.length)];
    const stats = WEAPON_STATS[type];
    const spawnPoint =
      WEAPON_SPAWN_POINTS[Math.floor(Math.random() * WEAPON_SPAWN_POINTS.length)];

    const weapon: Weapon = {
      id: this.weaponIdCounter++,
      type,
      x: spawnPoint.x - stats.width / 2,
      y: spawnPoint.y - stats.height,
      vx: 0,
      vy: 0,
      width: stats.width,
      height: stats.height,
      damage: stats.damage,
      isThrown: false,
      isPicked: false,
      ownerId: null,
      floatOffset: Math.random() * Math.PI * 2,
      rotation: 0,
    };

    this.weapons.push(weapon);
  }

  private startGameLoop(): void {
    const loop = (time: number) => {
      const deltaTime = Math.min(time - this.lastTime, 50);
      this.lastTime = time;

      this.update(deltaTime);

      for (const listener of this.updateListeners) {
        listener(this);
      }

      this.inputManager.update();
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  private update(dt: number): void {
    if (this.state === 'countdown') {
      this.updateCountdown(dt);
    } else if (this.state === 'playing') {
      this.updatePlayers(dt);
      this.updateWeapons(dt);
      this.checkCollisions();
      this.updateWeaponSpawn(dt);
      this.checkGameOver();
    }

    if (this.screenShake > 0) {
      this.screenShake *= 0.9;
      if (this.screenShake < 0.5) {
        this.screenShake = 0;
      }
    }
  }

  private updateCountdown(dt: number): void {
    this.countdownTimer += dt;
    if (this.countdownTimer >= 1000) {
      this.countdownTimer -= 1000;
      this.countdown--;
      if (this.countdown <= 0) {
        this.state = 'playing';
      }
    }
  }

  private updatePlayers(dt: number): void {
    const dtFactor = dt / 16.67;

    for (const player of this.players) {
      if (!player.isAlive) continue;

      const controls = this.inputManager.getPlayerControls(player.id);

      if (player.attackCooldown > 0) {
        player.attackCooldown -= dt;
      }
      if (player.hitCooldown > 0) {
        player.hitCooldown -= dt;
      }
      if (player.hitFlash > 0) {
        player.hitFlash -= dt;
      }

      if (player.isAttacking) {
        player.attackTimer -= dt;
        if (player.attackTimer <= 0) {
          player.isAttacking = false;
        }
      }

      const moveLeft = this.inputManager.isPressed(controls, 'left');
      const moveRight = this.inputManager.isPressed(controls, 'right');
      const jump = this.inputManager.wasPressed(controls, 'jump');
      const attack = this.inputManager.wasPressed(controls, 'attack');
      const pickup = this.inputManager.wasPressed(controls, 'pickup');

      if (moveLeft) {
        player.vx = -GAME_CONFIG.playerSpeed;
        player.facing = -1;
      } else if (moveRight) {
        player.vx = GAME_CONFIG.playerSpeed;
        player.facing = 1;
      } else {
        applyFriction(player);
      }

      if (jump && player.isGrounded) {
        player.vy = GAME_CONFIG.jumpForce;
        player.isGrounded = false;
      }

      if (attack && player.attackCooldown <= 0 && !player.isAttacking) {
        player.isAttacking = true;
        player.attackTimer = ATTACK_DURATION;
        player.attackCooldown = ATTACK_COOLDOWN;
        this.performAttack(player);
      }

      if (pickup) {
        if (player.weapon) {
          this.throwWeapon(player);
        } else {
          this.tryPickupWeapon(player);
        }
      }

      applyGravity(player, this.platforms, dtFactor);

      player.animFrame += Math.abs(player.vx) * 0.3 * dtFactor;

      if (player.weapon && player.weapon.isPicked) {
        player.weapon.x =
          player.x + player.width / 2 - player.weapon.width / 2 + player.facing * 15;
        player.weapon.y = player.y + 20;
      }
    }
  }

  private performAttack(attacker: Player): void {
    const attackBox = {
      x: attacker.facing === 1 ? attacker.x + attacker.width : attacker.x - ATTACK_RANGE,
      y: attacker.y + 10,
      width: ATTACK_RANGE,
      height: attacker.height - 20,
    };

    for (const target of this.players) {
      if (target.id === attacker.id || !target.isAlive) continue;
      if (target.hitCooldown > 0) continue;

      if (rectCollision(attackBox, target)) {
        this.damagePlayer(target, ATTACK_DAMAGE, attacker.facing);
      }
    }
  }

  private throwWeapon(player: Player): void {
    if (!player.weapon) return;

    const weapon = player.weapon;
    weapon.isPicked = false;
    weapon.isThrown = true;
    weapon.ownerId = player.id;
    weapon.vx = player.facing * 12;
    weapon.vy = -5;

    player.weapon = null;
  }

  private tryPickupWeapon(player: Player): void {
    if (player.weapon) return;

    for (const weapon of this.weapons) {
      if (weapon.isPicked || weapon.isThrown) continue;

      const dx = player.x + player.width / 2 - (weapon.x + weapon.width / 2);
      const dy = player.y + player.height / 2 - (weapon.y + weapon.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 60) {
        weapon.isPicked = true;
        weapon.ownerId = player.id;
        player.weapon = weapon;
        break;
      }
    }
  }

  private updateWeapons(dt: number): void {
    const dtFactor = dt / 16.67;

    for (const weapon of this.weapons) {
      if (weapon.isPicked) continue;

      if (!weapon.isThrown) {
        weapon.floatOffset += dt * 0.003;
      }

      if (weapon.isThrown) {
        weapon.rotation += dt * 0.02;
        applyGravity(weapon, this.platforms, dtFactor);

        if (weapon.vy === 0 && Math.abs(weapon.vx) < 0.5) {
          weapon.isThrown = false;
          weapon.vx = 0;
        }
      }
    }

    this.weapons = this.weapons.filter(
      (w) => w.x > -100 && w.x < GAME_CONFIG.width + 100 && w.y < GAME_CONFIG.height + 100
    );
  }

  private checkCollisions(): void {
    for (const weapon of this.weapons) {
      if (!weapon.isThrown || weapon.ownerId === null) continue;

      for (const player of this.players) {
        if (player.id === weapon.ownerId || !player.isAlive) continue;
        if (player.hitCooldown > 0) continue;

        if (rectCollision(weapon, player)) {
          const direction = weapon.vx > 0 ? 1 : -1;
          this.damagePlayer(player, weapon.damage, direction);
          weapon.isThrown = false;
          weapon.vx *= 0.3;
          break;
        }
      }
    }
  }

  private damagePlayer(player: Player, damage: number, direction: number): void {
    player.hp -= damage;
    player.hitCooldown = HIT_COOLDOWN;
    player.hitFlash = 100;
    player.vx = direction * KNOCKBACK_FORCE;
    player.vy = -5;

    this.screenShake = Math.min(this.screenShake + damage * 0.3, 15);

    if (player.hp <= 0) {
      player.hp = 0;
      player.isAlive = false;
      if (player.weapon) {
        player.weapon.isPicked = false;
        player.weapon.ownerId = null;
        player.weapon = null;
      }
    }
  }

  private updateWeaponSpawn(dt: number): void {
    this.weaponSpawnTimer += dt;
    if (this.weaponSpawnTimer >= WEAPON_SPAWN_INTERVAL) {
      this.weaponSpawnTimer = 0;
      this.spawnWeapon();
    }
  }

  private checkGameOver(): void {
    const alivePlayers = this.players.filter((p) => p.isAlive);
    if (alivePlayers.length <= 1 && this.state === 'playing') {
      this.state = 'result';
      this.winnerId = alivePlayers.length === 1 ? alivePlayers[0].id : null;
    }
  }

  returnToMenu(): void {
    this.state = 'menu';
    this.players = [];
    this.weapons = [];
  }
}
