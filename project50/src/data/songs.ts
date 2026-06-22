import { SongData } from '@/game/types';

export const demoSong: SongData = {
  id: 'demo-001',
  name: '星空旋舞',
  artist: '旋音',
  bpm: 120,
  duration: 60,
  difficulty: 'normal',
  notes: generateDemoNotes(120, 60)
};

function generateDemoNotes(bpm: number, duration: number): SongData['notes'] {
  const notes: SongData['notes'] = [];
  const beatDuration = 60 / bpm;
  let time = 2;

  while (time < duration - 2) {
    const pattern = Math.floor(Math.random() * 6);

    switch (pattern) {
      case 0:
        for (let i = 0; i < 4; i++) {
          notes.push({
            time: time + i * beatDuration,
            angle: (i * 90 + Math.random() * 30 - 15 + 360) % 360,
            type: 'normal'
          });
        }
        time += beatDuration * 4;
        break;

      case 1:
        for (let i = 0; i < 8; i++) {
          notes.push({
            time: time + i * (beatDuration / 2),
            angle: (i * 45 + Math.random() * 10 - 5 + 360) % 360,
            type: i % 4 === 3 ? 'bonus' : 'normal'
          });
        }
        time += beatDuration * 4;
        break;

      case 2:
        const baseAngle = Math.random() * 360;
        for (let i = 0; i < 3; i++) {
          notes.push({
            time: time + i * beatDuration,
            angle: (baseAngle + i * 120 + 360) % 360,
            type: 'normal'
          });
        }
        time += beatDuration * 3;
        break;

      case 3:
        for (let i = 0; i < 2; i++) {
          notes.push({
            time: time + i * (beatDuration * 2),
            angle: Math.random() * 360,
            type: 'bonus'
          });
        }
        time += beatDuration * 4;
        break;

      case 4:
        for (let i = 0; i < 6; i++) {
          notes.push({
            time: time + i * (beatDuration / 3),
            angle: (i * 60 + 360) % 360,
            type: 'normal'
          });
        }
        time += beatDuration * 2;
        break;

      case 5:
        const centerAngle = Math.random() * 360;
        for (let i = -2; i <= 2; i++) {
          if (i === 0) continue;
          notes.push({
            time: time + Math.abs(i) * (beatDuration / 2),
            angle: (centerAngle + i * 30 + 360) % 360,
            type: i % 2 === 0 ? 'bonus' : 'normal'
          });
        }
        time += beatDuration * 2;
        break;
    }

    time += beatDuration * 0.5;
  }

  return notes.sort((a, b) => a.time - b.time);
}

export const songs = [demoSong];
