import type { GameEngine } from './GameEngine';
import type { Player, Weapon } from './types';
import { GAME_CONFIG, PLATFORMS } from './constants';

export class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private game: GameEngine;

  constructor(canvas: HTMLCanvasElement, game: GameEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.game = game;
  }

  render(): void {
    const ctx = this.ctx;
    const { width, height } = GAME_CONFIG;

    ctx.save();

    if (this.game.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.game.screenShake;
      const shakeY = (Math.random() - 0.5) * this.game.screenShake;
      ctx.translate(shakeX, shakeY);
    }

    this.drawBackground();
    this.drawPlatforms();
    this.drawWeapons();
    this.drawPlayers();

    if (this.game.state === 'countdown') {
      this.drawCountdown();
    }

    ctx.restore();
  }

  private drawBackground(): void {
    const ctx = this.ctx;
    const { width, height } = GAME_CONFIG;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0F0A1F');
    gradient.addColorStop(0.5, '#1A1030');
    gradient.addColorStop(1, '#251540');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(100, 50, 150, 0.15)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5) % width;
      const sy = (i * 73.3) % (height * 0.6);
      const size = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawPlatforms(): void {
    const ctx = this.ctx;

    for (const platform of PLATFORMS) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(platform.x + 4, platform.y + 4, platform.width, platform.height);

      const gradient = ctx.createLinearGradient(
        platform.x,
        platform.y,
        platform.x,
        platform.y + platform.height
      );
      gradient.addColorStop(0, '#3D2A5C');
      gradient.addColorStop(0.3, '#2D1A4C');
      gradient.addColorStop(1, '#1D0A3C');
      ctx.fillStyle = gradient;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

      ctx.fillStyle = 'rgba(150, 100, 200, 0.5)';
      ctx.fillRect(platform.x, platform.y, platform.width, 3);

      ctx.strokeStyle = 'rgba(100, 50, 200, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }
  }

  private drawPlayers(): void {
    for (const player of this.game.players) {
      if (!player.isAlive) continue;
      this.drawPlayer(player);
    }
  }

  private drawPlayer(player: Player): void {
    const ctx = this.ctx;
    const x = player.x + player.width / 2;
    const y = player.y;

    ctx.save();
    ctx.translate(x, y);
    if (player.facing === -1) {
      ctx.scale(-1, 1);
    }

    const color = player.colorHex;
    const flashIntensity = player.hitFlash > 0 ? player.hitFlash / 100 : 0;

    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (flashIntensity > 0) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 30;
    }

    const headRadius = 10;
    const headY = headRadius + 5;
    const bodyTop = headY + headRadius;
    const bodyBottom = 40;
    const legTop = bodyBottom;
    const legBottom = 60;

    ctx.beginPath();
    ctx.arc(0, headY, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, bodyTop);
    ctx.lineTo(0, bodyBottom);
    ctx.stroke();

    const walkOffset = Math.sin(player.animFrame) * 5;
    const armOffset = player.isAttacking ? 15 : walkOffset * 0.5;

    ctx.beginPath();
    ctx.moveTo(0, bodyTop + 8);
    ctx.lineTo(-12, bodyTop + 20 + armOffset);
    ctx.stroke();

    if (player.isAttacking) {
      ctx.beginPath();
      ctx.moveTo(0, bodyTop + 8);
      ctx.lineTo(20, bodyTop + 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(22, bodyTop + 10, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, bodyTop + 8);
      ctx.lineTo(12, bodyTop + 20 - armOffset);
      ctx.stroke();
    }

    const legOffset = Math.sin(player.animFrame) * 8;

    ctx.beginPath();
    ctx.moveTo(0, legTop);
    ctx.lineTo(-8 + legOffset, legBottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, legTop);
    ctx.lineTo(8 - legOffset, legBottom);
    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.fillStyle = color;
    ctx.font = 'bold 12px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`P${player.id}`, 0, -5);

    ctx.restore();
  }

  private drawWeapons(): void {
    for (const weapon of this.game.weapons) {
      if (weapon.isPicked && weapon.ownerId !== null) {
        continue;
      }
      this.drawWeapon(weapon);
    }

    for (const player of this.game.players) {
      if (player.weapon && player.weapon.isPicked) {
        this.drawHeldWeapon(player);
      }
    }
  }

  private drawWeapon(weapon: Weapon): void {
    const ctx = this.ctx;
    const floatY = Math.sin(weapon.floatOffset) * 5;

    ctx.save();
    ctx.translate(
      weapon.x + weapon.width / 2,
      weapon.y + weapon.height / 2 + floatY
    );

    if (weapon.isThrown) {
      ctx.rotate(weapon.rotation);
    }

    ctx.shadowColor = '#FF6B35';
    ctx.shadowBlur = 10;

    switch (weapon.type) {
      case 'stick':
        ctx.fillStyle = '#8B4513';
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-weapon.width / 2, -weapon.height / 2, weapon.width, weapon.height, 3);
        ctx.fill();
        ctx.stroke();
        break;

      case 'box':
        const boxGrad = ctx.createLinearGradient(
          -weapon.width / 2,
          -weapon.height / 2,
          weapon.width / 2,
          weapon.height / 2
        );
        boxGrad.addColorStop(0, '#FFD700');
        boxGrad.addColorStop(1, '#FFA500');
        ctx.fillStyle = boxGrad;
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 2;
        ctx.fillRect(-weapon.width / 2, -weapon.height / 2, weapon.width, weapon.height);
        ctx.strokeRect(-weapon.width / 2, -weapon.height / 2, weapon.width, weapon.height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -weapon.height / 2);
        ctx.lineTo(0, weapon.height / 2);
        ctx.moveTo(-weapon.width / 2, 0);
        ctx.lineTo(weapon.width / 2, 0);
        ctx.stroke();
        break;

      case 'bomb':
        const bombGrad = ctx.createRadialGradient(
          -3,
          -3,
          2,
          0,
          0,
          weapon.width / 2
        );
        bombGrad.addColorStop(0, '#4A4A4A');
        bombGrad.addColorStop(1, '#1A1A1A');
        ctx.fillStyle = bombGrad;
        ctx.beginPath();
        ctx.arc(0, 3, weapon.width / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -weapon.height / 2 + 5);
        ctx.quadraticCurveTo(5, -weapon.height / 2 - 2, 8, -weapon.height / 2 - 5);
        ctx.stroke();

        ctx.fillStyle = '#FF4500';
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(8, -weapon.height / 2 - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  private drawHeldWeapon(player: Player): void {
    if (!player.weapon) return;
    const ctx = this.ctx;
    const weapon = player.weapon;

    ctx.save();
    const wx = player.x + player.width / 2 + player.facing * 18;
    const wy = player.y + 28;
    ctx.translate(wx, wy);

    if (player.facing === -1) {
      ctx.scale(-1, 1);
    }

    ctx.shadowColor = '#FF6B35';
    ctx.shadowBlur = 8;

    switch (weapon.type) {
      case 'stick':
        ctx.rotate(-0.3);
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.roundRect(0, -3, weapon.width, weapon.height, 2);
        ctx.fill();
        break;

      case 'box':
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-weapon.width / 2, -weapon.height / 2, weapon.width, weapon.height);
        break;

      case 'bomb':
        ctx.fillStyle = '#2A2A2A';
        ctx.beginPath();
        ctx.arc(0, 0, weapon.width / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  private drawCountdown(): void {
    const ctx = this.ctx;
    const { width, height } = GAME_CONFIG;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);

    const number = this.game.countdown > 0 ? this.game.countdown.toString() : 'FIGHT!';
    const fontSize = this.game.countdown > 0 ? 120 : 80;

    ctx.save();
    ctx.shadowColor = '#FF2E93';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#FF2E93';
    ctx.font = `bold ${fontSize}px Orbitron, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, width / 2, height / 2);
    ctx.restore();
  }
}
