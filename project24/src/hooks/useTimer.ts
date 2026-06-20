import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (autoStart = false) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
  }, []);

  const restart = useCallback(() => {
    setTime(0);
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return {
    time,
    isRunning,
    start,
    stop,
    reset,
    restart,
  };
};
