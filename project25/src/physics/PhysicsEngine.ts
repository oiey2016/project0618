import Matter from 'matter-js';
import { BlockType, PlacedBlock, TerrainElement } from '@/types';
import { BLOCKS_INFO } from '@/data/blocks';

export interface PhysicsCallbacks {
  onGoalReached?: () => void;
  onPlayerFall?: () => void;
  onPlayerUpdate?: (x: number, y: number) => void;
}

const BODY_TAGS = {
  PLAYER: 'player',
  PLAYER_PART: 'player_part',
  GOAL: 'goal',
  TERRAIN: 'terrain',
  BLOCK: 'block',
};

export class PhysicsEngine {
  private engine: Matter.Engine;
  private render: Matter.Render | null = null;
  private runner: Matter.Runner | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private world: Matter.World;
  private playerComposite: Matter.Composite | null = null;
  private playerCenterBody: Matter.Body | null = null;
  private goalBody: Matter.Body | null = null;
  private blockBodies: Map<string, Matter.Body> = new Map();
  private glueConstraints: Map<string, Matter.Constraint> = new Map();
  private callbacks: PhysicsCallbacks = {};
  private bounds = { width: 1100, height: 620 };
  private updateHandler: (() => void) | null = null;

  constructor() {
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.0018 },
    });
    this.world = this.engine.world;
  }

  init(canvas: HTMLCanvasElement, width: number, height: number, callbacks: PhysicsCallbacks = {}) {
    this.canvas = canvas;
    this.bounds = { width, height };
    this.callbacks = callbacks;

    this.render = Matter.Render.create({
      canvas,
      engine: this.engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    Matter.Render.run(this.render);

    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);

    this.engine.enabled = false;

    Matter.Events.on(this.engine, 'collisionStart', this.handleCollision);
    Matter.Events.on(this.engine, 'afterUpdate', this.handleUpdate);
  }

  destroy() {
    if (this.updateHandler) {
      Matter.Events.off(this.engine, 'afterUpdate', this.updateHandler);
    }
    Matter.Events.off(this.engine, 'collisionStart', this.handleCollision);
    Matter.Events.off(this.engine, 'afterUpdate', this.handleUpdate);

    if (this.runner) {
      Matter.Runner.stop(this.runner);
    }
    if (this.render) {
      Matter.Render.stop(this.render);
    }
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
  }

  reset() {
    this.stop();
    this.clearDynamicBodies();
    this.engine.enabled = false;
  }

  start() {
    this.engine.enabled = true;
  }

  stop() {
    this.engine.enabled = false;
  }

  setPaused(paused: boolean) {
    this.engine.enabled = !paused;
  }

  clearDynamicBodies() {
    if (this.playerComposite) {
      Matter.World.remove(this.world, this.playerComposite);
      this.playerComposite = null;
    }
    this.playerCenterBody = null;
    this.goalBody = null;

    for (const body of this.blockBodies.values()) {
      Matter.World.remove(this.world, body);
    }
    this.blockBodies.clear();

    for (const c of this.glueConstraints.values()) {
      Matter.World.remove(this.world, c);
    }
    this.glueConstraints.clear();

    const bodies = Matter.Composite.allBodies(this.world);
    for (const b of bodies) {
      if (b.label !== BODY_TAGS.TERRAIN) {
        Matter.World.remove(this.world, b);
      }
    }
    const constraints = Matter.Composite.allConstraints(this.world);
    for (const c of constraints) {
      Matter.World.remove(this.world, c);
    }
  }

  createTerrain(terrain: TerrainElement[]) {
    const bodies: Matter.Body[] = [];

    const walls = [
      { x: -30, y: this.bounds.height / 2, w: 60, h: this.bounds.height + 100 },
      { x: this.bounds.width + 30, y: this.bounds.height / 2, w: 60, h: this.bounds.height + 100 },
      { x: this.bounds.width / 2, y: this.bounds.height + 80, w: this.bounds.width + 200, h: 60 },
    ];
    for (const w of walls) {
      const body = Matter.Bodies.rectangle(w.x, w.y, w.w, w.h, {
        isStatic: true,
        label: BODY_TAGS.TERRAIN,
        friction: 0.5,
        render: { visible: false },
      });
      bodies.push(body);
    }

    for (const t of terrain) {
      if (t.type === 'goal') continue;
      const isObstacle = t.type === 'obstacle';
      const body = Matter.Bodies.rectangle(
        t.x + t.width / 2,
        t.y + t.height / 2,
        t.width,
        t.height,
        {
          isStatic: true,
          label: BODY_TAGS.TERRAIN,
          friction: 0.6,
          restitution: isObstacle ? 0.3 : 0.1,
          render: {
            fillStyle: t.color || '#B8E0C4',
            strokeStyle: isObstacle ? '#FF6B9D' : '#8FBFA1',
            lineWidth: 3,
          },
          chamfer: { radius: 10 },
        }
      );
      bodies.push(body);
    }

    const goalTerrain = terrain.find(t => t.type === 'goal');
    if (goalTerrain) {
      this.goalBody = Matter.Bodies.rectangle(
        goalTerrain.x + goalTerrain.width / 2,
        goalTerrain.y + goalTerrain.height / 2,
        goalTerrain.width,
        goalTerrain.height,
        {
          isStatic: true,
          isSensor: true,
          label: BODY_TAGS.GOAL,
          render: {
            fillStyle: '#FFD466',
            strokeStyle: '#FFB84D',
            lineWidth: 4,
          },
          chamfer: { radius: 12 },
        }
      );
      bodies.push(this.goalBody);
    }

    Matter.World.add(this.world, bodies);
  }

  createPlayer(x: number, y: number) {
    const composite = Matter.Composite.create({ label: BODY_TAGS.PLAYER });

    const center = Matter.Bodies.circle(x, y, 28, {
      label: BODY_TAGS.PLAYER,
      density: 0.0025,
      restitution: 0.35,
      friction: 0.4,
      frictionAir: 0.015,
      render: {
        fillStyle: '#FFD6C8',
        strokeStyle: '#FFB097',
        lineWidth: 3,
      },
    });
    this.playerCenterBody = center;

    const parts: Matter.Body[] = [center];
    const offsets = [
      { dx: -18, dy: -14, r: 14 },
      { dx: 18, dy: -14, r: 14 },
      { dx: -20, dy: 8, r: 13 },
      { dx: 20, dy: 8, r: 13 },
      { dx: 0, dy: 22, r: 15 },
      { dx: 0, dy: -24, r: 12 },
    ];

    for (const off of offsets) {
      const part = Matter.Bodies.circle(x + off.dx, y + off.dy, off.r, {
        label: BODY_TAGS.PLAYER_PART,
        density: 0.002,
        restitution: 0.4,
        friction: 0.3,
        render: {
          fillStyle: '#FFE0D0',
          strokeStyle: '#FFB097',
          lineWidth: 2,
          visible: false,
        },
      });
      parts.push(part);
      const constraint = Matter.Constraint.create({
        bodyA: center,
        bodyB: part,
        stiffness: 0.05,
        damping: 0.1,
        length: Math.sqrt(off.dx * off.dx + off.dy * off.dy),
        render: { visible: false },
      });
      Matter.Composite.add(composite, constraint);
    }

    Matter.Composite.add(composite, parts);

    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const dist = Matter.Vector.magnitude(
          Matter.Vector.sub(parts[i].position, parts[j].position)
        );
        const c = Matter.Constraint.create({
          bodyA: parts[i],
          bodyB: parts[j],
          stiffness: 0.03,
          damping: 0.08,
          length: dist * 1.05,
          render: { visible: false },
        });
        Matter.Composite.add(composite, c);
      }
    }

    this.playerComposite = composite;
    Matter.World.add(this.world, composite);
  }

  addPlacedBlock(block: PlacedBlock): Matter.Body | null {
    const info = BLOCKS_INFO[block.type];
    if (!info) return null;

    const props = info.physicsProps;
    let body: Matter.Body;

    if (block.type === BlockType.BALLOON) {
      body = Matter.Bodies.circle(
        block.x,
        block.y,
        Math.min(block.width, block.height) / 2,
        {
          label: BODY_TAGS.BLOCK,
          density: -0.005,
          restitution: props.restitution || 0.4,
          friction: props.friction,
          frictionAir: 0.08,
          isStatic: props.isStatic || false,
          render: {
            fillStyle: info.color,
            strokeStyle: '#FF8FB1',
            lineWidth: 2.5,
          },
        }
      );
    } else if (block.type === BlockType.GLUE) {
      body = Matter.Bodies.circle(
        block.x,
        block.y,
        block.width / 2,
        {
          label: BODY_TAGS.BLOCK,
          isStatic: true,
          render: {
            fillStyle: info.color,
            strokeStyle: '#7EC8E3',
            lineWidth: 2,
          },
        }
      );
    } else if (block.type === BlockType.SPRING) {
      body = Matter.Bodies.rectangle(
        block.x,
        block.y,
        block.width,
        block.height,
        {
          label: BODY_TAGS.BLOCK,
          density: 0.003,
          restitution: 1.6,
          friction: 0.3,
          render: {
            fillStyle: info.color,
            strokeStyle: '#E85D8A',
            lineWidth: 3,
          },
          chamfer: { radius: 6 },
        }
      );
    } else if (block.type === BlockType.PIVOT) {
      body = Matter.Bodies.circle(
        block.x,
        block.y,
        block.width / 2,
        {
          label: BODY_TAGS.BLOCK,
          isStatic: true,
          render: {
            fillStyle: info.color,
            strokeStyle: '#8FBFA1',
            lineWidth: 3,
          },
        }
      );
    } else if (block.type === BlockType.SOFT_BLOCK) {
      body = Matter.Bodies.rectangle(
        block.x,
        block.y,
        block.width,
        block.height,
        {
          label: BODY_TAGS.BLOCK,
          density: 0.0015,
          restitution: 0.9,
          friction: 0.4,
          render: {
            fillStyle: info.color,
            strokeStyle: '#E6C56B',
            lineWidth: 2.5,
          },
          chamfer: { radius: 14 },
        }
      );
    } else {
      body = Matter.Bodies.rectangle(
        block.x,
        block.y,
        block.width,
        block.height,
        {
          label: BODY_TAGS.BLOCK,
          angle: block.rotation,
          density: props.density || 0.004,
          restitution: props.restitution || 0.1,
          friction: props.friction || 0.6,
          render: {
            fillStyle: info.color,
            strokeStyle: '#B08050',
            lineWidth: 2.5,
          },
          chamfer: { radius: 4 },
        }
      );
    }

    Matter.Body.setAngle(body, block.rotation);
    Matter.World.add(this.world, body);
    this.blockBodies.set(block.id, body);

    if (block.type === BlockType.GLUE) {
      this.tryCreateGlueConstraints(block, body);
    }
    if (block.type === BlockType.PIVOT) {
      this.tryCreatePivotConstraints(block, body);
    }

    return body;
  }

  private tryCreateGlueConstraints(glueBlock: PlacedBlock, glueBody: Matter.Body) {
    const radius = 50;
    const nearby = this.findBodiesNear(glueBlock.x, glueBlock.y, radius);
    let count = 0;
    for (const b of nearby) {
      if (b === glueBody || count >= 2) break;
      if (b.label === BODY_TAGS.TERRAIN || b.label === BODY_TAGS.BLOCK) {
        const c = Matter.Constraint.create({
          bodyA: glueBody,
          bodyB: b,
          stiffness: 0.9,
          damping: 0.1,
          length: 0,
          render: {
            visible: true,
            strokeStyle: '#7EC8E3',
            lineWidth: 3,
            type: 'line',
          },
        });
        const id = `glue_${glueBlock.id}_${count}`;
        Matter.World.add(this.world, c);
        this.glueConstraints.set(id, c);
        count++;
      }
    }
  }

  private tryCreatePivotConstraints(pivotBlock: PlacedBlock, pivotBody: Matter.Body) {
    const radius = 80;
    const nearby = this.findBodiesNear(pivotBlock.x, pivotBlock.y, radius);
    for (const b of nearby) {
      if (b === pivotBody) continue;
      if (b.label === BODY_TAGS.BLOCK && !b.isStatic) {
        const c = Matter.Constraint.create({
          pointA: { x: 0, y: 0 },
          bodyB: b,
          pointB: Matter.Vector.sub(b.position, pivotBody.position),
          bodyA: pivotBody,
          stiffness: 1,
          damping: 0.05,
          length: 0,
          render: {
            visible: true,
            strokeStyle: '#8FBFA1',
            lineWidth: 2,
          },
        });
        const id = `pivot_${pivotBlock.id}_${b.id}`;
        Matter.World.add(this.world, c);
        this.glueConstraints.set(id, c);
        break;
      }
    }
  }

  private findBodiesNear(x: number, y: number, radius: number): Matter.Body[] {
    const allBodies = Matter.Composite.allBodies(this.world);
    const result: Matter.Body[] = [];
    for (const b of allBodies) {
      const dx = b.position.x - x;
      const dy = b.position.y - y;
      if (dx * dx + dy * dy <= radius * radius) {
        result.push(b);
      }
    }
    return result;
  }

  removePlacedBlock(id: string) {
    const body = this.blockBodies.get(id);
    if (body) {
      Matter.World.remove(this.world, body);
      this.blockBodies.delete(id);
    }
    for (const [key, c] of this.glueConstraints) {
      if (key.includes(id)) {
        Matter.World.remove(this.world, c);
        this.glueConstraints.delete(key);
      }
    }
  }

  private handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;
      const isGoal = bodyA.label === BODY_TAGS.GOAL || bodyB.label === BODY_TAGS.GOAL;
      const isPlayer = bodyA.label === BODY_TAGS.PLAYER || bodyB.label === BODY_TAGS.PLAYER
        || bodyA.label === BODY_TAGS.PLAYER_PART || bodyB.label === BODY_TAGS.PLAYER_PART;
      if (isGoal && isPlayer) {
        this.callbacks.onGoalReached?.();
        return;
      }
    }
  };

  private handleUpdate = () => {
    if (this.playerCenterBody) {
      const { x, y } = this.playerCenterBody.position;
      this.callbacks.onPlayerUpdate?.(x, y);
      if (y > this.bounds.height + 100) {
        this.callbacks.onPlayerFall?.();
      }
    }
  };

  getPlayerPosition() {
    if (this.playerCenterBody) {
      return {
        x: this.playerCenterBody.position.x,
        y: this.playerCenterBody.position.y,
      };
    }
    return null;
  }
}
