import { useState, useEffect, useCallback } from 'react';

interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

interface UseOrientationReturn {
  gravity: { x: number; y: number };
  isUsingGyro: boolean;
  setUseGyro: (use: boolean) => void;
}

export const useOrientation = (): UseOrientationReturn => {
  const [isUsingGyro, setIsUsingGyro] = useState(false);
  const [gravity, setGravity] = useState({ x: 0, y: 0 });

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (!isUsingGyro) return;
    
    const beta = event.beta ?? 0;
    const gamma = event.gamma ?? 0;
    
    const maxAngle = 45;
    const normalizedBeta = Math.max(-maxAngle, Math.min(maxAngle, beta - 45));
    const normalizedGamma = Math.max(-maxAngle, Math.min(maxAngle, gamma));
    
    setGravity({
      x: normalizedGamma / maxAngle,
      y: normalizedBeta / maxAngle,
    });
  }, [isUsingGyro]);

  useEffect(() => {
    if (isUsingGyro && typeof window !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [isUsingGyro, handleOrientation]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isUsingGyro) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const x = (event.clientX - centerX) / centerX;
    const y = (event.clientY - centerY) / centerY;
    
    setGravity({ x: x * 0.5, y: y * 0.5 });
  }, [isUsingGyro]);

  useEffect(() => {
    if (!isUsingGyro && typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isUsingGyro, handleMouseMove]);

  useEffect(() => {
    const stored = localStorage.getItem('useGyro');
    if (stored !== null) {
      setIsUsingGyro(stored === 'true');
    } else {
      setIsUsingGyro(!!navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/));
    }
  }, []);

  const setUseGyro = useCallback((use: boolean) => {
    setIsUsingGyro(use);
    localStorage.setItem('useGyro', use.toString());
    if (!use) {
      setGravity({ x: 0, y: 0 });
    }
  }, []);

  return { gravity, isUsingGyro, setUseGyro };
};