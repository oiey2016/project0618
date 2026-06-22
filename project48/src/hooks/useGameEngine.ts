import { useEffect, useRef, useCallback, useState } from 'react';
import type { Song, Note, JudgmentType, JudgmentResult, RenderNote, JudgmentPopup } from '@/types/game';
import { JUDGMENT_WINDOWS, JUDGMENT_SCORES, NOTE_FALL_DURATION } from '@/types/game';
import { useGameStore, buildGameResult } from '@/store/gameStore';
import { audioSystem } from '@/utils/audio';
import { useNavigate } from 'react-router-dom';

export function useGameEngine(song: Song) {
  const navigate = useNavigate();
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const notesRef = useRef<Map<number, Note>>(new Map());
  const judgedNotesRef = useRef<Set<number>>(new Set());
  const [renderNotes, setRenderNotes] = useState<RenderNote[]>([]);
  const [judgments, setJudgments] = useState<JudgmentPopup[]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);

  const {
    resetGame,
    setPlaying,
    setPaused,
    setCurrentTime,
    addScore,
    addCombo,
    resetCombo,
    recordJudgment,
    updateHealth,
    setResult,
  } = useGameStore();

  useEffect(() => {
    const map = new Map<number, Note>();
    song.notes.forEach((n) => map.set(n.id, { ...n }));
    notesRef.current = map;
    judgedNotesRef.current = new Set();
    resetGame();
    setGameEnded(false);
    setRenderNotes([]);
    setJudgments([]);
  }, [song, resetGame]);

  const performJudgment = useCallback(
    (note: Note, currentTime: number): JudgmentResult => {
      const diff = Math.abs(currentTime - note.time);
      let type: JudgmentType;

      if (diff <= JUDGMENT_WINDOWS.perfect) {
        type = 'perfect';
      } else if (diff <= JUDGMENT_WINDOWS.great) {
        type = 'great';
      } else if (diff <= JUDGMENT_WINDOWS.good) {
        type = 'good';
      } else {
        type = 'miss';
      }

      const baseScore = JUDGMENT_SCORES[type];

      if (type === 'miss') {
        resetCombo();
        updateHealth(-10);
      } else {
        addScore(baseScore);
        addCombo();
        updateHealth(type === 'perfect' ? 2 : type === 'great' ? 1 : 0);
      }

      recordJudgment(type, note.track);
      audioSystem.playJudgment(type);

      const popupId = Date.now() + note.id;
      setJudgments((prev) => [...prev, { id: popupId, type, track: note.track }]);
      setTimeout(() => {
        setJudgments((prev) => prev.filter((j) => j.id !== popupId));
      }, 600);

      setRenderNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, hitEffect: true } : n))
      );
      setTimeout(() => {
        setRenderNotes((prev) => prev.filter((n) => n.id !== note.id));
      }, 300);

      return {
        type,
        score: baseScore,
        time: currentTime,
        track: note.track,
        noteId: note.id,
      };
    },
    [addScore, addCombo, resetCombo, recordJudgment, updateHealth]
  );

  const handleHit = useCallback(
    (track: number) => {
      const currentTime = currentTimeRef.current;
      const notes = Array.from(notesRef.current.values()).filter(
        (n) => n.track === track && !judgedNotesRef.current.has(n.id)
      );

      if (notes.length === 0) return;

      notes.sort((a, b) => Math.abs(a.time - currentTime) - Math.abs(b.time - currentTime));
      const note = notes[0];
      const diff = Math.abs(currentTime - note.time);

      if (diff <= JUDGMENT_WINDOWS.good) {
        judgedNotesRef.current.add(note.id);
        performJudgment(note, currentTime);
      }
    },
    [performJudgment]
  );

  const gameLoop = useCallback(() => {
    const currentTime = audioSystem.getCurrentTime();
    currentTimeRef.current = currentTime;
    setCurrentTime(currentTime);
    setDisplayTime(currentTime);

    const visibleNotes: RenderNote[] = [];
    notesRef.current.forEach((note) => {
      if (judgedNotesRef.current.has(note.id)) return;

      const noteStart = note.time - NOTE_FALL_DURATION;
      const timeSinceStart = currentTime - noteStart;
      const progress = timeSinceStart / NOTE_FALL_DURATION;

      if (progress >= 0 && progress < 1.1) {
        visibleNotes.push({
          ...note,
          key: `note-${note.id}`,
          progress,
          visible: true,
        });
      }

      if (currentTime > note.time + JUDGMENT_WINDOWS.good && !judgedNotesRef.current.has(note.id)) {
        judgedNotesRef.current.add(note.id);
        performJudgment(note, note.time + JUDGMENT_WINDOWS.good + 1);
      }
    });

    setRenderNotes((prev) => {
      const map = new Map<string, RenderNote>();
      prev.forEach((n) => map.set(n.key, n));
      visibleNotes.forEach((n) => {
        const existing = map.get(n.key);
        if (existing?.hitEffect) {
          map.set(n.key, { ...n, hitEffect: true });
        } else {
          map.set(n.key, n);
        }
      });
      return Array.from(map.values()).filter((n) => {
        if (n.hitEffect) return true;
        if (n.progress < 0 || n.progress >= 1.1) return false;
        return true;
      });
    });

    if (currentTime >= song.duration) {
      setGameEnded(true);
      setPlaying(false);
      const state = useGameStore.getState();
      const result = buildGameResult(song, {
        score: state.score,
        maxCombo: state.maxCombo,
        perfect: state.perfect,
        great: state.great,
        good: state.good,
        miss: state.miss,
      });
      setResult(result);
      setTimeout(() => navigate('/result'), 1000);
      return;
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [song, setCurrentTime, setPlaying, setResult, navigate, performJudgment]);

  const startGame = useCallback(async () => {
    await audioSystem.init();
    audioSystem.playMelody(song.melody);
    startTimeRef.current = performance.now();
    setPlaying(true);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [song, setPlaying, gameLoop]);

  const restartGame = useCallback(async () => {
    cancelAnimationFrame(rafRef.current);

    const map = new Map<number, Note>();
    song.notes.forEach((n) => map.set(n.id, { ...n }));
    notesRef.current = map;
    judgedNotesRef.current = new Set();
    resetGame();
    setGameEnded(false);
    setRenderNotes([]);
    setJudgments([]);
    setDisplayTime(0);
    currentTimeRef.current = 0;

    await audioSystem.reset();
    audioSystem.playMelody(song.melody);
    startTimeRef.current = performance.now();
    setPlaying(true);
    setPaused(false);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [song, resetGame, setPlaying, setPaused, gameLoop]);

  const pauseGame = useCallback(() => {
    setPaused(true);
    cancelAnimationFrame(rafRef.current);
  }, [setPaused]);

  const stopGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    audioSystem.stopAll();
    setPlaying(false);
    setPaused(false);
  }, [setPlaying, setPaused]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioSystem.stopAll();
    };
  }, []);

  return {
    renderNotes,
    judgments,
    currentTime: displayTime,
    gameEnded,
    startGame,
    restartGame,
    pauseGame,
    stopGame,
    handleHit,
  };
}
