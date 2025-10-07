import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="vitimo-container">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-primary pb-24 md:pb-6">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Layout;