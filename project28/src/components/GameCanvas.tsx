import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useGameInput } from '../hooks/useGameInput';
import { renderGame } from '../game/renderer';
import { unlockAudio } from '../game/audio';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(0);

  const phase = useGameStore((s) => s.phase);
  const tick = useGameStore((s) => s.actions.tick);
  const playerMove = useGameStore((s) => s.actions.playerMove);
  const playerStartCharge = useGameStore((s) => s.actions.playerStartCharge);
  const playerReleaseCharge = useGameStore((s) => s.actions.playerReleaseCharge);

  const stateRef = useRef(useGameStore.getState());
  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      stateRef.current = s;
    });
    return unsub;
  }, []);

  useGameInput({
    onMove: playerMove,
    onActionDown: playerStartCharge,
    onActionUp: playerReleaseCharge,
    phase,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (ts: number) => {
      const last = lastRef.current || ts;
      const dt = Math.min(ts - last, 50);
      lastRef.current = ts;

      tick(dt);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const s = stateRef.current;
      renderGame(
        ctx,
        canvas.width / dpr,
        canvas.height / dpr,
        {
          players: s.players,
          balls: s.balls,
          particles: s.particles,
          shockWaves: s.shockWaves,
          floatingTexts: s.floatingTexts,
          screenShake: s.screenShake,
          flashOverlay: s.flashOverlay,
          phase: s.phase,
          countdown: s.countdown,
          countdownFloat: s.countdownFloat,
        },
      );

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const clickUnlock = () => {
      unlockAudio();
    };
    canvas.addEventListener('pointerdown', clickUnlock);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', clickUnlock);
    };
  }, [tick]);

  return (
    <div ref={wrapRef} className="relative w-full h-full scanlines rounded-3xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full rounded-3xl"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}
