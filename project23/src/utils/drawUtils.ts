export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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

export function drawGradientRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color1: string,
  color2: string
) {
  const gradient = ctx.createLinearGradient(x, y, x, y + h);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  roundRect(ctx, x, y, w, h, 4);
  ctx.fill();
}

export function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
  ctx.arc(x + size * 0.35, y + size * 0.1, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

export function drawMountain(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const gradient = ctx.createLinearGradient(x, y - h, x, y);
  gradient.addColorStop(0, '#7B8794');
  gradient.addColorStop(1, '#5A6370');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w * 0.5, y - h);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
}

export function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 2) + (i * 2 * Math.PI / 5);
    const innerAngle = outerAngle + Math.PI / 5;
    const outerX = x + Math.cos(-outerAngle) * r;
    const outerY = y + Math.sin(-outerAngle) * r;
    const innerX = x + Math.cos(-innerAngle) * r * 0.4;
    const innerY = y + Math.sin(-innerAngle) * r * 0.4;
    if (i === 0) {
      ctx.moveTo(outerX, outerY);
    } else {
      ctx.lineTo(outerX, outerY);
    }
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fill();
}
