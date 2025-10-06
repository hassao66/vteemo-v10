/**
 * @file BrandHeader.tsx
 * @description Brand header for the login page: shows logo, brand name and welcoming message.
 * Designed for RTL and dark backgrounds with new layout.
 */

import React from 'react'
import { PlayCircle } from 'lucide-react'

/**
 * @component BrandHeader
 * @description Displays the brand identity with logo on top, brand name, and welcoming message.
 */
export default function BrandHeader(): JSX.Element {
  return (
    <header className="text-right space-y-6">
      {/* Logo and Brand Name */}
      <div className="flex items-center justify-end gap-4">
        <div className="text-right">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
              ویتیمو
            </span>
          </h1>
          <p className="text-amber-300/80 text-sm font-medium mt-1">پلتفرم ویدیویی حرفه‌ای</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <PlayCircle className="h-10 w-10 sm:h-12 sm:w-12 text-black" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Welcome message */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          به پلتفرم ویدیویی حرفه‌ای خوش آمدید
        </h2>
        <p className="text-white/70 leading-relaxed text-sm sm:text-base">
          با ویتیمو، تجربه‌ای منحصربه‌فرد از پخش ویدیو، پخش زنده، پادکست و مدیریت درآمد را تجربه کنید. پلتفرمی که برای حرفه‌ای‌ها طراحی شده است.
        </p>
      </div>
    </header>
  )
}
