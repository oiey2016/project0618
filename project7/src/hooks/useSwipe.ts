import { useCallback, useRef, useState } from "react";

export type SwipeDirection = "left" | "right" | null;

interface UseSwipeOptions {
  threshold?: number;
  onSwipe?: (dir: SwipeDirection) => void;
  maxRotation?: number;
}

interface UseSwipeResult {
  offsetX: number;
  offsetY: number;
  rotation: number;
  isDragging: boolean;
  directionHint: SwipeDirection;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
  };
}

export function useSwipe({
  threshold = 110,
  onSwipe,
  maxRotation = 18,
}: UseSwipeOptions = {}): UseSwipeResult {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const settled = useRef(false);

  const directionHint: SwipeDirection =
    Math.abs(offsetX) > 40 ? (offsetX < 0 ? "left" : "right") : null;

  const onMove = useCallback(
    (e: PointerEvent) => {
      if (!start.current || settled.current) return;
      if (e.pointerId !== start.current.id) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      const damp = Math.min(1, threshold / (Math.abs(dx) + 1));
      const visualDx = dx > 0 ? dx * (0.6 + damp * 0.4) : dx * (0.6 + damp * 0.4);
      const rot = Math.max(-maxRotation, Math.min(maxRotation, dx / 18));
      setOffsetX(visualDx);
      setOffsetY(dy * 0.35);
      setRotation(rot);
    },
    [threshold, maxRotation],
  );

  const onUp = useCallback(
    (e: PointerEvent) => {
      if (!start.current || settled.current) return;
      if (e.pointerId !== start.current.id) return;
      settled.current = true;
      const dx = e.clientX - start.current.x;
      let dir: SwipeDirection = null;
      if (Math.abs(dx) >= threshold) {
        dir = dx < 0 ? "left" : "right";
      }
      if (dir) {
        const snapX = dir === "left" ? -window.innerWidth * 0.9 : window.innerWidth * 0.9;
        setOffsetX(snapX);
        setRotation(dir === "left" ? -maxRotation : maxRotation);
        onSwipe?.(dir);
      } else {
        setOffsetX(0);
        setOffsetY(0);
        setRotation(0);
      }
      setIsDragging(false);
      start.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.setTimeout(() => {
        settled.current = false;
        if (!dir) {
          setOffsetX(0);
          setOffsetY(0);
          setRotation(0);
        }
      }, 320);
    },
    [threshold, maxRotation, onMove, onSwipe],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (settled.current) return;
      start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      setIsDragging(true);
      setOffsetX(0);
      setOffsetY(0);
      setRotation(0);
      (e.target as Element).setPointerCapture?.(e.pointerId);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [onMove, onUp],
  );

  return {
    offsetX,
    offsetY,
    rotation,
    isDragging,
    directionHint,
    handlers: { onPointerDown },
  };
}
