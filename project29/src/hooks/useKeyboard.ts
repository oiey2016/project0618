import { useEffect } from 'react';
import type { PlayerId, Vector2 } from '../types/game';
import { useGameStore, selectPhase, selectActions } from '../store/useGameStore';

const P1_KEYS = {
  up: ['w', 'W'],
  down: ['s', 'S'],
  left: ['a', 'A'],
  right: ['d', 'D'],
};

const P2_KEYS = {
  up: ['ArrowUp'],
  down: ['ArrowDown'],
  left: ['ArrowLeft'],
  right: ['ArrowRight'],
};

export const useKeyboard = () => {
  const phase = useGameStore(selectPhase);
  const { setPlayerInput } = useGameStore(selectActions);

  useEffect(() => {
    const pressed = {
      P1: { up: false, down: false, left: false, right: false },
      P2: { up: false, down: false, left: false, right: false },
    };

    const buildDirection = (id: PlayerId): Vector2 => {
      const p = pressed[id];
      let x = 0;
      let y = 0;
      if (p.left) x -= 1;
      if (p.right) x += 1;
      if (p.up) y -= 1;
      if (p.down) y += 1;
      if (x !== 0 && y !== 0) {
        const inv = 1 / Math.SQRT2;
        x *= inv;
        y *= inv;
      }
      return { x, y };
    };

    const isInList = (key: string, list: string[]): boolean => list.includes(key);

    let rafPending = false;

    const scheduleUpdate = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        setPlayerInput('P1', buildDirection('P1'));
        setPlayerInput('P2', buildDirection('P2'));
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'playing') {
        if (
          isInList(e.key, [...Object.values(P1_KEYS)].flat()) ||
          isInList(e.key, [...Object.values(P2_KEYS)].flat())
        ) {
          e.preventDefault();
        }
        return;
      }

      let handled = false;

      if (isInList(e.key, P1_KEYS.up)) { pressed.P1.up = true; handled = true; }
      if (isInList(e.key, P1_KEYS.down)) { pressed.P1.down = true; handled = true; }
      if (isInList(e.key, P1_KEYS.left)) { pressed.P1.left = true; handled = true; }
      if (isInList(e.key, P1_KEYS.right)) { pressed.P1.right = true; handled = true; }

      if (isInList(e.key, P2_KEYS.up)) { pressed.P2.up = true; handled = true; }
      if (isInList(e.key, P2_KEYS.down)) { pressed.P2.down = true; handled = true; }
      if (isInList(e.key, P2_KEYS.left)) { pressed.P2.left = true; handled = true; }
      if (isInList(e.key, P2_KEYS.right)) { pressed.P2.right = true; handled = true; }

      if (handled) {
        e.preventDefault();
        scheduleUpdate();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let handled = false;

      if (isInList(e.key, P1_KEYS.up)) { pressed.P1.up = false; handled = true; }
      if (isInList(e.key, P1_KEYS.down)) { pressed.P1.down = false; handled = true; }
      if (isInList(e.key, P1_KEYS.left)) { pressed.P1.left = false; handled = true; }
      if (isInList(e.key, P1_KEYS.right)) { pressed.P1.right = false; handled = true; }

      if (isInList(e.key, P2_KEYS.up)) { pressed.P2.up = false; handled = true; }
      if (isInList(e.key, P2_KEYS.down)) { pressed.P2.down = false; handled = true; }
      if (isInList(e.key, P2_KEYS.left)) { pressed.P2.left = false; handled = true; }
      if (isInList(e.key, P2_KEYS.right)) { pressed.P2.right = false; handled = true; }

      if (handled) {
        e.preventDefault();
        scheduleUpdate();
      }
    };

    const handleBlur = () => {
      pressed.P1 = { up: false, down: false, left: false, right: false };
      pressed.P2 = { up: false, down: false, left: false, right: false };
      scheduleUpdate();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [phase, setPlayerInput]);
};
