import React, { useRef, useEffect } from 'react';
import { useVideo } from '../../contexts/VideoContext';

interface ChipbarProps {
  categories?: string[];
  onCategoryChange?: (category: string) => void;
}

const defaultCategories = [
  'همه',
  'آموزشی',
  'سرگرمی',
  'تکنولوژی',
  'ورزشی',
  'موسیقی',
  'بازی',
  'طبیعت',
  'هنر',
  'کسب و کار',
  'سفر',
  'غذا',
];

const Chipbar: React.FC<ChipbarProps> = ({ 
  categories = defaultCategories,
  onCategoryChange 
}) => {
  const { selectedCategory, setSelectedCategory } = useVideo();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className="sticky top-[64px] z-40 bg-dark-primary/95 backdrop-blur-lg border-b border-dark-tertiary md:relative md:top-0">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category || 
                          (category === 'همه' && !selectedCategory) ||
                          (category === 'همه' && selectedCategory === 'Home') ||
                          (category === 'همه' && selectedCategory === 'All');

          return (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? 'bg-vitimo-600 text-white shadow-lg shadow-vitimo-600/30'
                  : 'bg-dark-tertiary text-text-muted hover:bg-dark-quaternary hover:text-white'
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Chipbar;
