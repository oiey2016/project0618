import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getLevelById } from '../utils/levelData';

interface GameCanvasProps {
  gravity: { x: number; y: number };
}

export const GameCanvas = ({ gravity }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ball, currentLevel, isPaused } = useGameStore();
  const level = getLevelById(currentLevel);
  const animationRef = useRef<number>(0);
  const glowIntensityRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !level) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      level.walls.forEach(wall => {
        const wallGradient = ctx.createLinearGradient(
          wall.x, wall.y,
          wall.x + wall.width, wall.y + wall.height
        );
        wallGradient.addColorStop(0, '#667eea');
        wallGradient.addColorStop(0.5, '#764ba2');
        wallGradient.addColorStop(1, '#667eea');
        
        ctx.fillStyle = wallGradient;
        ctx.shadowColor = '#667eea';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(wall.x, wall.y, wall.width, wall.height, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      level.holes.forEach(hole => {
        const holeGradient = ctx.createRadialGradient(
          hole.x, hole.y, 0,
          hole.x, hole.y, hole.radius
        );
        holeGradient.addColorStop(0, '#ff4757');
        holeGradient.addColorStop(0.5, '#c0392b');
        holeGradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = holeGradient;
        ctx.shadowColor = '#ff4757';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      const goal = level.goal;
      glowIntensityRef.current = (Math.sin(Date.now() / 500) + 1) / 2;
      const goalGlow = 20 + glowIntensityRef.current * 20;
      
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = goalGlow;
      const goalGradient = ctx.createRadialGradient(
        goal.x, goal.y, 0,
        goal.x, goal.y, goal.radius
      );
      goalGradient.addColorStop(0, '#ffffff');
      goalGradient.addColorStop(0.3, '#00ff88');
      goalGradient.addColorStop(0.7, '#00cc6a');
      goalGradient.addColorStop(1, '#00994d');
      
      ctx.fillStyle = goalGradient;
      ctx.beginPath();
      ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      const ballGradient = ctx.createRadialGradient(
        ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, 0,
        ball.x, ball.y, ball.radius
      );
      ballGradient.addColorStop(0, '#ffffff');
      ballGradient.addColorStop(0.4, '#ffd700');
      ballGradient.addColorStop(0.8, '#ffaa00');
      ballGradient.addColorStop(1, '#cc8800');
      
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏暂停', canvas.width / 2, canvas.height / 2);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [ball, level, gravity, isPaused]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={300}
      className="rounded-xl shadow-2xl border-2 border-primary/30"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    />
  );
};