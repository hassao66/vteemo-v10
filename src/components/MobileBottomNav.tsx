import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Upload, Radio, TrendingUp } from 'lucide-react';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { 
      icon: Layers, 
      label: 'مجموعه‌ها', 
      to: '/playlists',
      key: 'playlists'
    },
    { 
      icon: TrendingUp, 
      label: 'مرور کانال‌ها', 
      to: '/search',
      key: 'browse'
    },
    { 
      icon: Upload, 
      label: 'بارگذاری', 
      to: '/upload',
      key: 'upload',
      special: true
    },
    { 
      icon: Radio, 
      label: 'پخش زنده', 
      to: '/live',
      key: 'live'
    },
    { 
      icon: Home, 
      label: 'خانه', 
      to: '/',
      key: 'home'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-dark-secondary border-t border-dark-tertiary z-50 px-2 py-3">
      <div className="flex justify-around items-center max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          
          if (item.special) {
            return (
              <Link
                key={item.key}
                to={item.to}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 -mt-8 bg-vitimo-600 hover:bg-vitimo-500 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] text-text-muted mt-1">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.key}
              to={item.to}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                active 
                  ? 'text-vitimo-400' 
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'text-vitimo-400' : ''}`} />
              <span className={`text-[10px] mt-1 ${active ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
