import { useState, useEffect } from 'react';

interface ViewportSize {
  width: number;
  height: number;
}

export function useViewport(): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>(() => {
    if (typeof window === 'undefined') {
      return { width: 1920, height: 1080 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}
