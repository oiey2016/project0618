import type { Song, Note, StorySegment } from '@/types';

function generateMelodicNotes(
  pattern: number[],
  startTime: number,
  interval: number,
  startId: number,
  repeat: number = 1,
): { notes: Note[]; nextId: number; endTime: number } {
  const notes: Note[] = [];
  let id = startId;
  let time = startTime;

  for (let r = 0; r < repeat; r++) {
    for (let i = 0; i < pattern.length; i++) {
      const keyIdx = pattern[i];
      if (keyIdx >= 0) {
        notes.push({ id: id++, key: keyIdx, time });
      }
      time += interval;
    }
  }

  return { notes, nextId: id, endTime: time - interval };
}

function createSong1(): Song {
  let noteId = 1;
  const allNotes: Note[] = [];

  const intro = generateMelodicNotes(
    [0, -1, 2, -1, 3, 2, 0, -1],
    3000, 500, noteId, 2
  );
  allNotes.push(...intro.notes);
  noteId = intro.nextId;

  const verse = generateMelodicNotes(
    [0, 2, 3, 5, 3, 2, 0, -1, 1, 2, 4, 3, 2, 1, 0, -1],
    intro.endTime + 1000, 375, noteId, 2
  );
  allNotes.push(...verse.notes);
  noteId = verse.nextId;

  const chorus = generateMelodicNotes(
    [0, 2, 4, 5, 4, 2, 3, 5, 4, 3, 2, 0, 1, 3, 4, 2],
    verse.endTime + 1000, 300, noteId, 3
  );
  allNotes.push(...chorus.notes);
  noteId = chorus.nextId;

  const bridge = generateMelodicNotes(
    [5, -1, 4, -1, 3, 4, 2, -1, 3, -1, 2, -1, 0, 2, 3, -1],
    chorus.endTime + 1500, 400, noteId, 2
  );
  allNotes.push(...bridge.notes);
  noteId = bridge.nextId;

  const outro = generateMelodicNotes(
    [0, 2, 3, 2, 0, -1, 0, -1],
    bridge.endTime + 1000, 500, noteId, 1
  );
  allNotes.push(...outro.notes);

  const duration = outro.endTime + 3000;

  const storySegments: StorySegment[] = [
    {
      id: 1,
      time: 8000,
      text: '晨雾中，有人轻声哼起了摇篮曲……',
      duration: 3500,
    },
    {
      id: 2,
      time: 35000,
      text: '那是儿时记忆里，外婆家午后的阳光味道。',
      duration: 3500,
    },
    {
      id: 3,
      time: 65000,
      text: '旋律随着晚霞飘向远方，你想起了谁的脸庞？',
      duration: 3500,
    },
    {
      id: 4,
      time: 95000,
      text: '当星空落下第一颗星，故事才刚刚开始……',
      duration: 4000,
    },
  ];

  return {
    id: 'morning-light',
    title: '晨曦微光',
    subtitle: 'Morning Light',
    composer: '旋律物语',
    storyTitle: '第一章 · 晨雾中的摇篮曲',
    difficulty: 1,
    bpm: 90,
    duration,
    notes: allNotes,
    storySegments,
    sceneColors: {
      dawn: ['#FDF0D5', '#F8E4C0', '#F0D5A8', '#E8C790'],
      noon: ['#FFE8B8', '#FFD896', '#F7C474', '#EDB052'],
      dusk: ['#F5D5B8', '#EDBF9E', '#E5A980', '#D89368'],
      night: ['#1B1738', '#2A1F4D', '#3D2F63', '#231B41'],
    },
  };
}

function createSong2(): Song {
  let noteId = 1;
  const allNotes: Note[] = [];

  const intro = generateMelodicNotes(
    [3, 4, 5, 4, 3, -1, 2, -1],
    3000, 400, noteId, 2
  );
  allNotes.push(...intro.notes);
  noteId = intro.nextId;

  const verse = generateMelodicNotes(
    [1, 3, 5, 4, 3, 1, 2, 4, 3, 2, 1, 0, 2, 3, 5, 4],
    intro.endTime + 800, 300, noteId, 3
  );
  allNotes.push(...verse.notes);
  noteId = verse.nextId;

  const chorus = generateMelodicNotes(
    [0, 2, 5, 4, 3, 5, 4, 2, 1, 3, 5, 4, 3, 2, 1, 0,
     0, 2, 4, 5, 4, 2, 3, 5, 4, 3, 1, 2, 4, 3, 2, 0],
    verse.endTime + 1200, 225, noteId, 2
  );
  allNotes.push(...chorus.notes);
  noteId = chorus.nextId;

  const outro = generateMelodicNotes(
    [5, 4, 3, 2, 1, 0, -1, -1],
    chorus.endTime + 1500, 500, noteId, 1
  );
  allNotes.push(...outro.notes);

  const duration = outro.endTime + 3000;

  const storySegments: StorySegment[] = [
    {
      id: 1,
      time: 7000,
      text: '雨后的天空，藏着一道看不见的彩虹。',
      duration: 3500,
    },
    {
      id: 2,
      time: 32000,
      text: '每当风起时，旧时光便会轻轻回响。',
      duration: 3500,
    },
    {
      id: 3,
      time: 62000,
      text: '你站在黄昏的渡口，与谁道别过？',
      duration: 3500,
    },
    {
      id: 4,
      time: 100000,
      text: '夜色温柔，请收下这首为你写的歌。',
      duration: 4000,
    },
  ];

  return {
    id: 'rainbow-after-rain',
    title: '雨后彩虹',
    subtitle: 'Rainbow After Rain',
    composer: '旋律物语',
    storyTitle: '第二章 · 天空的回信',
    difficulty: 2,
    bpm: 108,
    duration,
    notes: allNotes,
    storySegments,
    sceneColors: {
      dawn: ['#E0E8F0', '#C8D4E3', '#B0C0D6', '#98ACC9'],
      noon: ['#D4E8F7', '#A8D0E6', '#7CB8D5', '#50A0C4'],
      dusk: ['#E8B4D4', '#DDA0DD', '#C9A8E6', '#B391D0'],
      night: ['#16213E', '#1F2F5C', '#2A3D7A', '#1B2850'],
    },
  };
}

function createSong3(): Song {
  let noteId = 1;
  const allNotes: Note[] = [];

  const intro = generateMelodicNotes(
    [5, -1, 3, -1, 5, -1, 4, -1],
    3000, 350, noteId, 2
  );
  allNotes.push(...intro.notes);
  noteId = intro.nextId;

  const verse = generateMelodicNotes(
    [0, 3, 5, 3, 4, 2, 3, 0, 1, 4, 5, 4, 3, 1, 2, 0],
    intro.endTime + 800, 250, noteId, 3
  );
  allNotes.push(...verse.notes);
  noteId = verse.nextId;

  const chorus = generateMelodicNotes(
    [0, 2, 3, 5, 4, 3, 2, 3, 5, 4, 3, 2, 1, 0, 2, 3,
     5, 4, 5, 3, 4, 2, 3, 1, 2, 0, 1, 3, 2, 1, 0, -1],
    verse.endTime + 1000, 180, noteId, 3
  );
  allNotes.push(...chorus.notes);
  noteId = chorus.nextId;

  const bridge = generateMelodicNotes(
    [5, 4, 3, 5, 4, 3, 2, 4, 3, 2, 1, 3, 2, 1, 0, 2],
    chorus.endTime + 1500, 220, noteId, 2
  );
  allNotes.push(...bridge.notes);
  noteId = bridge.nextId;

  const outro = generateMelodicNotes(
    [0, 2, 4, 5, 4, 2, 3, 0, -1, -1, -1, -1],
    bridge.endTime + 1200, 350, noteId, 1
  );
  allNotes.push(...outro.notes);

  const duration = outro.endTime + 3500;

  const storySegments: StorySegment[] = [
    {
      id: 1,
      time: 6000,
      text: '传说中，星光是散落的音符。',
      duration: 3200,
    },
    {
      id: 2,
      time: 28000,
      text: '每一颗流星划过，都是有人许下了愿望。',
      duration: 3500,
    },
    {
      id: 3,
      time: 55000,
      text: '如果旋律能穿越时空，你想对过去的自己说什么？',
      duration: 3800,
    },
    {
      id: 4,
      time: 85000,
      text: '在繁星下，故事永不会有结局……',
      duration: 4000,
    },
  ];

  return {
    id: 'starry-whisper',
    title: '星语心愿',
    subtitle: 'Starry Whisper',
    composer: '旋律物语',
    storyTitle: '第三章 · 星光的叙事诗',
    difficulty: 3,
    bpm: 120,
    duration,
    notes: allNotes,
    storySegments,
    sceneColors: {
      dawn: ['#E6E0F0', '#D0C4E8', '#BAA8E0', '#A48CD8'],
      noon: ['#D4C4E8', '#BFA4D8', '#AA84C8', '#9564B8'],
      dusk: ['#E8B4D4', '#DDA0DD', '#C9A8E6', '#8B9DC3'],
      night: ['#0F0C29', '#1A1640', '#302B63', '#241F50'],
    },
  };
}

export const SONGS: Song[] = [
  createSong1(),
  createSong2(),
  createSong3(),
];

export function getSongById(id: string): Song | undefined {
  return SONGS.find(s => s.id === id);
}
