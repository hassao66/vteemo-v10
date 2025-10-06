/**
 * @file BrandHeader.tsx
 * @description Brand header for the login page: shows brand name and short tagline with high-contrast styling.
 * Designed for RTL and dark backgrounds.
 */

import React from 'react'
import { PlayCircle } from 'lucide-react'

/**
 * @component BrandHeader
 * @description Displays the brand identity (logo mark + brand name) and a welcoming tagline.
 */
export default function BrandHeader(): JSX.Element {
  return (
    <header className="text-right">
      {/* Brand mark + name */}
      <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 border border-white/15 shadow-sm">
        <PlayCircle className="h-5 w-5 text-amber-300" aria-hidden="true" />
        <span className="text-sm text-white/80">به پلتفرم ویدیویی حرفهای خوش آمدید</span>
      </div>

      <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
          ویتیمو
        </span>
      </h1>

      <p className="mt-3 text-white/80 leading-relaxed">
        پلتفرم ویدیویی حرفهای با امکانات پیشرفته پخش زنده، پادکست و کیف پول ریالی.
      </p>
    </header>
  )
}
