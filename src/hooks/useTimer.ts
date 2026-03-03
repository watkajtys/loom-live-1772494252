import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const currentTimeRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== null) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      currentTimeRef.current += deltaTime;
      setCurrentTime(currentTimeRef.current);
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      lastTimeRef.current = null;
    }

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, animate]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return { isPlaying, currentTime, currentTimeRef, togglePlay };
}
