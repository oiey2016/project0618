import { GameState, Particle } from '../types';
import { COLORS, MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { distance } from '../utils/math';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  render(state: GameState): void {
    const { ctx } = this;
    const scaleX = this.width / MAP_WIDTH;
    const scaleY = this.height / MAP_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (this.width - MAP_WIDTH * scale) / 2;
    const offsetY = (this.height - MAP_HEIGHT * scale) / 2;

    ctx.save();
    
    if (state.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * state.screenShake * 2;
      const shakeY = (Math.random() - 0.5) * state.screenShake * 2;
      ctx.translate(shakeX, shakeY);
    }

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    this.drawFloor(state);
    this.drawWalls(state);
    this.drawHidingSpots(state);
    this.drawKeys(state);
    this.drawDoor(state);
    this.drawEnemyView(state);
    this.drawPlayerView(state);
    this.drawEnemy(state);
    this.drawPlayer(state);
    this.drawParticles(state.particles);
    this.drawNearbyIndicators(state);

    ctx.restore();

    this.drawFlashEffect(state);
  }

  private drawFloor(state: GameState): void {
    const { ctx } = this;
    
    const gradient = ctx.createRadialGradient(
      MAP_WIDTH / 2, MAP_HEIGHT / 2, 0,
      MAP_WIDTH / 2, MAP_HEIGHT / 2, MAP_WIDTH / 2
    );
    gradient.addColorStop(0, COLORS.floorAccent);
    gradient.addColorStop(1, COLORS.floorColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    ctx.strokeStyle = 'rgba(255, 105, 180, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < MAP_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < MAP_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MAP_WIDTH, y);
      ctx.stroke();
    }

    if (state.isHiding) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    }
  }

  private drawWalls(state: GameState): void {
    const { ctx } = this;
    
    for (const wall of state.walls) {
      ctx.fillStyle = wall.color;
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
      
      ctx.strokeStyle = COLORS.icePink;
      ctx.lineWidth = 1;
      ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);

      const gradient = ctx.createLinearGradient(
        wall.x, wall.y,
        wall.x + wall.width, wall.y + wall.height
      );
      gradient.addColorStop(0, 'rgba(255, 105, 180, 0.1)');
      gradient.addColorStop(1, 'rgba(148, 0, 211, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
  }

  private drawHidingSpots(state: GameState): void {
    const { ctx } = this;
    
    for (const spot of state.hidingSpots) {
      let color = 'rgba(100, 100, 255, 0.3)';
      let borderColor = 'rgba(100, 100, 255, 0.8)';
      
      if (spot.occupied) {
        color = 'rgba(0, 255, 100, 0.4)';
        borderColor = 'rgba(0, 255, 100, 1)';
      }
      
      if (state.nearbyHidingSpot?.id === spot.id && !state.isHiding) {
        color = 'rgba(100, 255, 100, 0.5)';
        borderColor = COLORS.iceMint;
        ctx.shadowColor = COLORS.iceMint;
        ctx.shadowBlur = 15;
      }

      ctx.fillStyle = color;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;

      const radius = spot.type === 'fridge' ? 8 : spot.type === 'table' ? 4 : 2;
      this.roundRect(spot.x, spot.y, spot.width, spot.height, radius);
      
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = spot.occupied ? COLORS.iceMint : 'rgba(200, 200, 255, 0.8)';
      ctx.font = '16px VT323';
      ctx.textAlign = 'center';
      const icon = spot.type === 'fridge' ? '❄' : spot.type === 'table' ? '▬' : '📦';
      ctx.fillText(icon, spot.x + spot.width / 2, spot.y + spot.height / 2 + 5);
    }
  }

  private drawKeys(state: GameState): void {
    const { ctx } = this;
    const time = Date.now() / 1000;
    
    for (const key of state.keys) {
      if (key.collected) continue;

      const floatY = Math.sin(time * 2 + key.id) * 5;
      const rotation = time * 2;
      const isNearby = state.nearbyKey?.id === key.id;

      ctx.save();
      ctx.translate(key.x + key.width / 2, key.y + key.height / 2 + floatY);
      ctx.rotate(rotation);

      if (isNearby) {
        ctx.shadowColor = COLORS.keyColor;
        ctx.shadowBlur = 20;
      }

      ctx.fillStyle = COLORS.keyColor;
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(0, -5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = COLORS.floorColor;
      ctx.beginPath();
      ctx.arc(0, -5, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = COLORS.keyColor;
      ctx.fillRect(-2, 0, 4, 12);
      ctx.strokeRect(-2, 0, 4, 12);
      
      ctx.fillRect(2, 6, 4, 2);
      ctx.fillRect(2, 10, 3, 2);

      ctx.restore();
      ctx.shadowBlur = 0;
    }
  }

  private drawDoor(state: GameState): void {
    const { ctx } = this;
    const { door } = state;

    const doorColor = door.unlocked ? COLORS.doorUnlocked : COLORS.doorLocked;
    const glowColor = door.unlocked ? COLORS.iceMint : COLORS.warningRed;

    ctx.shadowColor = glowColor;
    ctx.shadowBlur = door.unlocked ? 25 : 10;

    ctx.fillStyle = doorColor;
    ctx.fillRect(door.x, door.y, door.width, door.height);

    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(door.x, door.y, door.width, door.height);

    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px VT323';
    ctx.textAlign = 'center';
    ctx.fillText(door.unlocked ? '✓' : '🔒', door.x + door.width / 2, door.y + door.height / 2 + 7);

    if (door.unlocked && state.collectedKeys >= 3) {
      const playerDist = distance(
        state.player.x + state.player.width / 2,
        state.player.y + state.player.height / 2,
        door.x + door.width / 2,
        door.y + door.height / 2
      );
      if (playerDist < 80) {
        ctx.fillStyle = COLORS.iceMint;
        ctx.font = '14px VT323';
        ctx.fillText('按E开门', door.x + door.width / 2, door.y - 10);
      }
    }
  }

  private drawPlayerView(state: GameState): void {
    const { ctx } = this;
    const { player } = state;

    if (state.isHiding) return;

    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;

    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = COLORS.playerView;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      player.viewDistance,
      player.rotation - player.viewAngle / 2,
      player.rotation + player.viewAngle / 2
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawEnemyView(state: GameState): void {
    const { ctx } = this;
    const { enemy, isChasing } = state;

    const centerX = enemy.x + enemy.width / 2;
    const centerY = enemy.y + enemy.height / 2;

    const viewColor = isChasing ? COLORS.enemyViewChase : COLORS.enemyViewPatrol;

    ctx.save();
    ctx.globalAlpha = isChasing ? 0.4 : 0.25;
    ctx.fillStyle = viewColor;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      enemy.viewDistance,
      enemy.rotation - enemy.viewAngle / 2,
      enemy.rotation + enemy.viewAngle / 2
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawPlayer(state: GameState): void {
    const { ctx } = this;
    const { player, isHiding } = state;

    if (isHiding) return;

    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;

    ctx.save();
    ctx.shadowColor = COLORS.playerColor;
    ctx.shadowBlur = 10;

    ctx.fillStyle = COLORS.playerColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, player.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.darkBg;
    const eyeOffset = 6;
    const eyeX = centerX + Math.cos(player.rotation) * eyeOffset;
    const eyeY = centerY + Math.sin(player.rotation) * eyeOffset;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.shadowBlur = 0;
  }

  private drawEnemy(state: GameState): void {
    const { ctx } = this;
    const { enemy, isChasing } = state;

    const centerX = enemy.x + enemy.width / 2;
    const centerY = enemy.y + enemy.height / 2;

    ctx.save();

    if (isChasing) {
      ctx.shadowColor = COLORS.warningRed;
      ctx.shadowBlur = 20 + Math.sin(Date.now() / 100) * 10;
    } else {
      ctx.shadowColor = COLORS.enemyColor;
      ctx.shadowBlur = 10;
    }

    const bodyColor = isChasing ? COLORS.warningRed : COLORS.enemyColor;
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, enemy.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    const eyeOffset = 7;
    const eyeX = centerX + Math.cos(enemy.rotation) * eyeOffset;
    const eyeY = centerY + Math.sin(enemy.rotation) * eyeOffset;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(eyeX + Math.cos(enemy.rotation) * 1.5, eyeY + Math.sin(enemy.rotation) * 1.5, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isChasing ? COLORS.warningRed : '#ff8888';
    ctx.font = 'bold 12px VT323';
    ctx.textAlign = 'center';
    const statusText = isChasing ? '!! 发现 !!' : enemy.state === 'search' ? '?? 搜索 ??' : '';
    if (statusText) {
      ctx.fillText(statusText, centerX, centerY - enemy.height / 2 - 10);
    }
  }

  private drawParticles(particles: Particle[]): void {
    const { ctx } = this;

    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private drawNearbyIndicators(state: GameState): void {
    const { ctx } = this;

    if (state.nearbyKey && !state.nearbyKey.collected && !state.isHiding) {
      const keyCenterX = state.nearbyKey.x + state.nearbyKey.width / 2;
      const keyCenterY = state.nearbyKey.y + state.nearbyKey.height / 2;
      
      ctx.fillStyle = COLORS.keyColor;
      ctx.font = '14px VT323';
      ctx.textAlign = 'center';
      ctx.fillText('按E拾取', keyCenterX, keyCenterY - 35);
    }

    if (state.nearbyHidingSpot && !state.isHiding && !state.nearbyHidingSpot.occupied) {
      const spotCenterX = state.nearbyHidingSpot.x + state.nearbyHidingSpot.width / 2;
      const spotCenterY = state.nearbyHidingSpot.y + state.nearbyHidingSpot.height / 2;
      
      ctx.fillStyle = COLORS.iceMint;
      ctx.font = '14px VT323';
      ctx.textAlign = 'center';
      ctx.fillText('空格键躲藏', spotCenterX, spotCenterY - 40);
    }

    if (state.isHiding && state.currentHidingSpot) {
      const spotCenterX = state.currentHidingSpot.x + state.currentHidingSpot.width / 2;
      const spotCenterY = state.currentHidingSpot.y + state.currentHidingSpot.height / 2;
      
      ctx.fillStyle = COLORS.iceMint;
      ctx.font = '14px VT323';
      ctx.textAlign = 'center';
      ctx.fillText('空格键出来', spotCenterX, spotCenterY - 40);
    }
  }

  private drawFlashEffect(state: GameState): void {
    const { ctx } = this;
    
    if (state.flashEffect.alpha > 0) {
      ctx.fillStyle = state.flashEffect.color;
      ctx.globalAlpha = state.flashEffect.alpha;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.globalAlpha = 1;
    }
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
