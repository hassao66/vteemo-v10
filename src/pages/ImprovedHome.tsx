import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import LiveCard from '../components/LiveCard';
import PodcastCard from '../components/PodcastCard';
import SuggestedChannels from '../components/SuggestedChannels';
import CategoryBar from '../components/CategoryBar';
import Stories from '../components/Stories';
import { useVideo } from '../contexts/VideoContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Radio, Mic, TrendingUp, Loader2 } from 'lucide-react';
import { videosAPI, liveAPI } from '../services/supabase-api';
import type { Video, LiveStream } from '../lib/supabase';

const ImprovedHome: React.FC = () => {
  const { searchQuery, selectedCategory } = useVideo();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'videos' | 'live' | 'podcasts'>('videos');
  const [videos, setVideos] = useState<Video[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [videosRes, streamsRes] = await Promise.all([
        videosAPI.getVideos({ limit: 50 }),
        liveAPI.getStreams()
      ]);

      if (videosRes.success && videosRes.data) {
        setVideos(videosRes.data);
      }

      if (streamsRes.success && streamsRes.data) {
        setLiveStreams(streamsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || selectedCategory === 'Home' || selectedCategory === 'all' || !selectedCategory || video.category === selectedCategory;
    const isPublished = video.status === 'published';

    return matchesSearch && matchesCategory && isPublished;
  });

  const activeLiveStreams = liveStreams.filter(stream => stream.status === 'live');

  const tabs = [
    { id: 'videos', label: 'ویدیوها', icon: TrendingUp, count: filteredVideos.length },
    { id: 'live', label: 'پخش زنده', icon: Radio, count: activeLiveStreams.length },
    { id: 'podcasts', label: 'پادکست‌ها', icon: Mic, count: 12 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Tab Buttons - Above Stories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 text-sm md:text-base
                ${activeTab === tab.id 
                  ? 'bg-vitimo-500 text-white shadow-purple' 
                  : 'bg-dark-secondary text-text-muted hover:bg-dark-tertiary hover:text-white border border-dark-tertiary'
                }
              `}
            >
              <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium">{tab.label}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white' 
                  : 'bg-dark-tertiary text-text-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stories Section - Instagram Style */}
      <Stories />

      {/* Category Bar */}
      <CategoryBar />

      {/* Suggested Channels Section */}
      <SuggestedChannels />

      {/* Search Results Header */}
      {searchQuery && (
        <div className="vitimo-card p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            نتایج جستجو برای "{searchQuery}"
          </h2>
          <p className="text-text-secondary text-sm md:text-base">
            {filteredVideos.length} ویدیو پیدا شد
          </p>
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 md:p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-vitimo-500 animate-spin mb-4" />
            <p className="text-text-muted text-base md:text-lg">در حال بارگذاری...</p>
          </div>
        )}

        {/* Videos Tab */}
        {!loading && activeTab === 'videos' && (
          <>
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-dark-tertiary rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-text-muted" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">ویدیویی یافت نشد</h3>
                <p className="text-text-muted text-center max-w-md text-sm md:text-base">
                  {searchQuery 
                    ? `نتیجهای برای "${searchQuery}" پیدا نشد. لطفاً عبارت دیگری جستجو کنید.`
                    : 'در حال حاضر ویدیویی در این دسته‌بندی وجود ندارد.'
                  }
                </p>
              </div>
            )}
          </>
        )}

        {/* Live Tab */}
        {!loading && activeTab === 'live' && (
          <>
            {activeLiveStreams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {activeLiveStreams.map(stream => (
                  <LiveCard key={stream.id} stream={stream} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-dark-tertiary rounded-full flex items-center justify-center mb-6">
                  <Radio className="w-10 h-10 md:w-12 md:h-12 text-text-muted" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">پخش زنده‌ای فعال نیست</h3>
                <p className="text-text-muted text-center max-w-md text-sm md:text-base">
                  در حال حاضر هیچ پخش زنده‌ای در حال پخش نیست. بعداً دوباره بررسی کنید.
                </p>
              </div>
            )}
          </>
        )}

        {/* Podcasts Tab */}
        {!loading && activeTab === 'podcasts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <PodcastCard 
                podcast={{
                  id: '1',
                  title: 'پادکست تکنولوژی',
                  description: 'آخرین اخبار دنیای تکنولوژی',
                  thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400',
                  host: 'علی احمدی',
                  episodes: 25,
                  duration: '45:30'
                }}
              />
              <PodcastCard 
                podcast={{
                  id: '2',
                  title: 'پادکست کسب و کار',
                  description: 'راهنمای موفقیت در کسب و کار',
                  thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
                  host: 'سارا محمدی',
                  episodes: 18,
                  duration: '38:15'
                }}
              />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovedHome;
