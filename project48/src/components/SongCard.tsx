import { Star, Music, Clock, Play } from 'lucide-react';
import type { Song, Difficulty } from '@/types/game';
import { useNavigate } from 'react-router-dom';
import { audioSystem } from '@/utils/audio';

interface SongCardProps {
  song: Song;
  isSelected: boolean;
  onClick: () => void;
}

const difficultyColors: Record<Difficulty, string> = {
  1: 'from-emerald-400 to-green-500',
  2: 'from-amber-400 to-orange-500',
  3: 'from-rose-400 to-red-500',
};

const difficultyLabels: Record<Difficulty, string> = {
  1: '简单',
  2: '普通',
  3: '困难',
};

export function SongCard({ song, isSelected, onClick }: SongCardProps) {
  const navigate = useNavigate();

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await audioSystem.init();
    navigate(`/game/${song.id}`);
  };

  return (
    <div
      onClick={onClick}
      className={`
        glass-card p-5 cursor-pointer transition-all duration-300
        ${isSelected ? 'scale-105 ring-4 ring-pink-400/50 shadow-2xl' : 'hover:scale-102 hover:shadow-xl'}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-5 h-5 text-pink-500 flex-shrink-0" />
            <h3 className="font-display font-bold text-xl text-gray-800 truncate">
              {song.title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-1">{song.subtitle}</p>
          <p className="text-xs text-gray-400 mb-3">{song.artist}</p>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < song.difficulty
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span
              className={`
                px-3 py-1 rounded-full text-xs font-bold text-white
                bg-gradient-to-r ${difficultyColors[song.difficulty]}
              `}
            >
              {difficultyLabels[song.difficulty]}
            </span>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{Math.round(song.duration / 1000)}秒</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span className="font-mono">{song.bpm}</span>
              <span className="text-xs">BPM</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlay}
          className={`
            flex-shrink-0 w-14 h-14 rounded-full
            bg-gradient-to-r from-pink-500 to-purple-500
            flex items-center justify-center
            text-white shadow-lg
            transition-all duration-300
            hover:scale-110 hover:shadow-xl
            active:scale-95
            ${isSelected ? 'animate-glow' : ''}
          `}
        >
          <Play className="w-7 h-7 ml-1" />
        </button>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-white/50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>🎵 {song.notes.length} 个音符</span>
            <span>点击右侧按钮开始游戏！</span>
          </div>
        </div>
      )}
    </div>
  );
}
