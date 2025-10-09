import React, { ReactNode } from 'react';
import Header from './Header';
import ImprovedSidebar from './ImprovedSidebar';
import ResponsiveLayout from './responsive/ResponsiveLayout';
import { useIsMobile } from '../hooks/useBreakpoint';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <ResponsiveLayout>
      <div className="vitimo-container">
        <Header />
        <div className="flex">
          {!isMobile && <ImprovedSidebar />}
          <main className={`flex-1 p-6 bg-primary ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Layout;