import React, { useRef } from 'react';
import StoryCircle, { Story } from './StoryCircle';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Stories: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  // Sample stories data - in a real app, this would come from an API
  const stories: Story[] = [
    // Current user story (if authenticated)
    ...(isAuthenticated && user ? [{
      id: 'current-user',
      userId: user.id,
      username: user.username,
      avatar: user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: false,
      isViewed: false,
      isCurrentUser: true,
    }] : []),
    {
      id: '1',
      userId: 'user1',
      username: 'علی احمدی',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: true,
      isViewed: false,
    },
    {
      id: '2',
      userId: 'user2',
      username: 'سارا محمدی',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: true,
      isViewed: false,
    },
    {
      id: '3',
      userId: 'user3',
      username: 'محمد رضایی',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: true,
      isViewed: true,
    },
    {
      id: '4',
      userId: 'user4',
      username: 'نیلوفر کریمی',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: true,
      isViewed: false,
    },
    {
      id: '5',
      userId: 'user5',
      username: 'رضا حسینی',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: true,
      isViewed: false,
    },
    {
      id: '6',
      userId: 'user6',
      username: 'مریم نوری',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: true,
      isViewed: true,
    },
    {
      id: '7',
      userId: 'user7',
      username: 'امیر کاظمی',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: true,
      isViewed: false,
    },
    {
      id: '8',
      userId: 'user8',
      username: 'زهرا امینی',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      hasStory: true,
      isViewed: false,
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const scrollDirection = isRTL ? (direction === 'left' ? 1 : -1) : (direction === 'left' ? -1 : 1);
      scrollRef.current.scrollBy({ left: scrollAmount * scrollDirection, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-dark-secondary border border-dark-tertiary rounded-xl p-4 mb-4">
      {/* Left scroll button */}
      <button
        onClick={() => handleScroll('left')}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-dark-primary/90 hover:bg-dark-tertiary text-white shadow-lg transition-all"
        aria-label="Scroll left"
      >
        {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Stories container */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stories.map((story) => (
          <StoryCircle key={story.id} story={story} />
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => handleScroll('right')}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-dark-primary/90 hover:bg-dark-tertiary text-white shadow-lg transition-all"
        aria-label="Scroll right"
      >
        {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Stories;
