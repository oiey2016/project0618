import { useState } from 'react';
import { Music, HelpCircle, Sparkles, Cat } from 'lucide-react';
import { SongCard } from '@/components/SongCard';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { SONGS } from '@/data/songs';
import { audioSystem } from '@/utils/audio';

function Home() {
  const [selectedSongId, setSelectedSongId] = useState<string | null>(SONGS[0]?.id ?? null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const selectedSong = SONGS.find((s) => s.id === selectedSongId);

  return (
    <div className="relative min-h-screen w-full px-4 py-8 md:py-12">
      <div className="paw-decoration top-8 left-8 animate-float" style={{ animationDelay: '0s' }}>
        🐾
      </div>
      <div className="paw-decoration top-20 right-12 animate-float" style={{ animationDelay: '0.5s' }}>
        🐾
      </div>
      <div className="paw-decoration bottom-32 left-16 animate-float" style={{ animationDelay: '1s' }}>
        🐾
      </div>
      <div className="paw-decoration bottom-20 right-24 animate-float" style={{ animationDelay: '1.5s' }}>
        🐾
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 flex items-center justify-center shadow-2xl animate-bounce-slow">
              <Cat className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            喵节奏
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-display flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            跟着旋律，踩准节拍
            <Sparkles className="w-5 h-5 text-amber-400" />
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-slide-down">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="glass-btn px-6 py-3 flex items-center gap-2 font-display font-bold text-gray-700"
          >
            <HelpCircle className="w-5 h-5 text-purple-500" />
            玩法说明
          </button>
          <div className="glass-btn px-6 py-3 flex items-center gap-2 font-display font-bold text-gray-700">
            <Music className="w-5 h-5 text-pink-500" />
            {SONGS.length} 首歌曲
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-display font-bold text-2xl text-gray-800 mb-5 flex items-center gap-2">
            <span className="text-3xl">🎵</span>
            选择你的歌曲
          </h2>
          <div className="space-y-4">
            {SONGS.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isSelected={song.id === selectedSongId}
                onClick={() => {
                  setSelectedSongId(song.id);
                  audioSystem.init();
                }}
              />
            ))}
          </div>
        </div>

        {selectedSong && (
          <div className="glass-card p-6 text-center animate-slide-down">
            <p className="text-gray-600 mb-4 font-display">
              准备好了吗？让我们开始
              <span className="font-bold text-pink-500 mx-1">「{selectedSong.title}」</span>
              吧！
            </p>
            <div className="text-sm text-gray-500 mb-4">
              💡 小提示：可以使用键盘 <kbd className="px-2 py-1 rounded bg-white/70 font-mono">D F J K</kbd> 或直接点击屏幕
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm font-display">
          <p>用 ❤️ 和 🎵 制作 · 喵节奏</p>
        </footer>
      </div>

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </div>
  );
}

export default Home;
