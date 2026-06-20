import { useGameStore } from '../store';
import { PlayerSystem } from './Player';
import { EnemySystem } from './Enemy';
import { CollisionSystem } from './Collision';
import { Renderer } from './Renderer';
import { audioManager } from '../utils/audio';
import { Particle } from '../types';
import { TOTAL_KEYS, COLORS } from '../constants';
import { distance } from '../utils/math';

export class GameLoop {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: Renderer;
  private animationId: number | null = null;
  private lastTime: number = 0;
  private footstepTimer: number = 0;
  private heartbeatTimer: number = 0;
  private chaseSoundTimer: number = 0;
  private hideCooldown: number = 0;
  private actionCooldown: number = 0;
  private wasSpotted: boolean = false;
  private wasChasing: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.renderer = new Renderer(ctx, canvas.width, canvas.height);
  }

  start(): void {
    this.lastTime = performance.now();
    this.loop();
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private loop = (): void => {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    const state = useGameStore.getState();

    if (state.phase === 'playing') {
      this.update(dt);
    }

    this.render();

    this.animationId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    const state = useGameStore.getState();
    const { input, player, enemy, walls, isHiding, isChasing } = state;

    if (this.hideCooldown > 0) this.hideCooldown -= dt * 1000;
    if (this.actionCooldown > 0) this.actionCooldown -= dt * 1000;

    const playerUpdate = PlayerSystem.update(player, input, walls, isHiding, dt);
    useGameStore.getState().setPlayer(playerUpdate);

    const isMoving = Math.abs(playerUpdate.velocityX || 0) > 0 || Math.abs(playerUpdate.velocityY || 0) > 0;
    if (isMoving && !isHiding) {
      this.footstepTimer -= dt * 1000;
      if (this.footstepTimer <= 0) {
        audioManager.playFootstep();
        this.footstepTimer = 250 + Math.random() * 100;
      }
    }

    const { enemy: enemyUpdate, spotted, caught } = EnemySystem.update(
      enemy,
      useGameStore.getState().player,
      walls,
      isHiding,
      isChasing,
      dt
    );
    useGameStore.getState().setEnemy(enemyUpdate);

    if (spotted && !this.wasSpotted && !isHiding) {
      audioManager.playSpotted();
      useGameStore.getState().setFlashEffect('#FF0000', 0.3);
      useGameStore.getState().setScreenShake(8);
      useGameStore.getState().setIsChasing(true);
    }
    this.wasSpotted = spotted;

    if (caught) {
      audioManager.playLose();
      useGameStore.getState().setPhase('lost');
      useGameStore.getState().setFlashEffect('#FF0000', 0.5);
      useGameStore.getState().setScreenShake(15);
      return;
    }

    const currentChasing = useGameStore.getState().enemy.state === 'chase';
    if (currentChasing) {
      this.chaseSoundTimer -= dt * 1000;
      if (this.chaseSoundTimer <= 0) {
        audioManager.playChase();
        this.chaseSoundTimer = 600;
      }

      this.heartbeatTimer -= dt * 1000;
      if (this.heartbeatTimer <= 0) {
        const dist = distance(
          player.x + player.width / 2,
          player.y + player.height / 2,
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2
        );
        const speed = Math.max(0.5, 1.5 - dist / 300);
        audioManager.playHeartbeat(speed);
        this.heartbeatTimer = 500 * speed;
      }
    } else if (this.wasChasing && !currentChasing) {
      useGameStore.getState().setIsChasing(false);
    }
    this.wasChasing = currentChasing;

    const nearbyKey = CollisionSystem.checkKeyCollection(
      useGameStore.getState().player,
      state.keys
    );
    useGameStore.getState().setNearbyKey(nearbyKey);

    const nearbySpot = CollisionSystem.checkNearbyHidingSpot(
      useGameStore.getState().player,
      state.hidingSpots
    );
    useGameStore.getState().setNearbyHidingSpot(nearbySpot);

    const canInteract = !!(nearbyKey || nearbySpot || state.isHiding);
    useGameStore.getState().setCanInteract(canInteract);

    if (input.action && this.actionCooldown <= 0) {
      this.handleAction();
      this.actionCooldown = 200;
    }

    useGameStore.getState().updateGameTime(dt);
    useGameStore.getState().updateParticles(dt);

    const shake = useGameStore.getState().screenShake;
    if (shake > 0) {
      useGameStore.getState().setScreenShake(Math.max(0, shake - dt * 30));
    }

    const flash = useGameStore.getState().flashEffect;
    if (flash.alpha > 0) {
      useGameStore.getState().setFlashEffect(flash.color, Math.max(0, flash.alpha - dt * 2));
    }

    const atDoor = CollisionSystem.checkAtDoor(useGameStore.getState().player, state.door);
    if (atDoor && state.door.unlocked && state.collectedKeys >= TOTAL_KEYS) {
      audioManager.playWin();
      useGameStore.getState().setPhase('won');
      useGameStore.getState().setFlashEffect('#00FF00', 0.3);
    }
  }

  private handleAction(): void {
    const state = useGameStore.getState();
    const { nearbyKey, nearbyHidingSpot, isHiding } = state;

    if (isHiding) {
      audioManager.playHide();
      useGameStore.getState().setIsHiding(false, null);
      return;
    }

    if (nearbyHidingSpot && !nearbyHidingSpot.occupied && this.hideCooldown <= 0) {
      audioManager.playHide();
      useGameStore.getState().setIsHiding(true, nearbyHidingSpot);
      useGameStore.getState().incrementStat('hideCount');
      this.hideCooldown = 300;
      return;
    }

    if (nearbyKey && !nearbyKey.collected) {
      audioManager.playKeyCollect();
      useGameStore.getState().collectKey(nearbyKey.id);
      
      if (state.collectedKeys + 1 >= TOTAL_KEYS) {
        audioManager.playDoorUnlock();
        setTimeout(() => {
          useGameStore.getState().setFlashEffect(COLORS.iceMint, 0.4);
        }, 500);
      }

      this.spawnKeyParticles(nearbyKey.x + nearbyKey.width / 2, nearbyKey.y + nearbyKey.height / 2);
      useGameStore.getState().setNearbyKey(null);
      return;
    }
  }

  private spawnKeyParticles(x: number, y: number): void {
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = 50 + Math.random() * 100;
      const particle: Particle = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 800,
        maxLife: 800,
        color: COLORS.keyColor,
        size: 3 + Math.random() * 4,
      };
      useGameStore.getState().addParticle(particle);
    }
  }

  private render(): void {
    const state = useGameStore.getState();
    this.renderer.render(state);
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.renderer = new Renderer(this.ctx, width, height);
  }
}
