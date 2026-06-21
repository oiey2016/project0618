import { Ball, Wall, Goal, Hole, Vector } from '../types/game';

const GRAVITY = 0.5;
const FRICTION = 0.99;
const BOUNCE = 0.8;
const GOAL_THRESHOLD = 1.2;
const HOLE_THRESHOLD = 1.0;

export const updateBall = (ball: Ball, gravity: Vector): Ball => {
  let newVx = ball.vx + gravity.x * GRAVITY;
  let newVy = ball.vy + gravity.y * GRAVITY;
  
  newVx *= FRICTION;
  newVy *= FRICTION;
  
  const minVelocity = 0.05;
  if (Math.abs(newVx) < minVelocity) newVx = 0;
  if (Math.abs(newVy) < minVelocity) newVy = 0;
  
  return {
    ...ball,
    x: ball.x + newVx,
    y: ball.y + newVy,
    vx: newVx,
    vy: newVy,
  };
};

export const checkWallCollision = (ball: Ball, walls: Wall[]): Ball => {
  let newBall = { ...ball };
  
  for (const wall of walls) {
    const closestX = Math.max(wall.x, Math.min(newBall.x, wall.x + wall.width));
    const closestY = Math.max(wall.y, Math.min(newBall.y, wall.y + wall.height));
    
    const dx = newBall.x - closestX;
    const dy = newBall.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < newBall.radius) {
      const overlap = newBall.radius - distance;
      const nx = dx / distance;
      const ny = dy / distance;
      
      newBall.x += nx * overlap;
      newBall.y += ny * overlap;
      
      if (Math.abs(nx) > Math.abs(ny)) {
        newBall.vx = -newBall.vx * BOUNCE;
      } else {
        newBall.vy = -newBall.vy * BOUNCE;
      }
    }
  }
  
  return newBall;
};

export const checkGoalCollision = (ball: Ball, goal: Goal): boolean => {
  const dx = ball.x - goal.x;
  const dy = ball.y - goal.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < goal.radius * GOAL_THRESHOLD;
};

export const checkHoleCollision = (ball: Ball, holes: Hole[]): boolean => {
  for (const hole of holes) {
    const dx = ball.x - hole.x;
    const dy = ball.y - hole.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < hole.radius * HOLE_THRESHOLD) {
      return true;
    }
  }
  return false;
};

export const checkBoundaryCollision = (
  ball: Ball,
  width: number,
  height: number
): Ball => {
  let newBall = { ...ball };
  
  if (newBall.x - newBall.radius < 0) {
    newBall.x = newBall.radius;
    newBall.vx = -newBall.vx * BOUNCE;
  }
  if (newBall.x + newBall.radius > width) {
    newBall.x = width - newBall.radius;
    newBall.vx = -newBall.vx * BOUNCE;
  }
  if (newBall.y - newBall.radius < 0) {
    newBall.y = newBall.radius;
    newBall.vy = -newBall.vy * BOUNCE;
  }
  if (newBall.y + newBall.radius > height) {
    newBall.y = height - newBall.radius;
    newBall.vy = -newBall.vy * BOUNCE;
  }
  
  return newBall;
};