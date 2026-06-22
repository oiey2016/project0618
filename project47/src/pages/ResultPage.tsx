import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, RotateCcw, ChevronRight, Award, Sparkles, Music } from 'lucide-react';
import { getSongById, SONGS } from '@/data/songs';
import { useSaveStore } from '@/store/saveStore';
import { getMaxScore, calculateRank } from '@/utils/saveManager';
import { clsx } from 'clsx';
import type { Rank } from '@/types';

const rankDisplay: Record<
  NonNullable<Rank>,
  { label: string; color: string; glow: string; bg: string }
> = {
  S: {
    label: '完美演出',
    color: 'text-yellow-400',
    glow: '0 0 80px rgba(255, 215, 0, 0.6), 0 0 120px rgba(255, 179, 71, 0.35)',
    bg: 'from-yellow-200/40 via-amber-200/30 to-orange-200/30',
  },
  A: {
    label: '精彩演绎',
    color: 'text-gray-100',
    glow: '0 0 60px rgba(220, 220, 230, 0.5), 0 0 100px rgba(180, 180, 200, 0.3)',
    bg: 'from-gray-100/40 via-slate-100/30 to-zinc-200/25',
  },
  B: {
    label: '温暖动人',
    color: 'text-orange-300',
    glow: '0 0 50px rgba(255, 160, 80, 0.45), 0 0 80px rgba(255, 120, 60, 0.25)',
    bg: 'from-orange-100/40 via-rose-100/30 to-amber-100/25',
  },
  C: {
    label: '温柔如歌',
    color: 'text-rose-300',
    glow: '0 0 40px rgba(255, 140, 140, 0.4), 0 0 60px rgba(255, 100, 120, 0.2)',
    bg: 'from-rose-100/40 via-pink-100/30 to-red-100/25',
  },
};

export default function ResultPage() {
  const navigate = useNavigate();
  const { songId = '' } = useParams();
  const song = getSongById(songId);
  const saveData = useSaveStore((s) => s.saveData);

  const progress = useMemo(() => {
    return saveData.songs[songId] || {
      bestScore: 0,
      bestRank: null as Rank,
      completed: false,
      playCount: 0,
    };
  }, [saveData, songId]);

  const nextSong = useMemo(() => {
    const idx = SONGS.findIndex((s) => s.id === songId);
    if (idx < 0 || idx >= SONGS.length - 1) return null;
    return SONGS[idx + 1];
  }, [songId]);

  const nextUnlocked = useMemo(() => {
    if (!nextSong) return false;
    return saveData.songs[nextSong.id]?.unlocked ?? false;
  }, [nextSong, saveData]);

  if (!song) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-forest-600">曲目不存在</p>
      </div>
    );
  }

  const maxScore = getMaxScore(song.notes.length);
  const rank = (progress.bestRank as Rank) || calculateRank(progress.bestScore, maxScore) || 'C';
  const rankInfo = rankDisplay[rank];
  const accuracy = progress.bestScore > 0
    ? Math.round((progress.bestScore / maxScore) * 1000) / 10
    : 0;

  return (
    <div className="relative w-full h-full overflow-hidden scene-dusk">
      <div className="absolute inset-0 bg-gradient-to-br from-warm-100 via-dusk-100/80 to-dusk-200/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-dusk-300/50 via-transparent to-warm-200/30" />

      <div className="grain-overlay opacity-50" />
      <div className="soft-vignette" />

      <div className="relative z-10 w-full h-full overflow-y-auto scroll-hidden">
        <div className="min-h-full flex flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-lg mx-auto animate-fade-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/70 text-forest-600/80 text-xs md:text-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-warm-500" />
                <span className="font-serif-sc">{song.storyTitle}</span>
              </div>
              <h1 className="font-serif-sc text-3xl md:text-4xl font-bold text-forest-800 mb-2">
                {song.title}
              </h1>
              <p className="text-forest-500/80 text-sm md:text-base tracking-wide">
                {song.subtitle}
              </p>
            </div>

            <div
              className={clsx(
                'glass-card rounded-[32px] p-8 md:p-10 mb-6 relative overflow-hidden border border-white/60',
              )}
            >
              <div
                className={clsx(
                  'absolute inset-0 bg-gradient-to-br opacity-60 pointer-events-none',
                  rankInfo.bg,
                )}
              />

              <div className="relative text-center mb-8">
                <div
                  className="inline-flex items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full relative"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
                    boxShadow: rankInfo.glow,
                  }}
                >
                  <div className="absolute inset-2 rounded-full bg-white/70 backdrop-blur-md border-2 border-white/80 flex items-center justify-center">
                    <span
                      className={clsx(
                        'font-serif-sc font-black text-7xl md:text-8xl leading-none',
                        rankInfo.color,
                      )}
                      style={{
                        textShadow:
                          rank === 'S'
                            ? '0 4px 25px rgba(255, 180, 0, 0.5)'
                            : '0 4px 20px rgba(0,0,0,0.15)',
                      }}
                    >
                      {rank}
                    </span>
                  </div>
                </div>

                <p
                  className={clsx(
                    'mt-5 font-serif-sc font-semibold text-lg md:text-xl',
                    rankInfo.color.replace('text-', 'text-'),
                  )}
                >
                  <Award className="inline w-5 h-5 mr-1.5 mb-0.5" />
                  {rankInfo.label}
                </p>
              </div>

              <div className="relative grid grid-cols-2 gap-4 md:gap-5 mb-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/70">
                  <p className="text-xs text-forest-500 tracking-wider uppercase mb-1">
                    总分
                  </p>
                  <p className="font-serif-sc font-bold text-2xl md:text-3xl text-warm-600">
                    {progress.bestScore.toLocaleString()}
                  </p>
                  <p className="text-xs text-forest-500/70 mt-1">
                    最高 {maxScore.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/70">
                  <p className="text-xs text-forest-500 tracking-wider uppercase mb-1">
                    准确率
                  </p>
                  <p className="font-serif-sc font-bold text-2xl md:text-3xl text-forest-700">
                    {accuracy}%
                  </p>
                  <div className="mt-2 h-1.5 bg-warm-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-warm-400 to-warm-500 rounded-full"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="relative text-center py-4 border-t border-b border-warm-200/60 mb-6">
                <p className="font-serif-sc text-forest-700/80 text-sm md:text-base italic">
                  旋律已经化作星光，落在了故事集的下一页……
                </p>
              </div>

              {nextSong && (
                <div className="relative">
                  {nextUnlocked ? (
                    <div className="glass-card rounded-2xl p-4 md:p-5 border border-warm-300/40 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-dusk-200 via-warm-200 to-dusk-300 flex items-center justify-center shadow-md flex-shrink-0">
                          <Music className="w-6 h-6 md:w-7 md:h-7 text-warm-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] md:text-xs text-warm-600 font-medium tracking-wider uppercase mb-0.5">
                            🔓 解锁 · 下一章
                          </p>
                          <p className="font-serif-sc font-bold text-forest-800 text-base md:text-lg truncate">
                            {nextSong.title}
                          </p>
                          <p className="text-xs text-forest-500 truncate">
                            {nextSong.storyTitle}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-warm-500 flex-shrink-0" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3 opacity-80">
                      <p className="text-sm text-forest-500">
                        再挑战一次，取得更好的成绩吧 ✨
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/')}
                className="glass-card rounded-2xl p-4 flex flex-col items-center gap-1.5 hover:bg-white/80 transition-all group backdrop-blur-md"
              >
                <Home className="w-5 h-5 text-forest-600 group-hover:text-warm-500 transition-colors" />
                <span className="text-xs font-medium text-forest-600">主页</span>
              </button>

              <button
                onClick={() => navigate('/select')}
                className="glass-card rounded-2xl p-4 flex flex-col items-center gap-1.5 hover:bg-white/80 transition-all group backdrop-blur-md"
              >
                <Music className="w-5 h-5 text-forest-600 group-hover:text-warm-500 transition-colors" />
                <span className="text-xs font-medium text-forest-600">曲目</span>
              </button>

              <button
                onClick={() => navigate(`/play/${song.id}`)}
                className="bg-gradient-to-br from-warm-400 to-warm-600 rounded-2xl p-4 flex flex-col items-center gap-1.5 hover:shadow-glow hover:scale-[1.03] transition-all shadow-lg shadow-warm-500/30"
              >
                <RotateCcw className="w-5 h-5 text-white" />
                <span className="text-xs font-medium text-white">再演奏</span>
              </button>
            </div>

            {nextSong && nextUnlocked && (
              <button
                onClick={() => navigate(`/play/${nextSong.id}`)}
                className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-dusk-400 via-dusk-500 to-note-purple text-white font-medium text-base md:text-lg shadow-xl shadow-dusk-500/30 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                继续下一章
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
