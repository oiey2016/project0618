import Matter from 'matter-js';
import { PhysicsWorld } from './PhysicsWorld';
import { Renderer } from './Renderer';
import { ItemDefinition } from '@/data/items';
import { LevelDefinition } from '@/levels/types';

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}

export interface ObstacleDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ItemDef {
  x: number;
  y: number;
  type: string;
  radius?: number;
}

export interface GoalDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlayerDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LevelData {
  platforms: PlatformDef[];
  obstacles?: ObstacleDef[];
  items?: ItemDef[];
  goal: GoalDef;
  player: PlayerDef;
  bgType?: string;
}

export type GameEventCallback = (event: string, data?: any) => void;

export class GameEngine {
  physicsWorld: PhysicsWorld;
  renderer: Renderer | null = null;
  private animationId: number | null = null;
  private running: boolean = false;
  private player: Matter.Body | null = null;
  private goal: Matter.Body | null = null;
  private currentLevel: LevelDefinition | null = null;
  private eventCallback: GameEventCallback | null = null;
  private lastTime: number = 0;
  private isGrounded: boolean = false;
  private groundContacts: Set<number> = new Set();

  constructor() {
    this.physicsWorld = new PhysicsWorld();
  }

  init(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.physicsWorld.onCollision((event) => {
      this.handleCollisionStart(event);
    });
    this.physicsWorld.onCollisionEnd((event) => {
      this.handleCollisionEnd(event);
    });
  }

  loadLevel(levelDef: LevelDefinition) {
    this.physicsWorld.clear();
    this.currentLevel = levelDef;
    this.isGrounded = false;
    this.groundContacts.clear();

    this.physicsWorld.addStaticRect(600, 590, 1200, 20, '#654321', 'platform');

    for (const p of levelDef.platforms) {
      this.physicsWorld.addStaticRect(p.x, p.y, p.width, p.height, '#8B6914', 'platform');
    }

    for (const o of levelDef.obstacles) {
      this.physicsWorld.addStaticRect(o.x, o.y, o.width, o.height, '#E53935', 'obstacle');
    }

    this.goal = this.physicsWorld.addBodyWithOptions(
      levelDef.goal.x, levelDef.goal.y, 40, 60,
      {
        isStatic: true,
        isSensor: true,
        label: 'goal',
      }
    );

    this.player = this.physicsWorld.addDynamicRect(
      levelDef.playerStart.x, levelDef.playerStart.y, 30, 40,
      {
        label: 'player',
        friction: 0.5,
        restitution: 0.1,
      }
    );
  }

  spawnItem(itemDef: ItemDefinition, x: number, y: number): Matter.Body {
    let body: Matter.Body;
    const options: Matter.IBodyDefinition = {
      label: 'spawnedItem',
      friction: itemDef.physics.friction,
      restitution: itemDef.physics.restitution,
      density: itemDef.physics.density,
      isStatic: itemDef.physics.isStatic,
    };

    if (itemDef.drawStyle === 'circle') {
      const radius = Math.min(itemDef.width, itemDef.height) / 2;
      body = this.physicsWorld.addCircle(x, y, radius, options);
    } else {
      body = this.physicsWorld.addBodyWithOptions(x, y, itemDef.width, itemDef.height, options);
    }

    (body as any).itemDef = itemDef;
    return body;
  }

  setPlayerVelocity(vx: number, vy: number) {
    if (!this.player) return;
    Matter.Body.setVelocity(this.player, { x: vx, y: vy });
  }

  jump() {
    if (!this.player || !this.isGrounded) return;
    Matter.Body.setVelocity(this.player, { x: this.player.velocity.x, y: -8 });
    this.isGrounded = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private loop = () => {
    if (!this.running) return;
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.update(delta);
    this.animationId = requestAnimationFrame(this.loop);
  };

  update(delta: number) {
    const clampedDelta = Math.min(delta, 32);
    this.physicsWorld.update(clampedDelta);
    this.applySpecialPhysics();
    this.checkPlayerFall();
    this.render();
  }

  private applySpecialPhysics() {
    const bodies = this.physicsWorld.getBodies();
    for (const body of bodies) {
      if (body.label !== 'spawnedItem') continue;
      const itemDef: ItemDefinition | undefined = (body as any).itemDef;
      if (!itemDef) continue;

      if (itemDef.physics.buoyancy) {
        Matter.Body.applyForce(body, body.position, {
          x: 0,
          y: -itemDef.physics.buoyancy,
        });
      }

      if (itemDef.physics.windForce) {
        for (const other of bodies) {
          if (other.id === body.id) continue;
          if (other.isStatic && other.label !== 'player') continue;

          const dx = other.position.x - body.position.x;
          const dy = other.position.y - body.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const force = itemDef.physics.windForce * (1 - dist / 200);
            Matter.Body.applyForce(other, other.position, {
              x: force,
              y: 0,
            });
          }
        }
      }
    }
  }

  private checkPlayerFall() {
    if (!this.player) return;
    if (this.player.position.y > 700) {
      this.emitEvent('lose');
    }
  }

  private render() {
    if (!this.renderer) return;
    const ctx = this.renderer.ctx;
    this.renderer.drawBackground(ctx, this.currentLevel?.background || 'default');

    const bodies = this.physicsWorld.getBodies();
    for (const body of bodies) {
      if (body.label === 'platform') {
        this.renderer.drawPlatform(ctx, body);
      } else if (body.label === 'player') {
        this.renderer.drawPlayer(ctx, body);
      } else if (body.label === 'goal') {
        this.renderer.drawGoal(ctx, body);
      } else if (body.label === 'obstacle') {
        this.renderer.drawObstacle(ctx, body);
      } else if (body.label === 'spawnedItem') {
        this.renderer.drawSpawnedItem(ctx, body);
      }
    }
  }

  private handleCollisionStart(event: Matter.IEventCollision<Matter.Engine>) {
    if (!this.player) return;
    for (const pair of event.pairs) {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (bodyA.id === this.player.id || bodyB.id === this.player.id) {
        const other = bodyA.id === this.player.id ? bodyB : bodyA;

        if (other.label === 'goal') {
          this.emitEvent('win');
          return;
        }

        if (other.label === 'obstacle') {
          this.emitEvent('lose');
          return;
        }

        if (other.label === 'platform' || other.label === 'spawnedItem') {
          this.groundContacts.add(other.id);
          this.isGrounded = true;
        }
      }
    }
  }

  private handleCollisionEnd(event: Matter.IEventCollision<Matter.Engine>) {
    if (!this.player) return;
    for (const pair of event.pairs) {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      if (bodyA.id === this.player.id || bodyB.id === this.player.id) {
        const other = bodyA.id === this.player.id ? bodyB : bodyA;

        if (other.label === 'platform' || other.label === 'spawnedItem') {
          this.groundContacts.delete(other.id);
          if (this.groundContacts.size === 0) {
            this.isGrounded = false;
          }
        }
      }
    }
  }

  onEvent(callback: GameEventCallback) {
    this.eventCallback = callback;
  }

  private emitEvent(event: string, data?: any) {
    if (this.eventCallback) {
      this.eventCallback(event, data);
    }
  }

  getPlayerPosition(): { x: number; y: number } | null {
    if (!this.player) return null;
    return { x: this.player.position.x, y: this.player.position.y };
  }

  reset() {
    if (this.currentLevel) {
      this.stop();
      this.loadLevel(this.currentLevel);
    }
  }

  destroy() {
    this.stop();
    this.physicsWorld.clear();
    this.player = null;
    this.goal = null;
    this.currentLevel = null;
    this.isGrounded = false;
    this.groundContacts.clear();
    this.eventCallback = null;
  }
}
