/**
 * @file FeatureGrid.tsx
 * @description A compact feature grid for the login landing: highlights core capabilities with icons.
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
}

/**
 * @component FeatureGrid
 * @description Displays four key features in a responsive grid with strong contrast and concise copy.
 */
export default function FeatureGrid(): JSX.Element {
  const items: FeatureItem[] = [
    {
      icon: <Video className="h-5 w-5 text-amber-300" aria-hidden="true" />,
      title: 'پخش ویدیو با کیفیت 4K',
      desc: 'تجربه تماشای شفاف و روان با کمترین بافر.'
    },
    {
      icon: <Radio className="h-5 w-5 text-amber-300" aria-hidden="true" />,
      title: 'پخش زنده تعاملی',
      desc: 'تعامل زنده با مخاطبان و کنترل پنل ساده.'
    },
    {
      icon: <Mic2 className="h-5 w-5 text-amber-300" aria-hidden="true" />,
      title: 'پادکستهای اختصاصی',
      desc: 'میزبانی و انتشار آسان اپیزودها.'
    },
    {
      icon: <Wallet className="h-5 w-5 text-amber-300" aria-hidden="true" />,
      title: 'کیف پول ریالی',
      desc: 'پرداخت امن و مدیریت شفاف درآمد.'
    }
  ]

  return (
    <section aria-label="ویژگیها" className="text-right">
      {/* Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >
            <div className="shrink-0 inline-flex items-center justify-center rounded-lg bg-white/10 p-2">
              {item.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base">{item.title}</h3>
              <p className="text-white/70 text-xs sm:text-sm mt-0.5">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
