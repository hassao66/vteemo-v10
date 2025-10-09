import React, { useRef } from 'react';
import { useVideo } from '../contexts/VideoContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Home, Music, Gamepad2, Trophy, Newspaper, GraduationCap, 
  Lightbulb, Smile, Film, Tv, Radio, Code, Camera, 
  Palette, BookOpen, Heart, Plane, Car, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  gradient: string;
}

const categories: Category[] = [
  { id: 'all', name: 'همه', icon: Home, gradient: 'from-purple-500 to-pink-500' },
  { id: 'music', name: 'موسیقی', icon: Music, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'gaming', name: 'بازی', icon: Gamepad2, gradient: 'from-green-500 to-emerald-500' },
  { id: 'sports', name: 'ورزش', icon: Trophy, gradient: 'from-yellow-500 to-orange-500' },
  { id: 'news', name: 'اخبار', icon: Newspaper, gradient: 'from-red-500 to-rose-500' },
  { id: 'education', name: 'آموزش', icon: GraduationCap, gradient: 'from-indigo-500 to-purple-500' },
  { id: 'technology', name: 'تکنولوژی', icon: Lightbulb, gradient: 'from-cyan-500 to-blue-500' },
  { id: 'entertainment', name: 'سرگرمی', icon: Smile, gradient: 'from-pink-500 to-rose-500' },
  { id: 'movies', name: 'فیلم', icon: Film, gradient: 'from-violet-500 to-purple-500' },
  { id: 'series', name: 'سریال', icon: Tv, gradient: 'from-orange-500 to-red-500' },
  { id: 'live', name: 'زنده', icon: Radio, gradient: 'from-red-600 to-pink-600' },
  { id: 'programming', name: 'برنامهنویسی', icon: Code, gradient: 'from-slate-600 to-gray-700' },
  { id: 'photography', name: 'عکاسی', icon: Camera, gradient: 'from-teal-500 to-cyan-500' },
  { id: 'art', name: 'هنر', icon: Palette, gradient: 'from-fuchsia-500 to-pink-500' },
  { id: 'books', name: 'کتاب', icon: BookOpen, gradient: 'from-amber-500 to-yellow-500' },
  { id: 'lifestyle', name: 'سبک زندگی', icon: Heart, gradient: 'from-rose-500 to-pink-500' },
  { id: 'travel', name: 'سفر', icon: Plane, gradient: 'from-sky-500 to-blue-500' },
  { id: 'automotive', name: 'خودرو', icon: Car, gradient: 'from-gray-600 to-slate-700' },
];

const CategoryBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useVideo();
  const { isRTL } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const scrollDirection = isRTL ? (direction === 'left' ? 1 : -1) : (direction === 'left' ? -1 : 1);
      scrollRef.current.scrollBy({ left: scrollAmount * scrollDirection, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === 'all' ? 'Home' : categoryId);
  };

  const isActive = (categoryId: string) => {
    if (categoryId === 'all') {
      return selectedCategory === 'Home' || selectedCategory === 'all' || !selectedCategory;
    }
    return selectedCategory === categoryId;
  };

  return (
    <div className="sticky top-[64px] z-30 bg-dark-primary/95 backdrop-blur-lg border-b border-dark-tertiary">
      <div className="relative max-w-full mx-auto px-4 py-4">
        {/* Left scroll button */}
        <button
          onClick={() => handleScroll('left')}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-dark-secondary/90 hover:bg-dark-tertiary text-white shadow-lg transition-all"
          aria-label="Scroll left"
        >
          {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Categories container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-12 md:px-14"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            const active = isActive(category.id);

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
                aria-label={category.name}
              >
                <div
                  className={`
                    relative w-16 h-16 rounded-full flex items-center justify-center
                    transition-all duration-300 transform
                    ${active 
                      ? 'scale-110 animate-pulse-custom shadow-lg shadow-vitimo-500/50' 
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }
                  `}
                >
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${category.gradient} ${active ? 'opacity-100' : 'opacity-70'}`} />
                  <IconComponent className={`relative z-10 w-7 h-7 text-white ${active ? 'drop-shadow-lg' : ''}`} />
                  {active && (
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${category.gradient} animate-ping opacity-20`} />
                  )}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap transition-colors ${
                  active ? 'text-white' : 'text-text-muted group-hover:text-white'
                }`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => handleScroll('right')}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-dark-secondary/90 hover:bg-dark-tertiary text-white shadow-lg transition-all"
          aria-label="Scroll right"
        >
          {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default CategoryBar;
