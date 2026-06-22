import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Lock, Play, BookOpen, Award } from 'lucide-react';
import { useSaveStore } from '@/store/saveStore';
import { SONGS } from '@/data/songs';
import { audioEngine } from '@/audio/AudioEngine';
import type { Difficulty, Song, Rank } from '@/types';
import { clsx } from 'clsx';

const difficultyStars = (d: Difficulty) => {
  return Array.from({ length: 3 }, (_, i) => i < d);
};

const rankColors: Record<NonNullable<Rank>, string> = {
  S: 'text-yellow-500',
  A: 'text-gray-300',
  B: 'text-orange-400',
  C: 'text-rose-400',
};

function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <div className="flex items-center gap-0.5">
      {difficultyStars(level).map((filled, i) => (
        <Star
          key={i}
          className={clsx(
            'w-3.5 h-3.5 transition-all',
            filled
              ? 'fill-warm-400 text-warm-400'
              : 'text-warm-300/50',
          )}
        />
      ))}
    </div>
  );
}

function RankBadge({ rank }: { rank: Rank }) {
  if (!rank) return null;
  return (
    <div
      className={clsx(
        'flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm',
        rankColors[rank],
      )}
    >
      <Award className="w-3.5 h-3.5 fill-current" />
      <span className="font-bold text-sm font-serif-sc tracking-wide">{rank}</span>
    </div>
  );
}

function SongCover({ song, unlocked }: { song: Song; unlocked: boolean }) {
  const gradients = [
    'from-rose-200 via-warm-200 to-amber-200',
    'from-sky-200 via-dusk-200 to-violet-200',
    'from-indigo-300 via-purple-300 to-pink-300',
  ];
  const idx = SONGS.indexOf(song) % gradients.length;

  return (
    <div
      className={clsx(
        'relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-500',
        unlocked
          ? `bg-gradient-to-br ${gradients[idx]}`
          : 'bg-gradient-to-br from-gray-200 to-gray-300 grayscale',
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.6),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,179,71,0.35),transparent_60%)]" />

      <svg
        className="absolute bottom-0 left-0 w-full h-2/3 opacity-30"
        viewBox="0 0 200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,90 Q25,60 50,75 T100,70 T150,55 T200,80 L200,120 L0,120 Z"
          fill="#8B9DC3"
        />
        <path
          d="M0,100 Q30,75 60,85 T120,80 T180,70 T200,90 L200,120 L0,120 Z"
          fill="#6B5AA7"
          opacity="0.6"
        />
      </svg>

      <div className="absolute top-3 right-3">
        <div className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm border border-white/90 flex items-center justify-center shadow-sm">
          <Music className="w-4 h-4 text-warm-600" />
        </div>
      </div>

      {!unlocked && (
        <div className="absolute inset-0 bg-forest-900/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 border border-white/40 backdrop-blur-md flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

import { Music } from 'lucide-react';

export default function SelectPage() {
  const navigate = useNavigate();
  const saveData = useSaveStore((s) => s.saveData);

  const songsWithProgress = useMemo(
    () =>
      SONGS.map((song) => ({
        song,
        progress: saveData.songs[song.id] || {
          unlocked: false,
          bestScore: 0,
          bestRank: null,
          completed: false,
          playCount: 0,
        },
      })),
    [saveData],
  );

  const handlePlay = (songId: string) => {
    audioEngine.init();
    audioEngine.resume();
    navigate(`/play/${songId}`);
  };

  return (
    <div className="relative w-full h-full overflow-hidden scene-dawn">
      <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-warm-100/80 to-dusk-100/50" />

      <div className="grain-overlay" />
      <div className="soft-vignette" />

      <div className="relative z-10 flex flex-col h-full">
        <header className="flex items-center justify-between px-6 md:px-10 pt-6 pb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 text-forest-700 hover:bg-white/80 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">返回</span>
          </button>

          <div className="text-center">
            <h1 className="font-serif-sc text-2xl md:text-3xl font-bold text-forest-800 tracking-wider">
              曲目绘本
            </h1>
            <p className="text-xs md:text-sm text-forest-500 mt-0.5">
              选择一段旋律，开启一章故事
            </p>
          </div>

          <div className="w-[96px]" />
        </header>

        <div className="flex-1 overflow-y-auto scroll-hidden px-6 md:px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
            {songsWithProgress.map(({ song, progress }, idx) => (
              <article
                key={song.id}
                className={clsx(
                  'glass-card rounded-3xl p-5 transition-all duration-500 group',
                  progress.unlocked
                    ? 'hover:scale-[1.02] hover:shadow-2xl cursor-pointer'
                    : 'opacity-70',
                )}
                onClick={() => progress.unlocked && handlePlay(song.id)}
              >
                <div className="relative mb-5">
                  <SongCover song={song} unlocked={progress.unlocked} />

                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    {progress.bestRank && <RankBadge rank={progress.bestRank} />}
                    <div className="px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-white/20 text-white text-xs font-medium">
                      第{idx + 1}章
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif-sc text-lg md:text-xl font-bold text-forest-800 truncate">
                        {song.title}
                      </h3>
                      <p className="text-xs text-forest-500 tracking-wide mt-0.5">
                        {song.subtitle}
                      </p>
                    </div>
                    <DifficultyBadge level={song.difficulty} />
                  </div>

                  <p className="text-sm text-forest-600/80 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-warm-500 flex-shrink-0" />
                    <span className="truncate">{song.storyTitle}</span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-warm-200/50 mt-3">
                    <div>
                      {progress.completed ? (
                        <div>
                          <p className="text-xs text-forest-500">最高分</p>
                          <p className="font-serif-sc font-bold text-warm-600 text-lg leading-tight">
                            {progress.bestScore.toLocaleString()}
                          </p>
                        </div>
                      ) : progress.unlocked ? (
                        <p className="text-sm text-warm-600 font-medium">
                          ✨ 新章节待开启
                        </p>
                      ) : (
                        <p className="text-sm text-forest-500/70">
                          🔒 完成前一章解锁
                        </p>
                      )}
                    </div>

                    {progress.unlocked && (
                      <button
                        className={clsx(
                          'flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-300',
                          progress.completed
                            ? 'bg-warm-100 text-warm-700 hover:bg-warm-200 border border-warm-300/50'
                            : 'bg-gradient-to-r from-warm-400 to-warm-500 text-white shadow-lg shadow-warm-500/30 hover:shadow-glow hover:scale-105',
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(song.id);
                        }}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        {progress.completed ? '再演奏' : '演奏'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
