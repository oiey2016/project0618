import Matter from 'matter-js';

const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 600;

export { WORLD_WIDTH, WORLD_HEIGHT };

type CollisionCallback = (event: Matter.IEventCollision<Matter.Engine>) => void;

export class PhysicsWorld {
  engine: Matter.Engine;
  world: Matter.World;
  private collisionCallback: CollisionCallback | null = null;

  constructor() {
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
    });
    this.world = this.engine.world;
  }

  addBody(body: Matter.Body) {
    Matter.Composite.add(this.world, body);
  }

  removeBody(body: Matter.Body) {
    Matter.Composite.remove(this.world, body);
  }

  addStaticRect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string = '#8B6914',
    label: string = 'platform'
  ): Matter.Body {
    const body = Matter.Bodies.rectangle(x, y, w, h, {
      isStatic: true,
      label,
      render: { fillStyle: color },
    });
    this.addBody(body);
    return body;
  }

  addDynamicRect(
    x: number,
    y: number,
    w: number,
    h: number,
    options: Matter.IBodyDefinition = {}
  ): Matter.Body {
    const body = Matter.Bodies.rectangle(x, y, w, h, {
      ...options,
      label: options.label || 'dynamicRect',
    });
    this.addBody(body);
    return body;
  }

  addCircle(
    x: number,
    y: number,
    radius: number,
    options: Matter.IBodyDefinition = {}
  ): Matter.Body {
    const body = Matter.Bodies.circle(x, y, radius, {
      ...options,
      label: options.label || 'circle',
    });
    this.addBody(body);
    return body;
  }

  addBodyWithOptions(
    x: number,
    y: number,
    w: number,
    h: number,
    options: Matter.IBodyDefinition
  ): Matter.Body {
    const body = Matter.Bodies.rectangle(x, y, w, h, options);
    this.addBody(body);
    return body;
  }

  onCollision(callback: CollisionCallback) {
    this.collisionCallback = callback;
    Matter.Events.on(this.engine, 'collisionStart', callback);
  }

  onCollisionEnd(callback: CollisionCallback) {
    Matter.Events.on(this.engine, 'collisionEnd', callback);
  }

  update(delta: number) {
    Matter.Engine.update(this.engine, delta);
  }

  getBodies(): Matter.Body[] {
    return Matter.Composite.allBodies(this.world);
  }

  clear() {
    Matter.Composite.clear(this.world, false);
    if (this.collisionCallback) {
      Matter.Events.off(this.engine, 'collisionStart', this.collisionCallback);
      this.collisionCallback = null;
    }
  }
}
