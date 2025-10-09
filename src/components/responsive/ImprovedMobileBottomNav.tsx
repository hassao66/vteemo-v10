import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Upload, Radio, User, Crown, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ImprovedMobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const navItems = [
    {
      icon: Home,
      label: 'خانه',
      path: '/',
      color: 'text-purple-400',
      activeColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Search,
      label: 'جستجو',
      path: '/search',
      color: 'text-blue-400',
      activeColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Upload,
      label: 'آپلود',
      path: '/upload',
      color: 'text-green-400',
      activeColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      requireAuth: true,
      special: true
    },
    {
      icon: Radio,
      label: 'لایو',
      path: '/live',
      color: 'text-red-400',
      activeColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      badge: true
    },
    {
      icon: User,
      label: 'پروفایل',
      path: isAuthenticated ? `/profile/${user?.id}` : '/login',
      color: 'text-vitimo-400',
      activeColor: 'text-vitimo-500',
      bgColor: 'bg-vitimo-500/10'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.requireAuth && !isAuthenticated) {
      navigate('/login');
      return;
    }
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-dark-secondary/95 backdrop-blur-lg border-t border-dark-tertiary z-50 lg:hidden"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
        }}
      >
        <div className="grid grid-cols-5 h-16 relative">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            // Special handling for upload button (center, elevated)
            if (item.special) {
              if (!isAuthenticated) {
                return (
                  <div key={index} className="flex items-center justify-center">
                    <button
                      onClick={() => navigate('/login')}
                      className="absolute -top-8 bg-gradient-to-br from-vitimo-500 to-vitimo-600 rounded-full p-4 shadow-xl shadow-vitimo-500/30 hover:shadow-vitimo-500/50 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </button>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center justify-center"
                >
                  <button className="absolute -top-8 bg-gradient-to-br from-vitimo-500 to-vitimo-600 rounded-full p-4 shadow-xl shadow-vitimo-500/30 hover:shadow-vitimo-500/50 transition-all transform hover:scale-105 active:scale-95">
                    <Icon className="w-6 h-6 text-white" />
                  </button>
                </Link>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => handleNavClick(item)}
                className="flex flex-col items-center justify-center relative transition-all active:scale-95"
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute top-0 w-8 h-1 bg-gradient-to-r from-vitimo-400 to-vitimo-600 rounded-full"></div>
                )}
                
                {/* Icon with background */}
                <div className={`relative ${active ? item.bgColor : ''} rounded-lg p-2 transition-all`}>
                  <Icon className={`w-5 h-5 ${active ? item.activeColor : item.color}`} />
                  
                  {/* Live Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>

                {/* Label */}
                <span className={`text-xs font-medium mt-1 ${active ? item.activeColor : item.color}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Buttons - Only for authenticated users */}
      {isAuthenticated && (
        <>
          {/* Premium Button - Bottom Right */}
          <Link
            to="/premium"
            className="fixed bottom-20 right-4 lg:hidden z-40 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full p-3 shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all transform hover:scale-110 active:scale-95 animate-pulse-glow"
            style={{
              marginBottom: 'max(env(safe-area-inset-bottom), 0px)',
            }}
          >
            <Crown className="w-6 h-6 text-white" />
          </Link>

          {/* Wallet Button - Bottom Left */}
          <Link
            to="/wallet"
            className="fixed bottom-20 left-4 lg:hidden z-40 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full p-3 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all transform hover:scale-110 active:scale-95"
            style={{
              marginBottom: 'max(env(safe-area-inset-bottom), 0px)',
            }}
          >
            <Wallet className="w-6 h-6 text-white" />
          </Link>
        </>
      )}
    </>
  );
};

export default ImprovedMobileBottomNav;
