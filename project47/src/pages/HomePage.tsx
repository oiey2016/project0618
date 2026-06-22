import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Play, Library, Settings, Sparkles, X, Volume2, Gauge, RotateCcw } from 'lucide-react';
import { useSaveStore } from '@/store/saveStore';
import { SONGS } from '@/data/songs';
import { audioEngine } from '@/audio/AudioEngine';
import { clsx } from 'clsx';

function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      hue: number;
    }[] = [];

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      particles.length = 0;
      const count = Math.min(100, Math.floor((w * h) / 18000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: 0.15 + Math.random() * 0.35,
          size: 1.5 + Math.random() * 3.5,
          alpha: 0.25 + Math.random() * 0.55,
          hue: 30 + Math.random() * 25,
        });
      }
    };

    const render = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#FDF0D5');
      gradient.addColorStop(0.4, '#F8E4C0');
      gradient.addColorStop(0.75, '#F0D5A8');
      gradient.addColorStop(1, '#E8C790');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w * 0.78, h * 0.15, 0, w * 0.78, h * 0.15, Math.min(w, h) * 0.5);
      glow.addColorStop(0, 'rgba(255, 230, 160, 0.45)');
      glow.addColorStop(0.5, 'rgba(255, 200, 130, 0.15)');
      glow.addColorStop(1, 'rgba(255, 180, 100, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, 1)`;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    resize();
    initParticles();
    render();

    const onResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const initialize = useSaveStore((s) => s.initialize);
  const saveData = useSaveStore((s) => s.saveData);
  const updateSettings = useSaveStore((s) => s.updateSettings);
  const resetProgress = useSaveStore((s) => s.resetProgress);

  const [showSettings, setShowSettings] = useState(false);
  const [tempVolume, setTempVolume] = useState(saveData.settings.volume);
  const [tempSpeed, setTempSpeed] = useState(saveData.settings.noteSpeed);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    setTempVolume(saveData.settings.volume);
    setTempSpeed(saveData.settings.noteSpeed);
  }, [saveData.settings]);

  const stats = useMemo(() => {
    const songs = Object.values(saveData.songs);
    const completed = songs.filter((s) => s.completed).length;
    const unlocked = songs.filter((s) => s.unlocked).length;
    const totalScore = songs.reduce((sum, s) => sum + s.bestScore, 0);
    return { completed, unlocked, totalScore, total: SONGS.length };
  }, [saveData]);

  const firstUnplayedSong = SONGS.find((s) => {
    const p = saveData.songs[s.id];
    return p?.unlocked && !p.completed;
  });
  const recommendedSong = firstUnplayedSong || SONGS.find((s) => saveData.songs[s.id]?.unlocked);

  const handleStart = () => {
    audioEngine.init();
    audioEngine.resume();
    if (recommendedSong) {
      navigate(`/play/${recommendedSong.id}`);
    } else {
      navigate('/select');
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden scene-dawn">
      <AmbientBackground />

      <div className="grain-overlay" />
      <div className="soft-vignette" />

      <div className="relative z-10 flex flex-col h-full">
        <header className="flex items-center justify-between px-8 md:px-12 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center shadow-lg shadow-warm-500/30">
              <Music className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-serif-sc text-xl md:text-2xl font-semibold text-forest-800 tracking-wider">
                旋律物语
              </h1>
              <p className="text-xs md:text-sm text-forest-500 -mt-0.5 tracking-wide">
                Melody Tale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioEngine.init();
                audioEngine.resume();
                navigate('/select');
              }}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">曲目列表</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center text-forest-600 transition-all hover:bg-white/80 hover:scale-105 active:scale-95"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 animate-pulse-soft">
            <Sparkles className="w-10 h-10 text-warm-500" strokeWidth={1.5} />
          </div>

          <h2 className="font-serif-sc title-reveal text-shimmer text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            旋律物语
          </h2>

          <p className="font-serif-sc text-lg md:text-xl text-forest-700/80 mb-3 animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
            一本会发声的治愈绘本
          </p>
          <p className="text-sm md:text-base text-forest-600/60 max-w-md animate-fade-in opacity-0" style={{ animationDelay: '0.9s' }}>
            用指尖触碰发光的音符，奏响属于你的故事乐章
          </p>

          <div
            className="mt-10 md:mt-14 animate-fade-up opacity-0"
            style={{ animationDelay: '1.2s' }}
          >
            <button
              onClick={handleStart}
              className="group flex items-center gap-3 px-10 md:px-14 py-4 md:py-5 rounded-3xl bg-gradient-to-r from-warm-400 via-warm-500 to-warm-600 text-white font-medium text-lg md:text-xl shadow-2xl shadow-warm-500/40 transition-all duration-500 hover:scale-105 hover:shadow-glow active:scale-[0.98]"
            >
              <Play className="w-6 h-6 fill-current" />
              {recommendedSong ? (
                <span>
                  开始演奏 · {recommendedSong.title}
                </span>
              ) : (
                <span>开始演奏</span>
              )}
            </button>
          </div>

          <div
            className="mt-8 animate-fade-in opacity-0"
            style={{ animationDelay: '1.6s' }}
          >
            <button
              onClick={() => navigate('/select')}
              className="text-sm text-forest-600/70 underline underline-offset-4 hover:text-warm-600 transition-colors"
            >
              浏览全部曲目 →
            </button>
          </div>
        </div>

        <footer className="px-8 md:px-12 pb-8 md:pb-10">
          <div className="glass-card rounded-2xl p-5 md:p-6 max-w-2xl mx-auto w-full">
            <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
              <div>
                <div className="font-serif-sc text-2xl md:text-3xl font-bold text-warm-600">
                  {stats.completed}
                  <span className="text-base text-forest-500/50 font-normal">/{stats.total}</span>
                </div>
                <p className="text-xs md:text-sm text-forest-500 mt-1">已完成章节</p>
              </div>
              <div className="border-x border-warm-200/60">
                <div className="font-serif-sc text-2xl md:text-3xl font-bold text-warm-600">
                  {stats.totalScore.toLocaleString()}
                </div>
                <p className="text-xs md:text-sm text-forest-500 mt-1">累计音符</p>
              </div>
              <div>
                <div className="font-serif-sc text-2xl md:text-3xl font-bold text-warm-600">
                  {stats.unlocked}
                  <span className="text-base text-forest-500/50 font-normal">/{stats.total}</span>
                </div>
                <p className="text-xs md:text-sm text-forest-500 mt-1">已解锁曲目</p>
              </div>
            </div>
          </div>
        </footer>

        {showSettings && (
          <div className="absolute inset-0 z-50 bg-forest-900/50 backdrop-blur-md flex items-center justify-center px-6 animate-fade-in">
            <div className="glass-card rounded-3xl p-7 md:p-8 max-w-md w-full animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center shadow-md">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif-sc text-xl font-bold text-forest-800">设置</h3>
                    <p className="text-xs text-forest-500">调整你的专属演奏体验</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowResetConfirm(false);
                  }}
                  className="w-9 h-9 rounded-xl bg-warm-100/60 hover:bg-warm-200/60 border border-warm-200/60 flex items-center justify-center text-forest-600 transition-all hover:scale-105"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-7">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Volume2 className="w-4.5 h-4.5 text-warm-600" />
                      <label className="font-serif-sc text-forest-700 font-medium text-base">音量</label>
                    </div>
                    <span className="text-sm font-semibold text-warm-600 bg-warm-100/60 px-3 py-1 rounded-lg">
                      {Math.round(tempVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tempVolume * 100}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) / 100;
                      setTempVolume(v);
                      audioEngine.init();
                      audioEngine.setVolume(v);
                    }}
                    className="w-full h-2.5 bg-warm-100 rounded-full appearance-none cursor-pointer accent-warm-500"
                    style={{
                      background: `linear-gradient(to right, #D4A757 0%, #FFB347 ${tempVolume * 100}%, #F5E6C8 ${tempVolume * 100}%, #F5E6C8 100%)`,
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Gauge className="w-4.5 h-4.5 text-warm-600" />
                      <label className="font-serif-sc text-forest-700 font-medium text-base">音符速度</label>
                    </div>
                    <span className="text-sm font-semibold text-warm-600 bg-warm-100/60 px-3 py-1 rounded-lg">
                      {tempSpeed.toFixed(1)}×
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={tempSpeed * 100}
                    onChange={(e) => {
                      const s = parseInt(e.target.value) / 100;
                      setTempSpeed(s);
                    }}
                    className="w-full h-2.5 bg-warm-100 rounded-full appearance-none cursor-pointer accent-warm-500"
                    style={{
                      background: `linear-gradient(to right, #D4A757 0%, #FFB347 ${((tempSpeed - 0.5) / 1) * 100}%, #F5E6C8 ${((tempSpeed - 0.5) / 1) * 100}%, #F5E6C8 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-forest-500 mt-1.5 px-0.5">
                    <span>慢 (0.5×)</span>
                    <span className="text-forest-400 font-medium">1.0×</span>
                    <span>快 (1.5×)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-warm-200/60">
                  {!showResetConfirm ? (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-50/80 border border-rose-200/60 text-rose-500/85 hover:text-rose-600 hover:bg-rose-100/80 hover:border-rose-300/60 transition-all group"
                    >
                      <RotateCcw className="w-4.5 h-4.5 group-hover:rotate-[-90deg] transition-transform duration-500" />
                      <span className="font-medium">重置所有进度</span>
                    </button>
                  ) : (
                    <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200/60 animate-fade-in">
                      <p className="text-sm text-rose-700/90 mb-3 font-serif-sc">
                        ⚠️ 确认要重置吗？所有已解锁曲目和最高分会被清空。
                      </p>
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="flex-1 py-2.5 rounded-xl bg-white/80 border border-warm-200 text-forest-600 hover:bg-white font-medium transition-all text-sm"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => {
                            resetProgress();
                            setShowResetConfirm(false);
                            setShowSettings(false);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-md shadow-rose-500/25 transition-all text-sm"
                        >
                          确认重置
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-warm-200/60">
                <button
                  onClick={() => {
                    setTempVolume(saveData.settings.volume);
                    setTempSpeed(saveData.settings.noteSpeed);
                    setShowSettings(false);
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-warm-100/70 border border-warm-200/60 text-forest-700 font-medium hover:bg-warm-100 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    audioEngine.init();
                    audioEngine.setVolume(tempVolume);
                    updateSettings({
                      volume: tempVolume,
                      noteSpeed: tempSpeed,
                    });
                    setShowSettings(false);
                    setShowResetConfirm(false);
                  }}
                  className={clsx(
                    'flex-1 py-3 rounded-2xl text-white font-medium shadow-lg transition-all hover:scale-[1.02]',
                    'bg-gradient-to-r from-warm-400 to-warm-600 shadow-warm-500/30 hover:shadow-glow',
                  )}
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
