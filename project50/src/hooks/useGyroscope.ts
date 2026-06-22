import { useState, useEffect, useCallback, useRef } from 'react';
import { normalizeAngle, clamp } from '@/utils/math';

interface UseGyroscopeOptions {
  sensitivity?: number;
  enabled?: boolean;
}

interface UseGyroscopeReturn {
  angle: number;
  isSupported: boolean;
  isCalibrated: boolean;
  calibrate: () => void;
  setSensitivity: (s: number) => void;
  setManualAngle: (angle: number) => void;
}

export function useGyroscope(options: UseGyroscopeOptions = {}): UseGyroscopeReturn {
  const { sensitivity: initialSensitivity = 1.0, enabled = true } = options;

  const [angle, setAngle] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [sensitivity, setSensitivityState] = useState(initialSensitivity);

  const calibrationOffset = useRef(0);
  const lastBeta = useRef(0);
  const lastGamma = useRef(0);
  const rawAngle = useRef(0);

  const calibrate = useCallback(() => {
    calibrationOffset.current = rawAngle.current;
    setIsCalibrated(true);
    setAngle(0);
  }, []);

  const setSensitivity = useCallback((s: number) => {
    setSensitivityState(clamp(s, 0.5, 2.0));
  }, []);

  const setManualAngle = useCallback((newAngle: number) => {
    const normalized = normalizeAngle(newAngle - calibrationOffset.current);
    setAngle(normalized);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      lastBeta.current = beta;
      lastGamma.current = gamma;

      let calculatedAngle = 0;

      if (window.innerHeight > window.innerWidth) {
        calculatedAngle = gamma * sensitivity;
      } else {
        calculatedAngle = beta * sensitivity;
      }

      rawAngle.current = calculatedAngle;
      const adjustedAngle = normalizeAngle(calculatedAngle - calibrationOffset.current);

      setAngle(adjustedAngle);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [enabled, sensitivity]);

  return {
    angle,
    isSupported,
    isCalibrated,
    calibrate,
    setSensitivity,
    setManualAngle
  };
}

export async function requestGyroscopePermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const DeviceOrientationEvent = window.DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };

  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.error('Gyroscope permission denied:', e);
      return false;
    }
  }

  return true;
}
