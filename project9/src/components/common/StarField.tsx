import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftX: number;
  driftY: number;
  layer: 0 | 1 | 2;
}

const LAYER_CONFIG = [
  { count: 80, sizeRange: [0.4, 1], speedRange: [0.5, 1.2], driftRange: [0.05, 0.12], color: 'rgba(200, 210, 255,' },
  { count: 70, sizeRange: [0.8, 1.6], speedRange: [0.8, 1.8], driftRange: [0.1, 0.2], color: 'rgba(230, 235, 255,' },
  { count: 50, sizeRange: [1.2, 2.4], speedRange: [1.2, 2.5], driftRange: [0.15, 0.3], color: 'rgba(255, 245, 220,' },
];

export const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const stars: Star[] = [];
    LAYER_CONFIG.forEach((cfg, layerIdx) => {
      for (let i = 0; i < cfg.count; i++) {
        const size = cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]);
        stars.push({
          x: Math.random() * w(),
          y: Math.random() * h(),
          size,
          baseOpacity: 0.35 + Math.random() * 0.55,
          twinkleSpeed: cfg.speedRange[0] + Math.random() * (cfg.speedRange[1] - cfg.speedRange[0]),
          twinklePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 2 * (cfg.driftRange[0] + Math.random() * (cfg.driftRange[1] - cfg.driftRange[0])),
          driftY: (Math.random() - 0.5) * 2 * (cfg.driftRange[0] + Math.random() * (cfg.driftRange[1] - cfg.driftRange[0])),
          layer: layerIdx as 0 | 1 | 2,
        });
      }
    });
    starsRef.current = stars;

    const render = (t: number) => {
      const dt = (t - timeRef.current) / 1000 || 0;
      timeRef.current = t;

      ctx.clearRect(0, 0, w(), h());

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.driftX * dt * 8;
        s.y += s.driftY * dt * 8;

        if (s.x < -10) s.x = w() + 10;
        if (s.x > w() + 10) s.x = -10;
        if (s.y < -10) s.y = h() + 10;
        if (s.y > h() + 10) s.y = -10;

        const cfg = LAYER_CONFIG[s.layer];
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.twinkleSpeed + s.twinklePhase);
        const opacity = s.baseOpacity * (0.5 + 0.5 * twinkle);

        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        gradient.addColorStop(0, `${cfg.color}${opacity})`);
        gradient.addColorStop(0.4, `${cfg.color}${opacity * 0.4})`);
        gradient.addColorStop(1, `${cfg.color}0)`);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${cfg.color}${Math.min(1, opacity + 0.2)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default StarField;
