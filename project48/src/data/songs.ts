import type { Song, Note, NoteDirection, MelodyNote } from '@/types/game';

const DIRECTIONS: NoteDirection[] = ['up', 'down', 'left', 'right'];

function noteFreq(semitoneFromC4: number): number {
  const A4 = 440;
  const C4 = A4 * Math.pow(2, -9 / 12);
  return C4 * Math.pow(2, semitoneFromC4 / 12);
}

function generateNotesForPattern(
  pattern: Array<{ time: number; track?: number; direction?: NoteDirection }>,
  bpm: number,
  duration: number
): { notes: Note[]; melody: MelodyNote[] } {
  const beatInterval = 60000 / bpm;
  const notes: Note[] = [];
  const melody: MelodyNote[] = [];
  let noteId = 0;

  const melodyPattern = [0, 2, 4, 5, 4, 2, 0, -2, 0, 2, 4, 5, 7, 5, 4, 2];

  pattern.forEach((p, idx) => {
    const time = p.time * beatInterval;
    const track = p.track ?? (idx % 4);
    const direction = p.direction ?? DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

    notes.push({
      id: noteId++,
      track,
      time,
      type: 'tap',
      direction,
    });

    const semitone = melodyPattern[idx % melodyPattern.length];
    melody.push({
      time,
      duration: beatInterval * 0.8,
      frequency: noteFreq(semitone),
    });
  });

  const intro: MelodyNote[] = [];
  for (let i = -8; i < 0; i++) {
    intro.push({
      time: i * beatInterval + beatInterval * 0.5,
      duration: beatInterval * 0.3,
      frequency: noteFreq(0),
    });
  }

  return { notes, melody: [...intro, ...melody] };
}

function generateTwinkle(): Song {
  const bpm = 100;
  const beatInterval = 60000 / bpm;

  const melodyNotes = [0, 0, 7, 7, 9, 9, 7, -1, 5, 5, 4, 4, 2, 2, 0, -1,
                       7, 7, 5, 5, 4, 4, 2, -1, 7, 7, 5, 5, 4, 4, 2, -1,
                       0, 0, 7, 7, 9, 9, 7, -1, 5, 5, 4, 4, 2, 2, 0];

  const notes: Note[] = [];
  const melody: MelodyNote[] = [];
  let noteId = 0;

  melodyNotes.forEach((semitone, idx) => {
    const time = idx * beatInterval;
    if (semitone === -1) {
      melody.push({ time, duration: beatInterval, frequency: 0 });
      return;
    }

    const track = [0, 1, 2, 3, 2, 1, 0, 3][idx % 8];
    const direction = DIRECTIONS[idx % DIRECTIONS.length];

    notes.push({
      id: noteId++,
      track,
      time: time + beatInterval * 2,
      type: 'tap',
      direction,
    });

    melody.push({
      time: time + beatInterval * 2,
      duration: beatInterval * 0.9,
      frequency: noteFreq(semitone),
    });
  });

  const intro: MelodyNote[] = [];
  for (let i = 0; i < 8; i++) {
    intro.push({
      time: i * beatInterval,
      duration: beatInterval * 0.5,
      frequency: noteFreq(0),
    });
  }

  return {
    id: 'twinkle',
    title: '小星星',
    subtitle: 'Twinkle Twinkle',
    artist: '经典童谣',
    difficulty: 1,
    duration: (melodyNotes.length + 4) * beatInterval,
    bpm,
    notes,
    melody: [...intro, ...melody],
  };
}

function generateOde(): Song {
  const bpm = 120;
  const beatInterval = 60000 / bpm;

  const mainMelody = [4, 4, 5, 7, 7, 5, 4, 2, 0, 0, 2, 4, 4, 2, 2, -1,
                      4, 4, 5, 7, 7, 5, 4, 2, 0, 0, 2, 4, 2, 0, 0, -1,
                      2, 2, 4, 0, 2, 4, 5, 4, 0, 2, 4, 5, 4, 2, 0, 2, -5,
                      4, 4, 5, 7, 7, 5, 4, 2, 0, 0, 2, 4, 2, 0, 0];

  const notes: Note[] = [];
  const melody: MelodyNote[] = [];
  let noteId = 0;
  let offset = 0;

  mainMelody.forEach((semitone, idx) => {
    const time = idx * beatInterval;
    if (semitone === -1) {
      melody.push({ time: time + offset, duration: beatInterval, frequency: 0 });
      return;
    }

    const track = idx % 4;
    const direction = DIRECTIONS[Math.floor(idx / 2) % DIRECTIONS.length];

    notes.push({
      id: noteId++,
      track,
      time: time + beatInterval * 2,
      type: 'tap',
      direction,
    });

    melody.push({
      time: time + beatInterval * 2,
      duration: beatInterval * 0.85,
      frequency: noteFreq(semitone),
    });
  });

  const intro: MelodyNote[] = [];
  for (let i = 0; i < 8; i++) {
    intro.push({
      time: i * beatInterval,
      duration: beatInterval * 0.5,
      frequency: noteFreq(0),
    });
  }

  return {
    id: 'ode',
    title: '欢乐颂',
    subtitle: 'Ode to Joy',
    artist: '贝多芬',
    difficulty: 2,
    duration: (mainMelody.length + 4) * beatInterval,
    bpm,
    notes,
    melody: [...intro, ...melody],
  };
}

function generatePractice(): Song {
  const bpm = 160;
  const beatInterval = 60000 / bpm;
  const eighth = beatInterval / 2;

  const totalBeats = 128;
  const notes: Note[] = [];
  const melody: MelodyNote[] = [];
  let noteId = 0;

  const scale = [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0, -2];

  for (let i = 0; i < totalBeats * 2; i++) {
    const time = i * eighth;
    const beatIdx = Math.floor(i / 2);
    const isEighth = i % 2 === 1;

    if (isEighth && beatIdx % 4 !== 1 && beatIdx % 4 !== 3) continue;
    if (beatIdx % 16 === 15) continue;

    const pattern = beatIdx % 16;
    let track: number;
    if (pattern < 4) {
      track = pattern;
    } else if (pattern < 8) {
      track = 7 - pattern;
    } else if (pattern < 12) {
      track = [0, 2, 1, 3][pattern - 8];
    } else {
      track = [3, 1, 2, 0][pattern - 12];
    }

    const direction = DIRECTIONS[i % DIRECTIONS.length];
    const semitone = scale[i % scale.length];

    notes.push({
      id: noteId++,
      track,
      time: time + beatInterval * 2,
      type: 'tap',
      direction,
    });

    melody.push({
      time: time + beatInterval * 2,
      duration: eighth * 0.9,
      frequency: noteFreq(semitone),
    });
  }

  const intro: MelodyNote[] = [];
  for (let i = 0; i < 8; i++) {
    intro.push({
      time: i * beatInterval,
      duration: beatInterval * 0.4,
      frequency: noteFreq(0),
    });
  }

  return {
    id: 'practice',
    title: '快速练习曲',
    subtitle: 'Speed Practice',
    artist: '喵节奏',
    difficulty: 3,
    duration: (totalBeats + 4) * beatInterval,
    bpm,
    notes,
    melody: [...intro, ...melody],
  };
}

export const SONGS: Song[] = [
  generateTwinkle(),
  generateOde(),
  generatePractice(),
];

export function getSongById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}
