import { useEffect, useRef } from 'react';
import { CONTROLS } from '../game/constants';
import type { Team } from '../game/types';

interface InputState {
  blue: { x: number; y: number; action: boolean };
  red: { x: number; y: number; action: boolean };
}

interface Options {
  onMove: (team: Team, dir: { x: number; y: number }) => void;
  onActionDown: (team: Team) => void;
  onActionUp: (team: Team) => void;
  phase: string;
}

export function useGameInput({ onMove, onActionDown, onActionUp, phase }: Options) {
  const keys = useRef<Set<string>>(new Set());
  const actionWasDown = useRef<{ blue: boolean; red: boolean }>({ blue: false, red: false });
  const stateRef = useRef<InputState>({
    blue: { x: 0, y: 0, action: false },
    red: { x: 0, y: 0, action: false },
  });

  useEffect(() => {
    if (phase !== 'playing') {
      keys.current.clear();
      stateRef.current = {
        blue: { x: 0, y: 0, action: false },
        red: { x: 0, y: 0, action: false },
      };
      actionWasDown.current = { blue: false, red: false };
      return;
    }

    const updateDir = (team: Team) => {
      const cfg = CONTROLS[team];
      let x = 0;
      let y = 0;
      for (const k of cfg.left) if (keys.current.has(k)) x -= 1;
      for (const k of cfg.right) if (keys.current.has(k)) x += 1;
      for (const k of cfg.up) if (keys.current.has(k)) y -= 1;
      for (const k of cfg.down) if (keys.current.has(k)) y += 1;
      const mag = Math.hypot(x, y);
      if (mag > 1.4) {
        x /= mag;
        y /= mag;
      }
      stateRef.current[team].x = x;
      stateRef.current[team].y = y;
      onMove(team, { x, y });
    };

    const handleDown = (e: KeyboardEvent) => {
      const allKeys: readonly string[] = [
        ...CONTROLS.blue.up,
        ...CONTROLS.blue.down,
        ...CONTROLS.blue.left,
        ...CONTROLS.blue.right,
        ...CONTROLS.blue.action,
        ...CONTROLS.red.up,
        ...CONTROLS.red.down,
        ...CONTROLS.red.left,
        ...CONTROLS.red.right,
        ...CONTROLS.red.action,
      ];
      if (allKeys.indexOf(e.code) >= 0) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.repeat) return;
      keys.current.add(e.code);

      for (const team of ['blue', 'red'] as Team[]) {
        const cfg = CONTROLS[team];
        updateDir(team);
        if ((cfg.action as readonly string[]).indexOf(e.code) >= 0) {
          if (!actionWasDown.current[team]) {
            actionWasDown.current[team] = true;
            onActionDown(team);
          }
        }
      }
    };

    const handleUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code);

      for (const team of ['blue', 'red'] as Team[]) {
        const cfg = CONTROLS[team];
        updateDir(team);
        if ((cfg.action as readonly string[]).indexOf(e.code) >= 0) {
          if (actionWasDown.current[team]) {
            actionWasDown.current[team] = false;
            onActionUp(team);
          }
        }
      }
    };

    const handleBlur = () => {
      keys.current.clear();
      for (const team of ['blue', 'red'] as Team[]) {
        onMove(team, { x: 0, y: 0 });
        if (actionWasDown.current[team]) {
          actionWasDown.current[team] = false;
          onActionUp(team);
        }
      }
    };

    window.addEventListener('keydown', handleDown, { capture: true });
    window.addEventListener('keyup', handleUp, { capture: true });
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleDown, { capture: true });
      window.removeEventListener('keyup', handleUp, { capture: true });
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase, onMove, onActionDown, onActionUp]);
}
