import { useEffect, useCallback } from 'react';
import { audioManager, AudioJudgementType } from '@/utils/audioManager';

interface UseAudioOptions {
  musicVolume?: number;
  sfxVolume?: number;
}

interface UseAudioReturn {
  playTone: (frequency: number, duration: number, type?: OscillatorType) => void;
  playHitSound: (type: AudioJudgementType) => void;
  playClick: () => void;
  startMetronome: (bpm: number) => void;
  stopMetronome: () => void;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  resumeBackgroundMusic: () => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  ensureAudioContext: () => void;
}

export function useAudio(options: UseAudioOptions = {}): UseAudioReturn {
  const { musicVolume, sfxVolume } = options;

  useEffect(() => {
    if (musicVolume !== undefined) {
      audioManager.setMusicVolume(musicVolume);
    }
    if (sfxVolume !== undefined) {
      audioManager.setSfxVolume(sfxVolume);
    }
  }, [musicVolume, sfxVolume]);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    audioManager.playTone(frequency, duration, type);
  }, []);

  const playHitSound = useCallback((type: AudioJudgementType) => {
    audioManager.playHitSound(type);
  }, []);

  const playClick = useCallback(() => {
    audioManager.playClick();
  }, []);

  const startMetronome = useCallback((bpm: number) => {
    audioManager.startMetronome(bpm);
  }, []);

  const stopMetronome = useCallback(() => {
    audioManager.stopMetronome();
  }, []);

  const startBackgroundMusic = useCallback(() => {
    audioManager.startBackgroundMusic();
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    audioManager.stopBackgroundMusic();
  }, []);

  const pauseBackgroundMusic = useCallback(() => {
    audioManager.pauseBackgroundMusic();
  }, []);

  const resumeBackgroundMusic = useCallback(() => {
    audioManager.resumeBackgroundMusic();
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    audioManager.setMusicVolume(volume);
  }, []);

  const setSfxVolume = useCallback((volume: number) => {
    audioManager.setSfxVolume(volume);
  }, []);

  const ensureAudioContext = useCallback(() => {
    audioManager.ensureContext();
  }, []);

  return {
    playTone,
    playHitSound,
    playClick,
    startMetronome,
    stopMetronome,
    startBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    setMusicVolume,
    setSfxVolume,
    ensureAudioContext,
  };
}
