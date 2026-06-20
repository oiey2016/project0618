import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { handleCanvasClick, getHoveredInteractable, startGameEngine, stopGameEngine } from '@/game/engine';
import { CANVAS_WIDTH, CANVAS_HEIGHT, ITEMS } from '@/game/gameData';
import type { Interactable, Room } from '@/types/game';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const timeRef = useRef(0);

  const gameState = useGameStore((s) => s.gameState);
  const player = useGameStore((s) => s.player);
  const ghost = useGameStore((s) => s.ghost);
  const currentRoomId = useGameStore((s) => s.currentRoom);
  const rooms = useGameStore((s) => s.rooms);
  const selectedItemId = useGameStore((s) => s.selectedItemId);
  const transitionAlpha = useGameStore((s) => s.transitionAlpha);
  const isTransitioning = useGameStore((s) => s.isTransitioning);

  const currentRoom = rooms[currentRoomId];

  useEffect(() => {
    if (gameState === 'playing') {
      startGameEngine();
    } else {
      stopGameEngine();
    }
    return () => stopGameEngine();
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      timeRef.current += 0.016;
      drawScene(ctx);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentRoom, player, ghost, hoveredId, selectedItemId, transitionAlpha, gameState]);

  const drawScene = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!currentRoom) return;

    drawRoom(ctx, currentRoom);
    drawFloorPattern(ctx);
    drawExits(ctx, currentRoom);
    drawInteractables(ctx, currentRoom);
    drawPlayer(ctx);

    if (ghost.currentRoom === currentRoomId) {
      drawGhost(ctx);
    }

    drawWalls(ctx, currentRoom);
    drawVignette(ctx);
    drawGrain(ctx);

    if (isTransitioning) {
      ctx.fillStyle = `rgba(0, 0, 0, ${transitionAlpha})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    if (player.isHidden) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('躲藏中...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  };

  const drawRoom = (ctx: CanvasRenderingContext2D, room: Room) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, room.wallColor);
    gradient.addColorStop(0.4, room.background);
    gradient.addColorStop(1, room.floorColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, CANVAS_WIDTH - 8, CANVAS_HEIGHT - 8);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, CANVAS_WIDTH - 16, CANVAS_HEIGHT - 16);
  };

  const drawFloorPattern = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 100; y < CANVAS_HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawWalls = (ctx: CanvasRenderingContext2D, room: Room) => {
    ctx.fillStyle = room.wallColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, 60);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 55, CANVAS_WIDTH, 8);

    const woodGradient = ctx.createLinearGradient(0, 0, 0, 55);
    woodGradient.addColorStop(0, 'rgba(139, 90, 43, 0.6)');
    woodGradient.addColorStop(0.5, 'rgba(139, 90, 43, 0.3)');
    woodGradient.addColorStop(1, 'rgba(139, 90, 43, 0.6)');
    ctx.fillStyle = woodGradient;
    ctx.fillRect(0, 25, CANVAS_WIDTH, 5);
    ctx.fillRect(0, 45, CANVAS_WIDTH, 5);
  };

  const drawExits = (ctx: CanvasRenderingContext2D, room: Room) => {
    for (const exit of room.exits) {
      const door = room.interactables.find((i) => i.id === exit.doorId);
      if (!door) continue;

      const { x, y } = door.position;
      const { width, height } = door.size;

      ctx.fillStyle = door.locked ? '#4a3728' : '#6b4423';
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = '#2a1f15';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = door.locked ? '#8B7355' : '#DAA520';
      const knobX = exit.direction === 'east' || exit.direction === 'west'
        ? x + width / 2
        : x + width * 0.75;
      const knobY = exit.direction === 'north' || exit.direction === 'south'
        ? y + height / 2
        : y + height * 0.5;
      ctx.beginPath();
      ctx.arc(knobX, knobY, 4, 0, Math.PI * 2);
      ctx.fill();

      if (door.locked) {
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', x + width / 2, y - 5);
      }
    }
  };

  const drawInteractables = (ctx: CanvasRenderingContext2D, room: Room) => {
    const pulse = Math.sin(timeRef.current * 3) * 0.3 + 0.7;

    for (const item of room.interactables) {
      if (item.visible === false) continue;
      if (item.type === 'exit') continue;
      if (item.type === 'item' && item.collected) continue;

      const { x, y } = item.position;
      const { width, height } = item.size;
      const isHovered = hoveredId === item.id;

      drawShadow(ctx, x + width / 2, y + height, width * 0.8, height * 0.15);

      switch (item.type) {
        case 'item':
          drawPickupItem(ctx, item, pulse, isHovered);
          break;
        case 'furniture':
          drawFurniture(ctx, item, isHovered);
          break;
        case 'puzzle':
          drawPuzzleObject(ctx, item, pulse, isHovered);
          break;
        case 'hidingSpot':
          if (isHovered) {
            ctx.strokeStyle = `rgba(100, 200, 255, ${pulse})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(x - 3, y - 3, width + 6, height + 6);
            ctx.setLineDash([]);
          }
          break;
      }

      if (isHovered && item.type !== 'hidingSpot') {
        ctx.strokeStyle = `rgba(255, 230, 150, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 4, y - 4, width + 8, height + 8);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x - 10, y - 30, width + 20, 24);
        ctx.fillStyle = '#FFE699';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name, x + width / 2, y - 12);
      }
    }
  };

  const drawShadow = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.save();
    ctx.globalAlpha = 0.3;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, w / 2);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawPickupItem = (ctx: CanvasRenderingContext2D, item: Interactable, pulse: number, isHovered: boolean) => {
    const { x, y } = item.position;
    const { width, height } = item.size;
    const itemData = item.givesItem ? ITEMS[item.givesItem] : null;
    const color = itemData?.color || '#FFD700';

    const floatY = Math.sin(timeRef.current * 2 + x) * 3;

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2 + floatY);

    if (isHovered) {
      ctx.scale(1.15, 1.15);
    }

    ctx.shadowColor = color;
    ctx.shadowBlur = isHovered ? 20 * pulse : 10 * pulse;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) / 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(-3, -3, Math.min(width, height) / 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawFurniture = (ctx: CanvasRenderingContext2D, item: Interactable, isHovered: boolean) => {
    const { x, y } = item.position;
    const { width, height } = item.size;

    ctx.save();

    if (item.name.includes('照片') || item.name.includes('油画')) {
      ctx.fillStyle = '#5c4033';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#f5f0e6';
      ctx.fillRect(x + 5, y + 5, width - 10, height - 10);

      if (item.name.includes('照片')) {
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(x + 15, y + 15, width - 30, height - 40);
        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2 - 5, 12, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.name.includes('油画')) {
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, '#DC143C');
        gradient.addColorStop(0.5, '#8B0000');
        gradient.addColorStop(1, '#4169E1');
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 8, y + 8, width - 16, height - 16);

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + width * 0.35, y + height * 0.35, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.arc(x + width * 0.65, y + height * 0.55, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (item.name.includes('沙发')) {
      ctx.fillStyle = '#5c3d2e';
      ctx.fillRect(x, y + height * 0.3, width, height * 0.7);
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(x, y, width * 0.3, height * 0.4);
      ctx.fillRect(x + width * 0.7, y, width * 0.3, height * 0.4);
      ctx.fillStyle = '#7a5230';
      ctx.fillRect(x + 5, y + height * 0.35, width - 10, height * 0.25);
    } else if (item.name.includes('柜子') || item.name.includes('书架')) {
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#4a3015';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      const shelves = item.name.includes('书架') ? 4 : 3;
      for (let i = 1; i < shelves; i++) {
        ctx.fillStyle = '#4a3015';
        ctx.fillRect(x + 3, y + (height / shelves) * i, width - 6, 3);
      }

      if (item.name.includes('书架')) {
        const bookColors = ['#8B0000', '#006400', '#00008B', '#8B8B00', '#4B0082'];
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 6; j++) {
            ctx.fillStyle = bookColors[(i + j) % bookColors.length];
            ctx.fillRect(x + 8 + j * 10, y + 8 + i * (height / 4), 8, height / 4 - 12);
          }
        }
      }
    } else if (item.name.includes('书桌') || item.name.includes('餐桌')) {
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(x, y, width, height * 0.3);
      ctx.fillStyle = '#6b5a45';
      ctx.fillRect(x + 5, y + height * 0.3, 8, height * 0.7);
      ctx.fillRect(x + width - 13, y + height * 0.3, 8, height * 0.7);
    } else if (item.name.includes('抽屉')) {
      ctx.fillStyle = '#7a5230';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#4a3015';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = '#DAA520';
      ctx.fillRect(x + width / 2 - 12, y + height / 2 - 3, 24, 6);
      
      ctx.fillStyle = '#333';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🔒', x + width / 2, y - 3);
    } else if (item.name.includes('冰箱')) {
      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = '#ccc';
      ctx.fillRect(x, y + height * 0.35, width, 3);
      ctx.fillStyle = '#999';
      ctx.fillRect(x + width - 10, y + height * 0.15, 4, 15);
      ctx.fillRect(x + width - 10, y + height * 0.6, 4, 15);
    } else if (item.name.includes('宝箱')) {
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(x, y + height * 0.3, width, height * 0.7);
      ctx.fillStyle = '#A0826D';
      ctx.beginPath();
      ctx.moveTo(x, y + height * 0.3);
      ctx.quadraticCurveTo(x + width / 2, y - height * 0.1, x + width, y + height * 0.3);
      ctx.fill();
      ctx.fillStyle = '#DAA520';
      ctx.fillRect(x + width / 2 - 8, y + height * 0.35, 16, 12);
    } else if (item.name.includes('镜子')) {
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(x, y, width, height);
      const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
      gradient.addColorStop(0, '#b8d4e3');
      gradient.addColorStop(0.5, '#d4e6ed');
      gradient.addColorStop(1, '#a0c4d4');
      ctx.fillStyle = gradient;
      ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    } else if (item.name.includes('祭坛')) {
      ctx.fillStyle = '#4a3d5c';
      ctx.fillRect(x, y + height * 0.5, width, height * 0.5);
      ctx.fillStyle = '#5c4d7a';
      ctx.fillRect(x + 10, y, width - 20, height * 0.55);
      
      ctx.fillStyle = '#2a1f3d';
      ctx.beginPath();
      ctx.arc(x + width * 0.35, y + height * 0.3, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + width * 0.65, y + height * 0.3, 8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = '#5a4a35';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    }

    if (isHovered) {
      ctx.strokeStyle = 'rgba(255, 230, 150, 0.8)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 3, y - 3, width + 6, height + 6);
    }

    ctx.restore();
  };

  const drawPuzzleObject = (ctx: CanvasRenderingContext2D, item: Interactable, pulse: number, isHovered: boolean) => {
    const { x, y } = item.position;
    const { width, height } = item.size;
    const solved = item.solved;

    drawFurniture(ctx, item, isHovered);

    if (!solved) {
      ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.3})`;
      ctx.fillRect(x - 5, y - 5, width + 10, height + 10);
      
      ctx.fillStyle = '#FFD700';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('❓', x + width / 2, y - 8);
    } else {
      ctx.fillStyle = '#90EE90';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓', x + width / 2, y - 8);
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    const { x, y } = player.position;
    const { facing, isHidden } = player;

    if (isHidden) return;

    ctx.save();
    ctx.translate(x, y);

    const shadowGradient = ctx.createRadialGradient(0, 12, 0, 0, 12, 15);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.ellipse(0, 12, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
    glowGradient.addColorStop(0, 'rgba(255, 220, 150, 0.4)');
    glowGradient.addColorStop(1, 'rgba(255, 220, 150, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fill();

    if (facing === 'left') {
      ctx.scale(-1, 1);
    }

    ctx.fillStyle = '#f0e0c0';
    ctx.beginPath();
    ctx.arc(0, -8, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4a3728';
    ctx.fillRect(-7, -2, 14, 14);

    ctx.fillStyle = '#3a2718';
    ctx.fillRect(-6, 11, 4, 6);
    ctx.fillRect(2, 11, 4, 6);

    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(2, -9, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawGhost = (ctx: CanvasRenderingContext2D) => {
    const { x, y } = ghost.position;
    const { state: ghostState, alertLevel, floatOffset } = ghost;
    const drawY = y + floatOffset;

    ctx.save();
    ctx.translate(x, drawY);

    const baseRadius = 20;
    const ghostHeight = 40;

    const detectionGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, ghost.detectionRadius);
    const alpha = alertLevel * 0.15 + 0.05;
    detectionGradient.addColorStop(0, `rgba(100, 150, 255, ${alpha})`);
    detectionGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
    ctx.fillStyle = detectionGradient;
    ctx.beginPath();
    ctx.arc(0, 0, ghost.detectionRadius, 0, Math.PI * 2);
    ctx.fill();

    const ghostColor = ghostState === 'chase'
      ? 'rgba(200, 50, 50, 0.6)'
      : ghostState === 'search'
      ? 'rgba(180, 120, 50, 0.6)'
      : 'rgba(180, 180, 220, 0.5)';

    ctx.fillStyle = ghostColor;
    ctx.shadowColor = ghostState === 'chase' ? '#ff4444' : '#8899ff';
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.moveTo(-baseRadius, 0);
    ctx.quadraticCurveTo(-baseRadius, -ghostHeight, 0, -ghostHeight + 5);
    ctx.quadraticCurveTo(baseRadius, -ghostHeight, baseRadius, 0);
    
    const waves = 4;
    for (let i = 0; i < waves; i++) {
      const waveX = baseRadius - (i * (baseRadius * 2) / waves);
      const waveY = Math.sin(timeRef.current * 3 + i) * 4;
      if (i === 0) {
        ctx.lineTo(waveX, waveY);
      } else {
        ctx.lineTo(waveX - baseRadius / waves / 2, waveY + 5);
        ctx.lineTo(waveX, waveY);
      }
    }
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = ghostState === 'chase' ? '#1a0000' : '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(-6, -ghostHeight / 2, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, -ghostHeight / 2, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-7, -ghostHeight / 2 - 1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5, -ghostHeight / 2 - 1, 2, 0, Math.PI * 2);
    ctx.fill();

    if (ghostState === 'chase') {
      ctx.fillStyle = '#1a0000';
      ctx.beginPath();
      ctx.ellipse(0, -ghostHeight / 2 + 10, 5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawVignette = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 100,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.7
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const drawGrain = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = 0.04;
    
    const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 50;
      data[i] += grain;
      data[i + 1] += grain;
      data[i + 2] += grain;
    }
    
    ctx.putImageData(imageData, 0, 0);
    ctx.restore();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    setMousePos({ x, y });
    
    const hovered = getHoveredInteractable(x, y);
    setHoveredId(hovered?.id || null);
    
    if (hovered) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = selectedItemId ? 'copy' : 'default';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    handleCanvasClick(x, y);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full max-w-4xl rounded-lg shadow-2xl"
        style={{
          imageRendering: 'auto',
          maxHeight: '70vh',
          objectFit: 'contain',
        }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
          background: 'transparent',
        }}
      />
    </div>
  );
}
