import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, TrendingUp, Users, BookOpen, Clock, Heart, List,
  Radio, Mic, Crown, Gift, Wallet, Music, Gamepad2, 
  Trophy, Newspaper, GraduationCap, Lightbulb, Smile,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

interface SidebarItem {
  name: string;
  key: string;
  icon: React.ElementType;
  to?: string;
  gradient?: boolean;
  gold?: boolean;
  vitimo?: boolean;
  count?: number;
  badge?: string;
}

interface SidebarSection {
  title: string;
  titleKey: string;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

const ImprovedSidebar: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useVideo();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { balance } = useWallet();
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,
    library: true,
    live: false,
    premium: false,
    categories: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sections: SidebarSection[] = [
    {
      title: 'اصلی',
      titleKey: 'sidebar.main',
      defaultOpen: true,
      items: [
        { name: 'Home', key: 'sidebar.home', icon: Home, to: '/' },
        { name: 'Trending', key: 'sidebar.trending', icon: TrendingUp, to: '/trending' },
        { name: 'Subscriptions', key: 'sidebar.subscriptions', icon: Users, to: '/subscriptions' },
      ]
    },
    {
      title: 'کتابخانه',
      titleKey: 'sidebar.library',
      defaultOpen: true,
      items: [
        { name: 'Library', key: 'sidebar.library', icon: BookOpen, to: '/library' },
        { name: 'History', key: 'sidebar.history', icon: Clock, to: '/history' },
        { name: 'Liked Videos', key: 'sidebar.liked', icon: Heart, to: '/liked' },
        { name: 'Playlists', key: 'sidebar.playlists', icon: List, to: '/playlists' },
      ]
    },
    {
      title: 'زنده و پادکست',
      titleKey: 'sidebar.liveAndPodcast',
      defaultOpen: false,
      items: [
        { name: 'Live Streams', key: 'sidebar.live', icon: Radio, to: '/live', badge: 'LIVE' },
        { name: 'Podcasts', key: 'sidebar.podcasts', icon: Mic, to: '/podcasts', count: 24 },
      ]
    },
    {
      title: 'ویژگیهای ویژه',
      titleKey: 'sidebar.premium',
      defaultOpen: false,
      items: [
        { name: 'Premium', key: 'sidebar.premium', icon: Crown, to: '/premium', gradient: true },
        { name: 'Rewards', key: 'sidebar.rewards', icon: Gift, to: '/rewards', gold: true },
        { name: 'Wallet', key: 'sidebar.wallet', icon: Wallet, to: '/wallet', vitimo: true },
      ]
    },
    {
      title: 'دستهبندیها',
      titleKey: 'sidebar.categories',
      defaultOpen: false,
      items: [
        { name: 'Music', key: 'sidebar.music', icon: Music },
        { name: 'Gaming', key: 'sidebar.gaming', icon: Gamepad2 },
        { name: 'Sports', key: 'sidebar.sports', icon: Trophy },
        { name: 'News', key: 'sidebar.news', icon: Newspaper },
        { name: 'Education', key: 'sidebar.education', icon: GraduationCap },
        { name: 'Technology', key: 'sidebar.technology', icon: Lightbulb },
        { name: 'Entertainment', key: 'sidebar.entertainment', icon: Smile },
      ]
    }
  ];

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const isActive = (path?: string) => path && location.pathname === path;

  const SidebarItemComponent = ({ item, isCategory = false, onClick }: { 
    item: SidebarItem; 
    isCategory?: boolean; 
    onClick?: () => void;
  }) => {
    const IconComponent = item.icon;
    const active = isCategory ? selectedCategory === item.name : isActive(item.to);
    
    const content = (
      <div
        className={`
          sidebar-item w-full flex items-center justify-between px-4 py-3 
          transition-all duration-200 rounded-lg relative
          ${active
            ? 'active bg-vitimo-900/30 text-vitimo-400'
            : item.gradient
            ? 'bg-gradient-purple text-white shadow-purple hover:shadow-lg'
            : item.gold
            ? 'bg-gradient-gold text-dark-primary hover:shadow-gold'
            : item.vitimo
            ? 'bg-gradient-vitimo text-white hover:shadow-vitimo'
            : 'text-text-secondary hover:bg-dark-tertiary hover:text-white'
          }
        `}
      >
        {/* Active indicator */}
        {active && (
          <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-vitimo-500 rounded-${isRTL ? 'r' : 'l'}-lg`} />
        )}
        
        <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          <IconComponent className={`w-5 h-5 flex-shrink-0 ${active ? 'text-vitimo-400' : ''}`} />
          <span className="font-medium">{t(item.key)}</span>
        </div>

        <div className="flex items-center gap-2">
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded animate-pulse">
              {item.badge}
            </span>
          )}
          {item.count !== undefined && (
            <span className={`px-2 py-0.5 text-xs rounded ${
              active ? 'bg-vitimo-800/50 text-vitimo-300' : 'bg-dark-quaternary text-text-muted'
            }`}>
              {item.count}
            </span>
          )}
        </div>
      </div>
    );

    if (item.to) {
      return (
        <Link to={item.to} onClick={onClick}>
          {content}
        </Link>
      );
    }

    return (
      <button onClick={onClick} className="w-full">
        {content}
      </button>
    );
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-dark-secondary border-r border-dark-tertiary overflow-hidden flex flex-col">
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {sections.map((section, index) => {
          const isExpanded = expandedSections[Object.keys(expandedSections)[index]] ?? section.defaultOpen;
          
          return (
            <div key={section.titleKey}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(Object.keys(expandedSections)[index])}
                className="w-full flex items-center justify-between px-2 py-2 mb-2 text-xs font-bold text-text-muted uppercase tracking-wider hover:text-white transition-colors"
              >
                <span>{section.title}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarItemComponent
                      key={item.name}
                      item={item}
                      isCategory={section.titleKey === 'sidebar.categories'}
                      onClick={section.titleKey === 'sidebar.categories' ? () => setSelectedCategory(item.name) : undefined}
                    />
                  ))}
                </div>
              )}

              {/* Divider */}
              {index < sections.length - 1 && (
                <div className="mt-4 border-t border-dark-tertiary" />
              )}
            </div>
          );
        })}

        {/* Wallet Balance Card */}
        {isAuthenticated && (
          <div className="mt-6 p-4 bg-gradient-to-br from-vitimo-600 to-vitimo-800 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-vitimo-200 font-medium">موجودی کیف پول</span>
              <Wallet className="w-4 h-4 text-vitimo-200" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatBalance(balance)}
            </div>
            <div className="text-xs text-vitimo-200">تومان</div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-dark-tertiary p-4 bg-dark-primary/50">
        <div className="text-xs text-text-muted space-y-1">
          <p className="font-semibold text-white">© 2024 ویتیمو</p>
          <p>پلتفرم ویدیویی حرفهای</p>
          <p className="text-vitimo-400">نسخه 2.0</p>
        </div>
      </div>
    </aside>
  );
};

export default ImprovedSidebar;
