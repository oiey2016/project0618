import { useMemo } from 'react';
import type { RenderNote } from '@/types/game';
import {
  TRACK_COUNT,
  JUDGMENT_LINE_POSITION,
  TRACK_COLORS,
  DIRECTION_ARROWS,
  JUDGMENT_COLORS,
  type JudgmentPopup,
} from '@/types/game';

interface GameTrackProps {
  renderNotes: RenderNote[];
  judgments: JudgmentPopup[];
  pressedTracks: Set<number>;
  onTrackPress: (track: number) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  containerHeight: number;
}

export function GameTrack({
  renderNotes,
  judgments,
  pressedTracks,
  onTrackPress,
  onTouchStart,
  onTouchEnd,
  containerHeight,
}: GameTrackProps) {
  const trackWidth = 100 / TRACK_COUNT;
  const judgmentY = containerHeight * JUDGMENT_LINE_POSITION;

  const tracks = useMemo(() => {
    return Array.from({ length: TRACK_COUNT }).map((_, i) => ({
      index: i,
      color: TRACK_COLORS[i],
      key: ['D', 'F', 'J', 'K'][i],
    }));
  }, []);

  const sortedJudgments = useMemo(() => {
    return judgments.map((j) => ({
      ...j,
      trackColor: TRACK_COLORS[j.track],
    }));
  }, [judgments]);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-3xl"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.4)',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0 pointer-events-none">
        {tracks.map((track) => (
          <div
            key={track.index}
            className="absolute top-0 bottom-0 border-r border-white/20 last:border-r-0"
            style={{
              left: `${track.index * trackWidth}%`,
              width: `${trackWidth}%`,
              background: pressedTracks.has(track.index)
                ? `linear-gradient(180deg, ${track.color.glow}22 0%, ${track.color.glow}44 100%)`
                : 'transparent',
              transition: 'background 0.1s ease-out',
            }}
          />
        ))}

        {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
          <div
            key={`line-${i}`}
            className="track-line"
            style={{
              top: `${pos * 100}%`,
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />
        ))}

        <div
          className="judgment-line"
          style={{ top: `${JUDGMENT_LINE_POSITION * 100}%` }}
        />

        {tracks.map((track) => (
          <div
            key={`hitzone-${track.index}`}
            className={`
              absolute rounded-2xl transition-all duration-100
              ${pressedTracks.has(track.index) ? 'scale-110 opacity-100' : 'opacity-70'}
            `}
            style={{
              left: `${track.index * trackWidth + 1}%`,
              width: `${trackWidth - 2}%`,
              top: `${JUDGMENT_LINE_POSITION * 100 - 8}%`,
              height: '16%',
              background: pressedTracks.has(track.index)
                ? `linear-gradient(180deg, ${track.color.glow}33 0%, ${track.color.glow}66 100%)`
                : `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
              border: `2px solid ${pressedTracks.has(track.index) ? track.color.solid : 'rgba(255,255,255,0.3)'}`,
              boxShadow: pressedTracks.has(track.index)
                ? `0 0 30px ${track.color.glow}`
                : 'none',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        {renderNotes.map((note) => {
          const y = note.progress * containerHeight;
          const track = tracks[note.track];
          if (!track) return null;

          return (
            <div
              key={note.key}
              className={`note-arrow ${note.hitEffect ? 'note-hit-effect' : ''}`}
              style={{
                left: `${note.track * trackWidth + 2}%`,
                width: `${trackWidth - 4}%`,
                height: '56px',
                transform: `translate3d(0, ${y - 28}px, 0)`,
                top: 0,
              }}
            >
              <div
                className={`
                  w-full h-full rounded-2xl flex items-center justify-center
                  bg-gradient-to-br ${track.color.bg}
                  border-2 border-white/60
                  shadow-lg
                `}
              >
                <span className="text-white text-3xl font-black drop-shadow-lg">
                  {DIRECTION_ARROWS[note.direction]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {sortedJudgments.map((j) => (
        <div
          key={j.id}
          className={`judgment-popup ${JUDGMENT_COLORS[j.type]}`}
          style={{
            top: `${JUDGMENT_LINE_POSITION * 100 - 15}%`,
            left: `${j.track * trackWidth + trackWidth / 2}%`,
          }}
        >
          {j.type === 'perfect' && '✨ Perfect ✨'}
          {j.type === 'great' && '🌟 Great!'}
          {j.type === 'good' && '👍 Good'}
          {j.type === 'miss' && '💔 Miss'}
        </div>
      ))}

      <div className="absolute inset-0 flex pointer-events-auto">
        {tracks.map((track) => (
          <button
            key={track.index}
            onMouseDown={() => onTrackPress(track.index)}
            className="h-full focus:outline-none active:outline-none"
            style={{ width: `${trackWidth}%` }}
          >
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  font-display font-black text-lg
                  transition-all duration-100
                  ${pressedTracks.has(track.index)
                    ? 'scale-125 translate-y-1'
                    : ''
                  }
                `}
                style={{
                  background: pressedTracks.has(track.index)
                    ? `linear-gradient(135deg, ${track.color.solid}, ${track.color.solid}cc)`
                    : 'rgba(255,255,255,0.3)',
                  color: pressedTracks.has(track.index) ? 'white' : track.color.solid,
                  boxShadow: pressedTracks.has(track.index)
                    ? `0 4px 20px ${track.color.glow}`
                    : 'none',
                }}
              >
                {track.key}
              </div>
            </div>
          </button>
        ))}
      </div>

      {(() => {
        const _ = judgmentY;
        return null;
      })()}
    </div>
  );
}
