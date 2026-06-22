import { useEffect, useCallback, useState, useRef } from 'react';
import { TRACK_KEYS } from '@/types/game';
import { audioSystem } from '@/utils/audio';

interface KeyboardHandlers {
  onTrackPress: (track: number) => void;
  onEscape?: () => void;
  onSpace?: () => void;
}

export function useKeyboardInput({ onTrackPress, onEscape, onSpace }: KeyboardHandlers) {
  const [pressedTracks, setPressedTracks] = useState<Set<number>>(new Set());

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) return;

      const key = e.key.toLowerCase();
      const trackIndex = TRACK_KEYS.indexOf(key as (typeof TRACK_KEYS)[number]);

      if (trackIndex !== -1) {
        setPressedTracks((prev) => {
          if (prev.has(trackIndex)) return prev;
          const next = new Set(prev);
          next.add(trackIndex);
          return next;
        });
        audioSystem.playClick();
        onTrackPress(trackIndex);
      }

      if (key === 'escape' && onEscape) {
        onEscape();
      }

      if (key === ' ' && onSpace) {
        e.preventDefault();
        onSpace();
      }
    },
    [onTrackPress, onEscape, onSpace]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const trackIndex = TRACK_KEYS.indexOf(key as (typeof TRACK_KEYS)[number]);

    if (trackIndex !== -1) {
      setPressedTracks((prev) => {
        if (!prev.has(trackIndex)) return prev;
        const next = new Set(prev);
        next.delete(trackIndex);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { pressedTracks };
}

interface TouchHandlers {
  onTrackPress: (track: number) => void;
}

export function useTouchInput({ onTrackPress }: TouchHandlers, trackCount: number = 4) {
  const activeTouches = useRef<Map<number, number>>(new Map());

  const getTrackFromX = useCallback(
    (clientX: number, rect: DOMRect): number => {
      const relativeX = (clientX - rect.left) / rect.width;
      const track = Math.floor(relativeX * trackCount);
      return Math.max(0, Math.min(trackCount - 1, track));
    },
    [trackCount]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      Array.from(e.changedTouches).forEach((touch) => {
        const track = getTrackFromX(touch.clientX, rect);
        activeTouches.current.set(touch.identifier, track);
        audioSystem.playClick();
        onTrackPress(track);
      });
    },
    [getTrackFromX, onTrackPress]
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    Array.from(e.changedTouches).forEach((touch) => {
      activeTouches.current.delete(touch.identifier);
    });
  }, []);

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}
