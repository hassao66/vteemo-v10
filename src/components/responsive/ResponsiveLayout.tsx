import React, { ReactNode } from 'react';
import { useIsMobile } from '../../hooks/useBreakpoint';
import MobileBottomNav from './MobileBottomNav';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <>
      {children}
      {isMobile && <MobileBottomNav />}
    </>
  );
};

export default ResponsiveLayout;
