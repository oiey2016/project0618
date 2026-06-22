import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, RotateCcw, Gauge } from 'lucide-react';
import { loadSettings, saveSettings } from '@/utils/storage';
import { Settings as SettingsType } from '@/game/types';
import { useAudio } from '@/hooks/useAudio';
import { audioManager } from '@/utils/audioManager';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [settings, setSettings] = useState<SettingsType>({
    sensitivity: 1.0,
    musicVolume: 0.7,
    sfxVolume: 0.5,
    highScore: 0,
  });
  const [mounted, setMounted] = useState(false);
  const sfxTestTimeoutRef = useRef<number | null>(null);
  const musicTestTimeoutRef = useRef<number | null>(null);

  const {
    playClick,
    playTone,
    setMusicVolume,
    setSfxVolume,
    startBackgroundMusic,
    stopBackgroundMusic,
  } = useAudio({
    musicVolume: settings.musicVolume,
    sfxVolume: settings.sfxVolume,
  });

  useEffect(() => {
    setSettings(loadSettings());
    setMounted(true);
  }, []);

  useEffect(() => {
    setMusicVolume(settings.musicVolume);
    setSfxVolume(settings.sfxVolume);
  }, [settings.musicVolume, settings.sfxVolume, setMusicVolume, setSfxVolume]);

  useEffect(() => {
    return () => {
      stopBackgroundMusic();
      if (sfxTestTimeoutRef.current) clearTimeout(sfxTestTimeoutRef.current);
      if (musicTestTimeoutRef.current) clearTimeout(musicTestTimeoutRef.current);
    };
  }, [stopBackgroundMusic]);

  const handleSensitivityChange = (value: number) => {
    const newSettings = { ...settings, sensitivity: value };
    setSettings(newSettings);
    saveSettings({ sensitivity: value });
    playClick();
  };

  const handleMusicVolumeChange = (value: number) => {
    const newSettings = { ...settings, musicVolume: value };
    setSettings(newSettings);
    saveSettings({ musicVolume: value });

    if (musicTestTimeoutRef.current) {
      clearTimeout(musicTestTimeoutRef.current);
    }
    startBackgroundMusic();
    musicTestTimeoutRef.current = window.setTimeout(() => {
      stopBackgroundMusic();
    }, 2000);
  };

  const handleSfxVolumeChange = (value: number) => {
    const newSettings = { ...settings, sfxVolume: value };
    setSettings(newSettings);
    saveSettings({ sfxVolume: value });

    if (sfxTestTimeoutRef.current) {
      clearTimeout(sfxTestTimeoutRef.current);
    }
    sfxTestTimeoutRef.current = window.setTimeout(() => {
      playTone(660, 0.2, 'sine');
    }, 50);
  };

  const resetSettings = () => {
    audioManager.activateInGesture();
    audioManager.playClick();
    const defaults: SettingsType = {
      sensitivity: 1.0,
      musicVolume: 0.7,
      sfxVolume: 0.5,
      highScore: settings.highScore,
    };
    setSettings(defaults);
    saveSettings(defaults);
  };

  const handleBack = () => {
    audioManager.activateInGesture();
    audioManager.playClick();
    onBack();
  };

  return (
    <div className="fixed inset-0 flex flex-col p-6 overflow-auto">
      <div className="max-w-md w-full mx-auto">
        <div
          className={`transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleBack}
              className="glass-card p-3 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={20} className="text-white/70" />
            </button>
            <div>
              <div className="text-xl font-light text-white">设置</div>
              <div className="text-xs text-white/40">调整游戏参数</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <Gauge size={20} className="text-primary" />
                <div>
                  <div className="text-sm text-white">陀螺仪灵敏度</div>
                  <div className="text-xs text-white/40">调整指针转动的响应速度</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/40 w-8">慢</span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.sensitivity}
                    onChange={(e) => handleSensitivityChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-primary
                      [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(79,195,247,0.5)]
                      [&::-webkit-slider-thumb]:cursor-pointer
                    "
                    style={{
                      background: `linear-gradient(to right, #4FC3F7 0%, #4FC3F7 ${((settings.sensitivity - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.1) ${((settings.sensitivity - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
                <span className="text-xs text-white/40 w-8">快</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-light text-primary">{settings.sensitivity.toFixed(1)}x</span>
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 size={20} className="text-secondary" />
                <div>
                  <div className="text-sm text-white">音乐音量</div>
                  <div className="text-xs text-white/40">背景音乐的音量大小</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <VolumeX size={14} className="text-white/40" />
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.musicVolume}
                    onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-secondary
                      [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(129,199,132,0.5)]
                      [&::-webkit-slider-thumb]:cursor-pointer
                    "
                    style={{
                      background: `linear-gradient(to right, #81C784 0%, #81C784 ${settings.musicVolume * 100}%, rgba(255,255,255,0.1) ${settings.musicVolume * 100}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
                <Volume2 size={14} className="text-white/40" />
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-light text-secondary">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 size={20} className="text-accent-purple" />
                <div>
                  <div className="text-sm text-white">音效音量</div>
                  <div className="text-xs text-white/40">命中效果音的音量大小</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <VolumeX size={14} className="text-white/40" />
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.sfxVolume}
                    onChange={(e) => handleSfxVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-accent-purple
                      [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(206,147,216,0.5)]
                      [&::-webkit-slider-thumb]:cursor-pointer
                    "
                    style={{
                      background: `linear-gradient(to right, #CE93D8 0%, #CE93D8 ${settings.sfxVolume * 100}%, rgba(255,255,255,0.1) ${settings.sfxVolume * 100}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                  />
                </div>
                <Volume2 size={14} className="text-white/40" />
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-light text-accent-purple">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
            </div>

            <button
              onClick={resetSettings}
              className="glass-button w-full py-3 bg-white/5 border-white/10 flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              恢复默认设置
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-white/30">
            <p>提示：在游戏开始时会自动校准陀螺仪</p>
            <p className="mt-1">桌面端可用鼠标拖拽控制指针</p>
          </div>
        </div>
      </div>
    </div>
  );
}
