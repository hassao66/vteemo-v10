import React, { ReactNode } from 'react';
import { useIsMobile } from '../../hooks/useBreakpoint';
import ImprovedMobileBottomNav from './ImprovedMobileBottomNav';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <>
      {children}
      {isMobile && <ImprovedMobileBottomNav />}
    </>
  );
};

export default ResponsiveLayout;
