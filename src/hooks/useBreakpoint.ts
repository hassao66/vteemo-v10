import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

const breakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025,
};

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width <= breakpoints.mobile) return 'mobile';
    if (width <= breakpoints.tablet) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= breakpoints.mobile) {
        setBreakpoint('mobile');
      } else if (width <= breakpoints.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile';
}

export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'tablet';
}

export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'desktop';
}
