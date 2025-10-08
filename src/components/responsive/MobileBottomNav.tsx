import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Radio, Upload, Users, List } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      id: 'home',
      label: t('sidebar.home') || 'خانه',
      icon: Home,
      path: '/',
    },
    {
      id: 'live',
      label: t('sidebar.live') || 'پخش زنده',
      icon: Radio,
      path: '/live',
    },
    {
      id: 'upload',
      label: t('header.upload') || 'آپلود',
      icon: Upload,
      path: '/upload',
      isFab: true,
      requireAuth: true,
    },
    {
      id: 'channels',
      label: 'کانال‌ها',
      icon: Users,
      path: '/channels',
    },
    {
      id: 'playlists',
      label: 'لیست‌ها',
      icon: List,
      path: '/playlists',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-dark-secondary/95 backdrop-blur-lg border-t border-dark-tertiary z-[9998] md:hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
      }}
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          // Skip upload button if not authenticated
          if (item.requireAuth && !isAuthenticated) {
            return (
              <div key={item.id} className="flex items-center justify-center">
                <div className="w-11 h-11" />
              </div>
            );
          }

          if (item.isFab) {
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center justify-center"
              >
                <div className="absolute -top-6 bg-gradient-purple rounded-full p-3 shadow-purple hover:shadow-purple-lg transition-all transform hover:scale-110">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                active
                  ? 'text-vitimo-400'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-vitimo-400' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
