import React from 'react';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: string;
}

const SuggestedChannels: React.FC = () => {
  // Mock data for suggested channels
  const channels: Channel[] = [
    {
      id: '1',
      name: 'تکنولوژی روز',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
      subscribers: '۱۲۰ هزار'
    },
    {
      id: '2',
      name: 'آموزش برنامه‌نویسی',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=code',
      subscribers: '۸۵ هزار'
    },
    {
      id: '3',
      name: 'ورزشی',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sport',
      subscribers: '۲۰۰ هزار'
    },
    {
      id: '4',
      name: 'موسیقی ایرانی',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music',
      subscribers: '۱۵۰ هزار'
    },
    {
      id: '5',
      name: 'آشپزی',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cooking',
      subscribers: '۹۵ هزار'
    },
    {
      id: '6',
      name: 'گیمینگ',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gaming',
      subscribers: '۱۸۰ هزار'
    },
    {
      id: '7',
      name: 'سفر و گردشگری',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel',
      subscribers: '۷۵ هزار'
    },
    {
      id: '8',
      name: 'طبیعت و حیات وحش',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature',
      subscribers: '۱۱۰ هزار'
    }
  ];

  return (
    <div className="vitimo-card p-6">
      <h2 className="text-2xl font-bold text-white mb-6">کانال‌های پیشنهادی برای شما</h2>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 pb-4" style={{ minWidth: 'min-content' }}>
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex flex-col items-center space-y-3 min-w-[120px]"
            >
              <Link to={`/profile/${channel.id}`}>
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className="w-24 h-24 rounded-full border-3 border-vitimo-500 hover:border-vitimo-400 transition-all transform hover:scale-105"
                />
              </Link>
              <div className="text-center">
                <Link
                  to={`/profile/${channel.id}`}
                  className="font-medium text-white hover:text-vitimo-400 transition-colors block mb-1"
                >
                  {channel.name}
                </Link>
                <p className="text-xs text-text-muted">{channel.subscribers} دنبال‌کننده</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-vitimo-600 hover:bg-vitimo-500 text-white rounded-lg transition-all transform hover:scale-105 text-sm font-medium">
                <UserPlus className="w-4 h-4" />
                دنبال کردن
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedChannels;
