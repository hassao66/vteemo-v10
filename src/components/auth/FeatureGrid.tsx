/**
 * @file FeatureGrid.tsx
 * @description Enhanced feature grid with new card styling matching the redesign.
 * Optimized for RTL, small screens, and dark UI.
 */

import React from 'react'
import { Video, Radio, Mic2, Wallet } from 'lucide-react'

/** @interface FeatureItem
 *  @description Represents a single feature with icon, title, and short description.
 */
interface FeatureItem {
  icon: React.ReactNode
  title: string
  desc: string
  gradient: string
}

/**
 * @component FeatureGrid
 * @description Displays four key features in a responsive grid with enhanced styling.
 */
export default function FeatureGrid(): JSX.Element {
  const items: FeatureItem[] = [
    {
      icon: <Video className="h-6 w-6" aria-hidden="true" />,
      title: 'پخش ویدیو',
      desc: 'پخش ویدیو با کیفیت 4K و تجربه روان',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Radio className="h-6 w-6" aria-hidden="true" />,
      title: 'پخش زنده',
      desc: 'پخش زنده تعاملی با کیفیت بالا',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Mic2 className="h-6 w-6" aria-hidden="true" />,
      title: 'پادکست',
      desc: 'میزبانی و انتشار پادکست‌های اختصاصی',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      icon: <Wallet className="h-6 w-6" aria-hidden="true" />,
      title: 'کیف پول',
      desc: 'کیف پول ریالی با امنیت بالا',
      gradient: 'from-amber-500 to-amber-600'
    }
  ]

  return (
    <section aria-label="ویژگیها" className="text-right">
      {/* Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
          >
            {/* Icon container with gradient */}
            <div className={`mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} p-3 text-white shadow-lg`}>
              {item.icon}
            </div>
            
            {/* Content */}
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-1.5">
                {item.title}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </li>
        ))}
      </ul>
    </section>
  )
}
