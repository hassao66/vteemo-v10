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
      <div className="vitimo-container min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <ImprovedSidebar />
          </aside>
          
          {/* Main Content */}
          <main className={`flex-1 p-2 md:p-4 lg:p-6 bg-primary ${isMobile ? 'pb-20' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Layout;